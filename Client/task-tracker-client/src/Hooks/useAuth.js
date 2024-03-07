import React, { createContext, useContext, useEffect, useState } from "react";

import { verifyUser } from '../Services/Api';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function isAuth() {
            try {
                const data = await verifyUser();

                if (data === null || ignore === true) {
                    return;
                }

                setUser({
                    username: data.userName,
                    token: data.token
                });
                setAuth(true);
            } catch (error) {
                setAuth(false);
                setUser(null);
                alert("Could not verify the user.");
            }
        }

        isAuth();

        return () => {
            ignore = true;
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
