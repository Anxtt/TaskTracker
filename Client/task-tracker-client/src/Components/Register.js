import React, { useEffect, useRef, useState } from "react"
import { useNavigate, Link, useLocation } from 'react-router-dom'

import { useAuth } from '../Hooks/useAuth';
import { register } from "../Services/Api"
import CustomInput from "./CustomInput"

import '../Styles/Form.css'

export default function Register() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (auth === true) {
            return location.state !== null
                ? navigate(location.state?.from?.pathname)
                : navigate("/Tasks");
        }
    }, [auth, location.state, navigate])

    const [username, setUsername] = useState("");
    const usernameRef = useRef(username);

    const [email, setEmail] = useState("");
    const emailRef = useRef(email);

    const [password, setPassword] = useState("");
    const passwordRef = useRef(password);

    const [confirmPassword, setConfirmPassword] = useState("");
    const confirmPasswordRef = useRef(password);

    const [errorMessages, setErrorMessages] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    async function HandleRegister(e) {
        e.preventDefault();

        if (username === "") {
            usernameRef.current.focus();
            usernameRef.current.blur();
            return;
        }
        else if (email === "") {
            emailRef.current.focus();
            emailRef.current.blur();
            return;
        }
        else if (password === "") {
            passwordRef.current.focus();
            passwordRef.current.blur();
            return;
        }
        else if (confirmPassword === "") {
            confirmPasswordRef.current.focus();
            confirmPasswordRef.current.blur();
            return;
        }

        if (Object.entries(formErrors).some(([x, v]) => v !== undefined) === true
            || Object.values(formErrors).length === 0) { // JSON.stringify(formErrors) === '{}'
            return null;
        }

        const { state, messages } = await register(email, username, password, confirmPassword);

        if (state === false) {
            setErrorMessages(messages);
            return null;
        }

        return navigate("/Login");
    }

    return (
        <div className="mx-auto col-6">
            {
                errorMessages !== null && errorMessages.length > 0
                    ? <span style={{ border: "3px solid #cfe2ff" }}>{errorMessages}</span>
                    : null
            }
            <form>
                <CustomInput type="text" name="Username" refValue={usernameRef} value={username} setValue={setUsername}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType="register"
                    password={password} confirmPassword={confirmPassword} />

                <CustomInput type="text" name="Email" refValue={emailRef} value={email} setValue={setEmail}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType="register"
                    password={password} confirmPassword={confirmPassword} />

                <CustomInput type="password" name="Password" refValue={passwordRef} value={password} setValue={setPassword}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType="register"
                    password={password} confirmPassword={confirmPassword} />

                <CustomInput type="password" name="Password Confirmation" refValue={confirmPasswordRef} value={confirmPassword} setValue={setConfirmPassword}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType="register"
                    password={password} confirmPassword={confirmPassword} />

                <div className="mx-auto mt-3 mb-2">
                    <button
                        className="btn"
                        style={{ backgroundColor: "#a3cfbb" }}
                        name="Submit"
                        onClick={(e) => HandleRegister(e)}
                        disabled={Object.entries(formErrors).some(([x, v]) => v !== undefined) === true} >
                        Register
                    </button>
                </div>

                <p className="pt-3">Already have an account? <Link to="/Login">Login</Link></p>
            </form>
        </div>
    )
}
