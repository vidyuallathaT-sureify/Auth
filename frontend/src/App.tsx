/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route, Routes } from "react-router";
import { OktaAuth } from "@okta/okta-auth-js";
import { LoginCallback, Security } from "@okta/okta-react";

const oktaAuth = new OktaAuth({
  issuer: "https://{yourOktaDomain}/oauth2/default",
  clientId: "{yourClientID}",
  redirectUri: window.location.origin + "/login/callback",
  scopes: ["openid", "profile", "email", "offline_access"],
});

function App() {
  const LoginC = () => <LoginCallback />;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const restoreOriginalUri = (_oktaAuth: any, _originalUri: any) => {};
  return (
    <>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
        <Routes>
          <Route path="/" element={<>Home</>} />
          <Route path="/login/callback" element={LoginC()} />
        </Routes>
      </Security>
    </>
  );
}

export default App;
