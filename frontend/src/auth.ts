import { UserManager, WebStorageStateStore } from "oidc-client-ts";

const oidcConfig = {
    authority: "https://dev-54568768.okta.com/oauth2/default",
    client_id: "0oanh8xujzYWkeTBC5d7",
    // client_secret: '5g5fnPEHJpSP7Cfm6HNpL7bv17Kcxmct35jUfoQGenJI61_4C1_kai4fglmewwBb',
    redirect_uri: "http://localhost:5173/callback",
    post_logout_redirect_uri: "http://localhost:5173/",
    response_type: "code", // Authorization Code Flow
    scope: "openid profile email",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcConfig);

export const login = async () => {
    await userManager.signinRedirect();
};

export const logout = async () => {
    await userManager.signoutRedirect();
};

export const getUser = async () => {
    return await userManager.getUser();
};
