import React, { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom'

import { register } from "../Services/Api"
import { validateForm } from "../Helpers/ValidateForm"

import '../Styles/Register.css'

function Register() {
    const [username, setUsername] = useState("");
    const usernameRef = useRef(username);

    const [email, setEmail] = useState("");
    const emailRef = useRef(email);

    const [password, setPassword] = useState("");
    const passwordRef = useRef(password);

    const [confirmPassword, setConfirmPassword] = useState("");
    const confirmPasswordRef = useRef(password);

    const [formErrors, setFormErrors] = useState({});


    const navigate = useNavigate();

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

        return Object.entries(formErrors).some(([x, v]) => v !== undefined) === true
            || Object.values(formErrors).length === 0 // JSON.stringify(formErrors) === '{}'
            ? null
            : await register(email, username, password, confirmPassword)
                ? navigate("/Login")
                : null;
    }

    return (
        <div className="mx-auto container col-6">
            <form>
                <div className='mx-auto col-md-6'>
                    <label className="form-label">Username</label>
                    <input type='text'
                        className={formErrors.Username === undefined
                            ? "form-control"
                            : "form-control-error"}
                        id="Username" name="Username"
                        placeholder="Your Username..."
                        ref={usernameRef}
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword)}
                    />
                    {
                        formErrors.Username !== undefined
                            ? <span className="">{formErrors.Username}</span>
                            : null
                    }
                </div>

                <div className="mx-auto col-md-6">
                    <label className="form-label">Email</label>
                    <input type='text'
                        className={formErrors.Email === undefined
                            ? "form-control"
                            : "form-control-error"}
                        id="Email" name="Email"
                        placeholder="Your Email..."
                        ref={emailRef}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword)}
                    />
                    {
                        formErrors.Email !== undefined
                            ? <span className="">{formErrors.Email}</span>
                            : null
                    }
                </div>

                <div className="mx-auto col-md-6">
                    <label className="form-label">Password</label>
                    <input type='password'
                        className={formErrors.Password === undefined
                            ? "form-control"
                            : "form-control-error"}
                        id="Password" name="Password"
                        ref={passwordRef}
                        placeholder="Your Password..."
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword)}
                    />
                    {
                        formErrors.Password !== undefined
                            ? <span className="">{formErrors.Password}</span>
                            : null
                    }
                </div>

                <div className="mx-auto col-md-6">
                    <label className="form-label">Confirm Password</label>
                    <input type='password'
                        className={formErrors.ConfirmPassword === undefined
                            ? "form-control"
                            : "form-control-error"}
                        id="ConfirmPassword" name="ConfirmPassword"
                        placeholder="Confirm Password..."
                        ref={confirmPasswordRef}
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword)}
                    />
                    {
                        formErrors.ConfirmPassword !== undefined
                            ? <span className="">{formErrors.ConfirmPassword}</span>
                            : null
                    }
                </div>

                <div className="mx-auto mt-3 mb-2 col-md-1">
                    <button
                        className="btn"
                        style={{ backgroundColor: "#a3cfbb" }}
                        name="Submit"
                        onClick={(e) => HandleRegister(e)}
                        disabled={Object.entries(formErrors).some(([x, v]) => v !== undefined) === true
                            || Object.values(formErrors).length === 0} >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Register