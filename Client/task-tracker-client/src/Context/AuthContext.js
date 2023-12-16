import React, { createContext, useEffect, useState } from 'react'

import { verifyUser } from '../Services/Api'

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);

    console.log("AuthContext.js");
    console.log("Before:");
    console.log(auth);
    console.log(user);

    useEffect(() => {
        async function getData() {
            try {
                const data = await verifyUser();

                console.log("UseEffect in AuthContext:")
                console.log(data);

                if (data !== undefined) {
                    setUser({
                        username: data.userName,
                        token: data.token
                    });
                    setAuth(true);
                }
            } catch (error) {
                setUser(null);
                setAuth(false);
                console.log(error);
                console.log("Could not verify the user.");
            }
        }

            getData();
    }, [auth]);

    console.log("After:");
    console.log(auth);
    console.log(user);

    return (
        <AuthContext.Provider value={{ auth, setAuth, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};