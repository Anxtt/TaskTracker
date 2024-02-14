import React, { useEffect, useRef, useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useAuth } from '../Hooks/useAuth';
import { login } from "../Services/Api"

import CustomInput from "./CustomInput";

import "../Styles/Form.css"
import "../Styles/Login.css"

export default function Login() {
    const { auth, setAuth, setUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (auth === true) {
            return location.state !== null
                ? navigate(location.state?.from?.pathname)
                : navigate("/Tasks");
        }
    }, [auth, location.state, navigate]);

    const [username, setUsername] = useState("");
    const usernameRef = useRef(username);

    const [password, setPassword] = useState("");
    const passwordRef = useRef(password);

    const [messages, setMessages] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    async function HandleLogin(e) {
        e.preventDefault();

        if (username === "") {
            usernameRef.current.focus();
            usernameRef.current.blur();
            return;
        }
        else if (password === "") {
            passwordRef.current.focus();
            passwordRef.current.blur();
            return;
        }

        if (Object.entries(formErrors).some(([x, v]) => v !== undefined) === true
            || Object.values(formErrors).length === 0) {
            return null;
        }

        const { state, data, messages } = await login(username, password);

        if (state === false) {
            setMessages(messages);
            return null;
        }
        else {
            setUser({
                username: data.userName,
                token: data.token
            });
            setAuth(true);
        }

        return state === true
            ? location.state !== null
            : navigate(location.state?.from?.pathname)
                ? navigate("/Tasks")
                : null;
    }

    return (
        <div className="mx-auto col-6">
            {
                messages !== null && messages.length > 0
                    ? <span style={{ border: "3px solid #cfe2ff" }}>{messages}</span>
                    : null
            }
            <form>
                <CustomInput type="text" name="Username" refValue={usernameRef} value={username} setValue={setUsername}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType={null}
                    password={password} confirmPassword={null} disabled="" />

                <CustomInput type="password" name="Password" refValue={passwordRef} value={password} setValue={setPassword}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType={null}
                    password={password} confirmPassword={null} disabled="" />

                <div className="mx-auto mt-3 mb-2 col-md-1">
                    <button
                        className="btn"
                        style={{ backgroundColor: "#a3cfbb" }}
                        name="Submit"
                        onClick={(e) => HandleLogin(e)}
                        disabled={Object.entries(formErrors).some(([x, v]) => v !== undefined) === true} >
                        Login
                    </button>
                </div>

                <p>Don't have an account? <Link to="/Register">Register</Link></p>
            </form>
        </div>
    )
}
