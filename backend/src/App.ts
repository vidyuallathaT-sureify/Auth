import express from 'express'
import passport from "passport";
import session from 'express-session'
import {Strategy} from "passport-saml";

const app = express()

app.use(session(
    {
        resave: true,
        saveUninitialized: true,
        secret: 'anything'
    }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new Strategy(
    {
        entryPoint: 'https://dev-54568768.okta.com/app/dev-54568768_demoapp_1/exkm4sh93bvPvsx635d7/sso/saml',
        issuer: 'http://www.okta.com/exkm4sh93bvPvsx635d7',
        callbackUrl: 'http://localhost:3000/login',
        cert: 'MIIDqDCCApCgAwIBAgIGAZP+KLswMA0GCSqGSIb3DQEBCwUAMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGRldi01NDU2ODc2ODEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTAeFw0yNDEyMjUxNDEwNDJaFw0zNDEyMjUxNDExNDJaMIGUMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxFTATBgNVBAMMDGRldi01NDU2ODc2ODEcMBoGCSqGSIb3DQEJARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOj5pqeSzV5vdQI65Ziw/TIBajG7bshiJxaAeroLhnHoqPusCXBOOibRiNeUfnxzGI+2GMr9yuhcP16tOzaKTm8/sf0AFortPY429/IOYjQ2xJcone3bWZihOOy9fbRylYarc7Y7wOL/dM084wchyJPmVfeB+e/tmPd/Gt30EoVhlVb/DSw+CRZLLLjOHyjAhTPR6RWX8dgtJu7RQe5C3SjSJWXrg3f8NLMBC2g8Z3PHwGcwtnZ82o9K0e5iYARYkXm0v7FdwNEXEMFI+w6r+aqUTyidTC8UG3YeHK0VboOGvGWX+GRwIXE6esh+p65Q3dWCBcDoFEszr/yTzGWYpu0CAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAF9rXmNwqxBHmu/E3ExMIkCyGwNszeU3HGokIOPKsN9UI6wJWXZYPU/kHNJVF92jh2kfrKK4ZllQZEaKAktLi6tQSJkb5Zk167caYH7pEjTV5jJU/kKh0lp65Qis1O7TGdiqRul7El2gaSQFq3oH2VChQnlYhnYjfTUK2B+4/K65I5MPfwV1iy6nUJ4LL0nz+Cvnnub4/WLqwoC+QIg61jkFLn1Ji94BPiYzkSZmTgzROnl/HFvrFOjBpFF1qITbw5mFxBaLlElxN7tY16SmLb2VMp4xD+wIR+j72BjKSFrGnuRP/Ku6JcFUUr7WgOI0yo5UOR7y9Q/xNZ7dsen6aMg==',
    },
    (profile, done) =>
        done(null, profile)
    // console.log('CC', profile)
))


app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Logged in')
    } else {
        res.send('No active session');
    }
});

app.get('/login',
    passport.authenticate('saml',
        {
            successRedirect: '/',
            failureRedirect: '/login'
        })
);

app.post('/login/callback',
    passport.authenticate('saml',
        {
            failureRedirect: '/',
            failureFlash: true
        }),
    (req, res) => {
        res.redirect('/');
    }
);


app.listen(9000, () => {
    console.log('Server is running on port 9000')
})