import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../Context/AuthContext";
import { login } from "../Services/Api"

import "../Styles/Login.css"

function Login() {
    const { setAuth, setUser } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    //"asdd"
    //"Asdd1!"
    async function HandleLogin(e) {
        e.preventDefault();

        const { status, data } = await login(username, password);

        if (status === true) {
            setUser({
                username: data.userName,
                token: data.token
            });
            setAuth(true);

            navigate("/Tasks");
        }
        else {
            return null;
        }

        return status === true ? navigate('/Tasks') : null;
    }

    return (
        <div>
            <form>
                <label>Username</label>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />

                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

                <button onClick={(e) => HandleLogin(e)}>Submit</button>
            </form>
        </div>
    )
}

export default Login