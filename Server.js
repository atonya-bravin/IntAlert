const express = require("express");
const path = require("path");


const app = express();
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'Views/home_page.html'));
});

app.get('/sign-up', (req, res)=>{
    res.sendFile(path.resolve(__dirname,'Views/Sign-up.html'));
});

app.get('/sign-in', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'Views/sign-in.html'));
});

app.get('/change-password', (req, res)=>{
    res.sendFile(path.resolve(__dirname, "Views/forgot_password.html"));
});

app.listen(3000, ()=>{
    console.log("Welcome to IntAlert server listening to port 3000");
})