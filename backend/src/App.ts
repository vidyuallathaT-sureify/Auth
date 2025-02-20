import express from "express";
import passport from "passport";
import session from "express-session";
import {Profile, Strategy, VerifiedCallback} from "passport-saml";
import cors from 'cors'
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(cors({
    origin: 'http://localhost:9000',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}))

// Configure session middleware
app.use(
    session({
        secret: "your-secure-session-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false},
    }),
);

// app.use(bodyParser.json()); // support json encoded bodies
app.use(express.urlencoded({extended: true}));


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
            entryPoint: process.env.SAML_ENTRY_POINT!,
            issuer: process.env.SAML_ISSUER!,
            callbackUrl: process.env.SAML_CALLBACK_URL!,
            cert: process.env.SAML_CERT!,
        },
        (profile: Profile | null, done: VerifiedCallback) => {
            if (!profile) {
                return done(new Error("No profile found"), null);
            }
            console.log("SAML Profile:", profile.nameID);
            return done(null, profile);
        }
    )
);


// Home Route
app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.user)
        // @ts-ignore
        res.render('home', {username: req.user.firstName});
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
        res.render('index', {title: 'Home Page', message: 'Hello, World!'});
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


app.listen(9000, () => {
    console.log("Server is running on http://localhost:9000");
});
