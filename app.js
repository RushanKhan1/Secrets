//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook");
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set("view engine", 'ejs');


app.use(bodyParser.urlencoded({extended: true}));


// while working with sessions and authentication packages, the order that you do stuff is important
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); // initializing passport
app.use(passport.session()); // telling express that we are going to use express-session to manage our sessions




mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});
mongoose.set("useCreateIndex", true); // did this to avoid the deprecation warning;

const userSchema = new mongoose.Schema({
    user: String,
    password: {
	required: false,
	type: String
    },
    googleId: String,
    facebookId: String,
    secret: [String]
});


// adding the plugins in the user model.
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);


passport.use(User.createStrategy()); // creating a local login strategy


// the method generates a function that is used by Passport to serialize users into the session
passport.serializeUser(function(user, done) { // creating a cookie
  done(null, user.id);
});

// the method generates a function that is used by Passport to deserialize users into the session
passport.deserializeUser(function(id, done) {  // opening the cookie to reveal user information
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/submit"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/submit"
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, (err, user) => {
	return cb(err, user);
    });    
}));



app.get("/", (req, res) => {
    res.render("home");
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));


app.get("/auth/facebook", passport.authenticate("facebook"));


app.get("/auth/google/submit", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    // if authentication is successful
    res.render("submit");
});

app.get("/auth/facebook/submit", passport.authenticate('facebook', { failureRedirect: "/login" }), (req, res) => {
   // authentication is successful 
    res.render("submit");
});


app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});


// array to store all of the user secrets in one place
let allSecrets = [""];

// if the user is logged in and authenticated for their current session then they will be able to access the secrets route directly
// for the active session
// this happens due to the cookie that saves the session ID
app.get("/secrets", (req, res) => {
	
    //finding all secrets
	User.find({"secret": {$exists: true, $ne: [] }}, (err, foundUsers) => {
	    if (err) {
		console.log(err);
	    } 
	    else {
		if (foundUsers) {
		    allSecrets.push(foundUsers.secret);
		    console.log(foundUsers.secret);
		    res.render("secrets", {foundUsers: allSecrets});
		}
		else {
		    console.log("No user found!");
		    res.redirect("/login")
		}
		
	    }});
		
    
});


app.get("/logout", (req, res) => {

    req.logout();
    res.redirect("/");

});

app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) {
	res.render("submit");
    }
    else {
	res.redirect("/login");
    }
});


app.post("/submit", (req, res) => {
    var secret = req.body.secret;
    secret = secret.toString();
    User.findById(req.user.id, (err, foundUser) => {
	if (err) {
	    console.log(err);
	}
	else {
	    foundUser.secret.push(secret);
	    console.log(foundUser.secret)
	    foundUser.save();
	    console.log(foundUser);
	    allSecrets.push(secret)
	    res.render("secrets", {foundUsers: allSecrets});
	}
    })
    
})

app.post("/register", (req, res) => {

    // register method is part of the passport local mongoose plugin
    // used to register the user.
    // saves the password as a salted hash, the salt and the username as plain text in the db.
    // this method also checks if the username is unique
    // register(username object, password, callback)
    User.register({username: req.body.username}, req.body.password, (err, user) => {
	if (err) {
	    console.log(err);
	    res.redirect("/register")
	}
	else {
	    // passportlocalmongoose's method
	    // the method authenticates the user 
	    // callback is only triggered when the user has been successfully registered.
	    // meaning that we have successfully setup a cookie that saved their current logged in session
	    passport.authenticate("local")(req, res, () => {
		res.redirect("/secrets");
	    });
	}
    });

});




app.post("/login", (req, res) => {


    const user = new User({
	username: req.body.username,
	password: req.body.password
    });

    // passport's method for establishing a login session
    // On completion the user will be assigned to req.user
    req.login(user, (err) => {

		if (err) {
	    console.log(err);
	}
	else {
	    passport.authenticate("local")(req, res, () => {
		res.redirect("/secrets");
	    });
	}
    })
});


let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000; 
}


app.listen(port, (err) => {
    if(err) {
	console.log(err);
    }
    else {
	console.log("Server started successfully.");
    }
})

// make user redirect to the home page after logging in.
