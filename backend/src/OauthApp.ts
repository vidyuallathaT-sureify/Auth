import express from 'express';
// import path from 'path';
import * as oidcClient from 'openid-client'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 9010;
const OIDC_ISSUER = process.env.OIDC_ISSUER as unknown as URL;
const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = process.env.REDIRECT_URI as unknown as URL;

let client: any;
let issuer;

(async () => {
    issuer = await oidcClient.discovery(OIDC_ISSUER,CLIENT_ID,CLIENT_SECRET);
})();

let codeVerifier;
let codeChallenge

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.get('/', (req, res) => {
    res.render('index', { token: null });
});

app.get('/auth', async (req, res) => {
     codeVerifier = oidcClient.randomPKCECodeVerifier();
     codeChallenge = await oidcClient.calculatePKCECodeChallenge(codeVerifier);

    const authUrl = oidcClient.buildAuthorizationUrl(issuer,{
        scope: 'openid profile email',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    });
    res.redirect(authUrl.href);
});

app.get('/callback', async (req, res) => {
    const params = client.callbackParams(req);
    const tokenSet = await oidcClient.authorizationCodeGrant(issuer, req.url as unknown as URL,  { pkceCodeVerifier : codeVerifier });
    res.render('index', { token: JSON.stringify(tokenSet, null, 2) });
});

app.get('/client-credentials', async (req, res) => {
    const tokenSet = await client.grant({
        grant_type: 'client_credentials',
        scope: 'openid profile email',
    });
    res.render('index', { token: JSON.stringify(tokenSet, null, 2) });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
