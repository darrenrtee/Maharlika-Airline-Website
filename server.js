var port = process.env.PORT || 3000
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
mongoose.connect("mongodb+srv://admin:1234@cluster0-exyjt.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useFindAndModify: false
})

app.use(session({
    resave: true,
    name:"webapdesecret",
    saveUninitialized: true,
    secret : "secretpass",
    cookie:{
        maxAge: 5*60*1000
    }
}))

app.use(express.static(path.join(__dirname, "/public")));

const urlencoder = bodyparser.urlencoded({
    extended: false
})

app.get("/", (req,res) =>{
    res.render("homepage.hbs", {
                currpage: '1'
            })
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
    else{
        User.findOne({username:user, password:pass}).then((doc)=>{
            console.log("user match")
            req.session.username = doc.username
            req.session.email = doc.email
            res.redirect("/home")
        }, (err)=>{

        }) 
    }
})

app.post("/signup",urlencoder,(req,res)=>{
    let username = req.body.un
    let email = req.body.email
    let pass = req.body.pass
    
    let user = new User({
        username: username,
        email: email,
        password: pass
    })
    
    user.save().then((doc)=>{
        console.log(doc)
    },(err)=>{
        
    })
    
    req.session.username = username
    req.session.email = email
    
    res.redirect("/home")
})


app.get("/home",(req,res)=>{
    
    BookedFlights.find({emailadd : req.session.email}, (err, docs)=>{
        if(err){
            res.render("loggedin.hbs",{
                username:req.session.username,
                currpage: '1',
                email: req.session.email
            })
        }
        else{
            res.render("loggedin.hbs", {
                currpage: '1',
                username : req.session.username,
                myflights: docs,
                email: req.session.email
            }) 
        }
    })
    
    
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


app.post("/deletemyflight",urlencoder,(req,res)=>{
    let flightid = req.body.kek
    
    BookedFlights.deleteOne({
        _id : flightid
    }, (err, doc)=>{
        if(err){
        }else{
            res.redirect("/home")
        }
    })    
})

app.post("/search",urlencoder,(req,res)=>{
    let flyFrom = req.body.FlyFrom
    let flyTo = req.body.FlyTo
    let date = req.body.Date
    
    Flights.find({flyFrom : flyFrom, flyTo : flyTo, departure : date}, (err, docs)=>{
        if(err){
            if(req.session.username){
                res.render("loggedin.hbs", {
                    currpage: '2',
                    username:req.session.username,
                    email: req.session.email
                })
            }else{
                res.render("homepage.hbs", {
                    currpage: '2'
                })
            }
            
        }else{
            if(req.session.username){
                res.render("loggedin.hbs", {
                    currpage: '2',
                    username :req.session.username,
                    results: docs,
                    email: req.session.email
                })
            }else{
                res.render("homepage.hbs", {
                    currpage: '2',
                    results: docs
                })
            }
        }
    })
})

app.post("/bookflight",urlencoder,(req,res)=>{
    let id = req.body.flightid
    req.session.id = id
    
    Flights.findOne({
        _id : id
    }, (err, doc)=>{
        if(err){
        }else{
            req.session.month = doc.month
            req.session.day = doc.day
            req.session.year = doc.year
            req.session.departuretime = doc.departuretime
            req.session.flyFrom = doc.flyFrom
            req.session.flyTo = doc.flyTo
            req.session.flightnum = doc.flightNum
            req.session.price = doc.price
        }
    })
    if(req.session.username){
        BookedFlights.find({emailadd : req.session.email}, (err, docs)=>{
        if(err){
            res.render("loggedin.hbs",{
                username:req.session.username,
                currpage: '4',
                email: req.session.email
            })
        }
        else{
            res.render("loggedin.hbs", {
                currpage: '4',
                username : req.session.username,
                myflights: docs,
                email: req.session.email
            }) 
        }
    })
    }
    
    else{
        res.render("homepage.hbs", {
                currpage: '3'        
        }) 
    }
    
})

app.post("/paymentinfo",urlencoder,(req,res)=>{
    let fullname = req.body.fn
    let nationality = req.body.nat
    let birthday = req.body.bday
    let emailaddress = req.body.email
    let passportnumber = req.body.pnum
    let expirydate = req.body.expd
    
    req.session.fullname = fullname
    req.session.nationality = nationality
    req.session.birthday = birthday
    req.session.email = emailaddress
    req.session.passportnumber = passportnumber
    req.session.expirydate = expirydate
    
    res.render("homepage.hbs", {
                currpage: '4'        
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

app.get("/booked",(req,res) =>{
    let booking = new BookedFlights({
        flightNum : req.session.flightnum,
        passportNum : req.session.passportnumber,
        fullname : req.session.fullname,
        emailadd : req.session.email,
        birthday : req.session.birthday,
        departuretime: req.session.departuretime,
        month: req.session.month,
        day: req.session.day,
        year: req.session.year,
        flyFrom : req.session.flyFrom,
        flyTo : req.session.flyTo,
        price : req.session.price
    })
    
    booking.save().then((doc)=>{
        console.log(doc)
        if(req.session.username){
            BookedFlights.find({emailadd : req.session.email}, (err, docs)=>{
                if(err){
                    res.render("loggedin.hbs",{
                        username:req.session.username,
                        currpage: '5',
                        email: req.session.email
                    })
                }
                else{
                    res.render("loggedin.hbs", {
                        currpage: '5',
                        username : req.session.username,
                        myflights: docs,
                        email: req.session.email
                    }) 
                }
            })
        }
    else {
            res.render("homepage.hbs", {
                currpage: '5',
                email: req.session.email
            })
        }
    })
})


app.listen(port, ()=>{
    console.log("live at port 3000");
})