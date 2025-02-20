import React, { useState, useEffect } from "react";
import { login, logout, getUser } from "./auth";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser().then((user) => {
            if (user) setUser(user);
        });
    }, []);

    return (
        <div>
            <h1>OIDC Demo</h1>
            {user ? (
                <>
                    <p>Welcome, {user.profile.name}</p>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <button onClick={login}>Login</button>
            )}
        </div>
    );
};

export default App;
