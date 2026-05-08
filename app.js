const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const port = 9090;

const url = "mongodb://localhost:27017/MoneyMates";
const ExpressError = require("./utils/ExpressError");
const User = require("./models/users");

const userRouter = require("./routes/UserRoute");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/views")));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionOptions = {
  secret: "Devsquad_Secret_Token",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

//home route
app.get("/", (req, res) => {
  res.send("page is Running");
});
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.deletes = req.flash("deletes");
  res.locals.currUser = req.user;
  next();
});

app.use("/", userRouter);

main()
  .then(() => {
    console.log(`Connected on ${url}`);
  })
  .catch((err) => {
    throw err;
  });

async function main() {
  await mongoose.connect(url);
}

app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.listen(port, () => {
  console.log(`Running on ${port}`);
});
