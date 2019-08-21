const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
const hbs = require("hbs")
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")
const url = require("url")

const app = express();
var path = require("path");

const User = require("./model.js").User
const Flights = require("./model.js").Flights
const BookedFlights = require("./model.js").BookedFlights

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/flight_DB_final", {
    useNewUrlParser:true,
    useFindAndModify: false
})

app.use(express.static(path.join(__dirname, "/public")));

const urlencoder = bodyparser.urlencoded({
    extended: false
})

app.get("/", (req,res) =>{
    res.sendFile(__dirname + "/public/html/homepage.html")
})

app.get("/logout",(req,res)=>{
    res.redirect("/")
})

app.post("/login",urlencoder,(req,res)=>{
    let user = req.body.un
    let pass = req.body.pw
    
    if(user === 'admin' && pass === '1234'){
        res.redirect("/admin")
    }
})

app.post("/add",urlencoder,(req,res)=>{
    let flyFrom = req.body.flyFrom
    let flyTo = req.body.flyTo
    let departure = req.body.departure
    let departuretime = req.body.departuretime
    let price = req.body.price
    var months = ["January", "Febuary", "March","April","May","June","July","August","September","October","November","December"];
    
    let date = new Date(departure)
    let month = months[date.getMonth()]
    let day = date.getDate()
    let year = date.getYear() + 1900
    
    let flight = new Flights({
        flightNum : Math.random().toString().slice(2,11),
        flyFrom : flyFrom,
        flyTo : flyTo,
        departure : departure,
        departuretime :departuretime,
        month: month,
        day: day,
        year: year,
        arrival : departure, 
        price : price
    })
    
    flight.save().then((doc)=>{
        console.log(doc)
        res.redirect("/admin")
    }, (err)=>{
        res.send(err)
    }) 
})

app.post("/deleteflight",urlencoder,(req,res)=>{
    let flightid = req.body.delflight
    
    Flights.deleteOne({
        _id : flightid
    }, (err, doc)=>{
        if(err){
        }else{
            res.redirect("/admin")
        }
    })
    
})

app.get("/admin", (req,res) =>{
    Flights.find({}, (err, docs)=>{
        if(err){
            res.render("admin.hbs",{
            
            })
        }else{
            res.render("admin.hbs", {
                flights:docs
            })
        }
    })
})

app.listen(3000, ()=>{
    console.log("live at port 3000");
})