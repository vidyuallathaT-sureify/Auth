import express from "express";
import passport from "passport";
import session from "express-session";
import { Profile, Strategy, VerifiedCallback } from "passport-saml";
import cors from 'cors'

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(cors({
  origin: 'http://localhost:9000', // Replace with your app's URL
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}))

// Configure session middleware
app.use(
  session({
    secret: "your-secure-session-secret", // Use a strong, secure secret
    resave: false, // Avoid resaving session if unmodified
    saveUninitialized: false, // Do not save empty sessions
    cookie: { secure: false }, // Use true if behind HTTPS
  }),
);

// app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies


app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});




// SAML Strategy Configuration
passport.use(
  new Strategy(
    {
      entryPoint:
        "SSO_URL",
      issuer: "ISSUER",
      callbackUrl: "http://localhost:9000/callback",
      cert: "CERT",
    },
    (profile: Profile | null, done: VerifiedCallback) => {
      if (!profile) {
        return done(new Error("No profile found"), null);
      }
      console.log("SAML Profile:", profile.nameID);
      return done(null, profile);
    },
  ),
);

// Home Route
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user)
    // @ts-ignore
    res.render('home', { username: req.user.firstName });
  } else {
    console.log("User is not authenticated");
    res.render('login');
  }
});

// SAML Login Route
app.get(
  "/login",
  passport.authenticate("saml", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.render('index', { title: 'Home Page', message: 'Hello, World!' });
  }
);

app.post(
  "/callback",
  passport.authenticate("saml", {
    failureRedirect: "/",
  }
  ),
  (req, res) => {
    res.redirect("/");
  },
);


// Start the server
app.listen(9000, () => {
  console.log("Server is running on http://localhost:9000");
});
