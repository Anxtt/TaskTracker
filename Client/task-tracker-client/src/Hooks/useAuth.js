import React, { createContext, useEffect, useContext, useState } from "react";

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

    console.log(children);

    useEffect(() => {
        async function isAuth(){
            try {                
                console.log(user);
                console.log(auth);
                console.log(children);
                
                // need to make a request to get user data and pass it to setUser();

                setUser(true);

                console.log(user);
                console.log(auth);
                console.log(children);
            } catch (error) {
                setUser(null);
            }
        }

        isAuth();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;