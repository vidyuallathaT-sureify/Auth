import { BrowserRouter, Route } from "react-router-dom";
import { OktaAuth } from "@okta/okta-auth-js";
import { Security } from "@okta/okta-react";

const oktaAuth = new OktaAuth({
  issuer: "http://www.okta.com/exkm4sh93bvPvsx635d7",
  redirectUri: window.location.origin + "/login/callback",
  scopes: ["openid", "profile", "email", "offline_access"],
});

const App = () => (
  <BrowserRouter>
    <Security oktaAuth={oktaAuth} restoreOriginalUri={async (_oktaAuth) => {}}>
      <Route path="/" element={<>Home</>} />
      <Route path="/login/callback" element={<></>} />
    </Security>
  </BrowserRouter>
);

export default App;
