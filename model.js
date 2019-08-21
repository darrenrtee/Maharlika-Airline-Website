const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
    username : String,
    password : String,
    email : String,
    bday : Date,
    nationality : String,
    passportNum : String,
    passportExpiry : Date,
    cardNum : Number,
    cardCCV : Number,
    cardExpiry : Date,
})

var flightSchema = mongoose.Schema({
    flightNum : String,
    flyFrom : String,
    flyTo : String,
    departure : Date,
    departuretime: String,
    month: String,
    day: String,
    year: String,
    arrival : Date,
    price : Number
})

var bookedFlightsSchema = mongoose.Schema({
    flightNum : String,
    passportNum : String
})

var User = mongoose.model("User", userSchema)
var Flights = mongoose.model("Flight", flightSchema)
var BookedFlights = mongoose.model("BookedFlight",bookedFlightsSchema)

module.exports = {
    User,
    Flights,
    BookedFlights
}