import React, { createContext, useEffect, useContext, useState } from "react";

import { verifyUser } from '../Services/Api';

const AuthContext = createContext(
    {
        auth: null,
        setAuth: () => { },
        user: null
    });

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);

    console.log("useAuth.js");
    console.log("Before:");
    console.log(auth);
    console.log(user);

    useEffect(() => {
        async function isAuth(){
            try {                
                // need to make a request to get user data and pass it to setUser();
                const data = await verifyUser();
                
                console.log("UseEffect in useAuth.js:")
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

        isAuth();
    }, [auth]);

    console.log("After:");
    console.log(auth);
    console.log(user);

    return (
        <AuthContext.Provider value={{ auth, setAuth, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;