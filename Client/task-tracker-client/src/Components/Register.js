import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'

import { register } from "../Services/Api"

import "../Styles/Login.css"

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    async function HandleRegister(e) {
        e.preventDefault();

        const shouldNavigate = await register(email, username, password, confirmPassword);

        return shouldNavigate === true ? navigate("/Login") : null;
    }

    return (

        <div>
            <form>
                <label>Username</label>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />

                <label>Email</label>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

                <label>Confirm Password</label>
                <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <button onClick={(e) => HandleRegister(e)}>Submit</button>
            </form>
        </div>
    )
}

export default Register