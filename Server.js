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
    .then((user)=>{
            res.status(200).send("User created successfully "  + user)
        })
        .catch((error)=>{ 
            res.status(500).send("Error creating user " + error)
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
            res.status(200).sendFile(path.resolve(__dirname, 'Views/home_page.html'));
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
    res.sendFile(path.resolve(__dirname, "Views/dashboard-complain-bay.html"));
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
    complainsModel.create(req.body);
});

app.get("/complains-tracker", (req, res) => {
    const session_user_id = req.session.user_id;
    complainsModel.find({user_id: session_user_id})
    .then((userComplains)=>{
        res.render("dashboard-complains-tracker",{
            userComplains: userComplains
        });
    });
});

app.get("/complains-viewer", (req, res) => {
    complainsModel.find({}).then((complains)=>{
        res.render("complains-viewer",{
            complains: complains
        });
    });
});

app.listen(3000, ()=>{
    console.log("Welcome to IntAlert server listening to port 3000");
})