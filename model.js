const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
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
    passportNum : String,
    fullname : String,
    emailadd : String,
    birthday : Date,
    departuretime: String,
    month: String,
    day: String,
    year: String,
    flyFrom : String,
    flyTo : String,
    price : Number
})

var User = mongoose.model("User", userSchema)
var Flights = mongoose.model("Flight", flightSchema)
var BookedFlights = mongoose.model("BookedFlight",bookedFlightsSchema)

module.exports = {
    User,
    Flights,
    BookedFlights
}