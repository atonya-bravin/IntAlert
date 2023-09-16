const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userModel = require("./Models/usersModel")
const bodyparser = require("body-parser");
const { error } = require("console");
const MONGO_BD_URL = "mongodb+srv://kibe:Laban6544@cluster2hng.nymctiq.mongodb.net/?retryWrites=true&w=majority"
const app = express();
app.use(express.static('public'));

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

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
    userModel.create(req.body)
    .then((user)=>{
            res.status(200).send("User created successfully "  + user)
        })
        .catch((error)=>{ 
            res.status(500).send("Error creating user " + error)
        });

})

app.get('/sign-in', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'Views/sign-in.html'));
});

app.get('/change-password', (req, res)=>{
    res.sendFile(path.resolve(__dirname, "Views/forgot_password.html"));
});

app.listen(3000, ()=>{
    console.log("Welcome to IntAlert server listening to port 3000");
})