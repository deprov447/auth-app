var express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  // alerter= require("alert-node")
  User = require("./models/user.js"),
  LocalPass = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");
  
  var JSAlert= require("js-alert")
 

mongoose.connect("mongodb://localhost/auth_demo_app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var app = express();
app.set("view engine", "ejs");

// app.use(morgan('combined'))

app.use(
  require("express-session")({
    secret: "HashKeyforPassword",
    resave: false,
    saveUninitialized: false,
  })
);

passport.use(new LocalPass(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

/////////////////
//ROUTES
/////////////////

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/secret", isLoggedIn, function (req, res) {
  res.render("secret");
});

// app.post("/register", function (req, res) {
//   User.register(
//     new User({ username: req.body.username }),
//     req.body.password,
//     function (err, user) {
//       if (err) {
//         console.log(err);
//       }
//       {
//         passport.authenticate("local")(req, res, function () {
//           res.redirect("/");
//         });
//       }
//     }
//   );
// });

app.get("/login", function (req, res) {
  res.render("login");
});

app.post('/login',function (req, res) {
  User.findOne({username: req.body.username},function(err, user){
    if(user)
    {
      console.log("user exist")
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
    else
    {
      console.log("user doesnt exist")
      //////////
        User.register(
          new User({ username: req.body.username }),
          req.body.password,
          function (err, user) {
            if (err) {
              console.log(err);
            }
            {
              passport.authenticate("local")(req, res, function () {
                res.redirect("/secret");
              });
            }
          }
        );
      //////////
      res.redirect("/login");
    }
  })
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(1234, function () {
  console.log("AUTH STARTED");
  console.log("Go to localhost:1234/");
});
