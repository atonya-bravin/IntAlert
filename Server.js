const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userModel = require("./Models/usersModel");
const complainsModel = require("./Models/complainsModel");
const bodyparser = require("body-parser");
const MONGO_BD_URL = "mongodb+srv://kibe:Laban6544@cluster2hng.nymctiq.mongodb.net/?retryWrites=true&w=majority"
const app = express();
const expressSession = require('express-session');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');

app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(expressSession({
    secret: 'IntAlert Application secret pass'
}));

const connectDatabase  = async () =>{
    await mongoose.connect(MONGO_BD_URL)
    const db = mongoose.connection;
    db.on('error', (error) => {
        return `Error connecting to the database ${error.message}`
    });
    db.once('open', () => {
        return ("Connected to the database")
    })
}

connectDatabase()

app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'Views/home_page.html'));
});

app.get('/sign-up', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'Views/Sign-up.html'));

});

app.post('/sign-up', (req, res)=>{
    if (req.body.password === req.body.confirmPassword) {
    userModel.create(req.body)
    .then(()=>{
            res.redirect("/Complains-bay")
        })
        .catch((error)=>{ 
            res.redirect("/error-500");
        });
    } else {
        res.status(400).send("Passwords do not match");
    }

})

app.get('/sign-in', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'Views/sign-in.html'));
});

app.post("/sign-in", (req, res)=> {
    userModel.findOne({ email: req.body.email })
    .then((user)=>{
        if (user.password === req.body.password) {
            req.session.user_id = user._id.toString();
            res.redirect("/complains-bay");
        } else { 
            res.status(400).send("Invalid password");
        }
    }).catch((err) => {
        res.status(400).send("Email does not exist" );
    });
});

app.get('/change-password', (req, res)=>{
    res.sendFile(path.resolve(__dirname, "Views/forgot_password.html"));
});

app.post('/change-password', (req, res)=>{
    if (req.body.password === req.body.confirmPassword) {
    userModel.findOneAndUpdate({email: req.body.email}, {password: req.body.password})
    .then((user)=>{
            res.status(200).send("User information updated successfully "  + user)
        })
        .catch((error)=>{ 
            res.status(500).send("Error updating  user " + error)
        });
    } else {
        res.status(400).send("Passwords do not match");
    }

})

app.get('/complains-bay', (req, res) =>{
    if(req.session.user_id === undefined){
        res.redirect("/sign-in");
    }
    else{
        res.sendFile(path.resolve(__dirname, "Views/dashboard-complain-bay.html"));
    }
});

app.post('/complains-bay', (req, res) =>{
    if (!req.body.link){
        res.status(400).send("Kindly enter the link");
    }
    else if(!req.body.description){
        res.status(400).send("Kindly enter the description");
    }
    else if(!req.body.violationType){
        res.status(400).send("Kindly enter the violation type");
    }
    req.body['user_id'] = req.session.user_id;
    complainsModel.create(req.body);
    res.redirect("/complains-tracker");
});

app.get("/complains-tracker", (req, res) => {
    if(req.session.user_id === undefined){
        res.redirect("/sign-in");
    }
    else{
        const session_user_id = req.session.user_id;
        complainsModel.find({user_id: session_user_id})
        .then((userComplains)=>{
            res.render("dashboard-complains-tracker",{
                userComplains: userComplains
            });
        });
    }
});

app.get("/complains-viewer", (req, res) => {
    complainsModel.find({'status': 'pending'}).then((complains)=>{
        res.render("complains-viewer",{
            complains: complains
        });
    });
});

app.post("/complains-viewer", (req, res) => {
    const complain_ids = req.body.complain_id;
    const moderator_conclusions = req.body.moderator_conclusion;
    console.log(moderator_conclusions);
    if (Array.isArray(complain_ids)){
        for (let complain_counter = 0; complain_counter < complain_ids.length; complain_counter++) {
            if (moderator_conclusions[complain_counter] == "Choose Violation Type"){
                continue;
            }
            console.log(complain_ids[complain_counter]);
            complainsModel.findByIdAndUpdate(complain_ids[complain_counter], {outcome: moderator_conclusions[complain_counter], status: "Completed"}).then(()=>{
                res.redirect("/complains-viewer");
            }).catch(err=>{
                console.log(err);
            });
        }
    }
    else {
        complainsModel.findByIdAndUpdate(complain_ids, {outcome: moderator_conclusions, status: "Completed"}).then(()=>{
            res.redirect("/complains-viewer");
        }).catch((err)=>{
            console.log(err);
        })
    }
});

app.get("/invitation", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "Views/dashboard-invitations.html"));
});

app.get("/tutorial", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "Views/dashboard-tutorials.html"))
});

app.post("/send-email", (req, res)=>{
    console.log("sending mail");
    // Create a transporter object
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'intalert.mailer@gmail.com',
            pass: 'hgkp bffp uwen qklw'
        }
    });
    
    const { recipient_mail, mail_body } = req.body;

    const intAlert_link_message = '<br/><br><b>IntAlert Link<b/><br/><br/><a href="/">localhost:3000</a>';
    const full_mail_body = mail_body + intAlert_link_message;

    // Email data
    const mailOptions = {
        from: 'intalert.mailer@gmail.com',
        to: recipient_mail,
        subject: 'Invitation to IntAlert',
        html: full_mail_body
    };

     // Send the email
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
});

app.get("/error-500",(req, res) => {
    res.sendFile(path.resolve(__dirname,"Views/Error_response_pages/500_error.html"));
});

app.get("/error-404",(req, res) => {
    res.sendFile(path.resolve(__dirname,"Views/Error_response_pages/404_error.html"));
});

app.get("/logout",(req, res)=>{
    req.session.destroy();
    res.redirect('/');
});

app.use((req, res, next) => {
    res.redirect("/error-404");
    next();
});

app.listen(3000, ()=>{
    console.log("Welcome to IntAlert server listening to port 3000");
})