import express from "express";
import passport from "passport";
import session from "express-session";
import {Profile, Strategy, VerifiedCallback} from "passport-saml";
import * as Saml2js  from "saml2js";

const app = express();

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
        "https://dev-54568768.okta.com/app/dev-54568768_demoapp_1/exkm4sh93bvPvsx635d7/sso/saml",
      issuer: "http://www.okta.com/exkm4sh93bvPvsx635d7",
      callbackUrl: "http://localhost:9001/callback",
      cert: "MIIDqDCCApCgAwIBAgIGAZP+KLswMA0GCSqGSIb3DQEBCwUAMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGRldi01NDU2ODc2ODEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0yNDEyMjUxNDEwNDJaFw0zNDEyMjUxNDExNDJaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGRldi01NDU2ODc2ODEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOj5pqeSzV5vdQI65Ziw/TIBajG7bshiJxaAeroLhnHoqPusCXBOOibRiNeUfnxzGI+2GMr9yuhcP16tOzaKTm8/sf0AFortPY429/IOYjQ2xJcone3bWZihOOy9fbRylYarc7Y7wOL/dM084wchyJPmVfeB+e/tmPd/Gt30EoVhlVb/DSw+CRZLLLjOHyjAhTPR6RWX8dgtJu7RQe5C3SjSJWXrg3f8NLMBC2g8Z3PHwGcwtnZ82o9K0e5iYARYkXm0v7FdwNEXEMFI+w6r+aqUTyidTC8UG3YeHK0VboOGvGWX+GRwIXE6esh+p65Q3dWCBcDoFEszr/yTzGWYpu0CAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAF9rXmNwqxBHmu/E3ExMIkCyGwNszeU3HGokIOPKsN9UI6wJWXZYPU/kHNJVF92jh2kfrKK4ZllQZEaKAktLi6tQSJkb5Zk167caYH7pEjTV5jJU/kKh0lp65Qis1O7TGdiqRul7El2gaSQFq3oH2VChQnlYhnYjfTUK2B+4/K65I5MPfwV1iy6nUJ4LL0nz+Cvnnub4/WLqwoC+QIg61jkFLn1Ji94BPiYzkSZmTgzROnl/HFvrFOjBpFF1qITbw5mFxBaLlElxN7tY16SmLb2VMp4xD+wIR+j72BjKSFrGnuRP/Ku6JcFUUr7WgOI0yo5UOR7y9Q/xNZ7dsen6aMg==",
    },
      (profile: Profile | null, done: VerifiedCallback) => {
      if (!profile) {
        return done(new Error("No profile found"), null);
      }
      console.log("SAML Profile:", profile.nameID);
      return done(null, profile); // Pass profile to the session
    },
  ),
);

// Home Route
app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        // SAML profile is stored in req.user
        console.log("SAML Profile:", req.user);

        // Send profile info as a response
        res.json({
            message: "User authenticated successfully",
            profile: req.user,
        });
    } else {
        console.log("User is not authenticated");
        res.status(401).json({ message: "User is not authenticated" });
    }
});

// SAML Login Route
app.get(
  "/login",
  passport.authenticate("saml", {
    failureRedirect: "/",
  }),
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
