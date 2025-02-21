import {UserManager, UserManagerSettings, WebStorageStateStore} from "oidc-client-ts";

const oidcConfig:UserManagerSettings = {
    authority: import.meta.env.VITE_AUTH_URL,
    client_id: import.meta.env.VITE_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
if (clientSecret) {
    oidcConfig.client_secret = clientSecret;
}

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
