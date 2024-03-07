import React, { useRef, useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useAuth } from '../Hooks/useAuth';
import useRedirect from "../Hooks/useRedirect";

import { login } from "../Services/Api"

import isFormInvalid from '../Helpers/FormErrorsValidator';

import CustomInput from "./CustomInput";
import CustomButton from './CustomButton';

import "../Styles/Form.css"
import "../Styles/Login.css"

export default function Login() {
    const { setAuth, setUser } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useRedirect("signed");

    const [username, setUsername] = useState("");
    const usernameRef = useRef(username);

    const [password, setPassword] = useState("");
    const passwordRef = useRef(password);

    const [errorMessages, setErrorMessages] = useState(null);
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

        if (isFormInvalid(formErrors) === true) {
            return;
        }

        const { state, data, messages } = await login(username, password);

        if (state === false) {
            setErrorMessages(messages);
            return;
        }

        setUser({
            username: data.userName,
            token: data.token
        });
        setAuth(true);

        return state === true
            ? location.state !== null
            : navigate(location.state?.from?.pathname)
                ? navigate("/Tasks")
                : null;
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
                    formErrors={formErrors} setFormErrors={setFormErrors} formType={null}
                    password={password} confirmPassword={null} disabled="" />

                <CustomInput type="password" name="Password" refValue={passwordRef} value={password} setValue={setPassword}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType={null}
                    password={password} confirmPassword={null} disabled="" />

                <CustomButton handleOnClick={HandleLogin} formErrors={formErrors} name="Login" />

                <p className="pt-3">Don't have an account? <Link to="/Register">Register</Link></p>
            </form>
        </div>
    )
}
