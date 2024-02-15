import React, { createContext, useEffect, useContext, useState } from "react";

import { verifyUser } from '../Services/Api';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function isAuth() {
            try {
                const data = await verifyUser();

                if (data !== null && ignore === false) {
                    setUser({
                        username: data.userName,
                        token: data.token
                    });
                    setAuth(true);
                }
            } catch (error) {
                setUser(null);
                setAuth(false);
                console.log("Could not verify the user.");
            }
        }

        let ignore = false;
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
