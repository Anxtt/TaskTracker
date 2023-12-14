import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'

import { register } from "../Services/Api"
import { validateForm } from "../Helpers/ValidateForm"

import '../Styles/Register.css'

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();

    async function HandleRegister(e) {
        e.preventDefault();

        return Object.entries(formErrors).some(([x, v]) => v !== undefined) === true
            || Object.keys(formErrors).length === 0 // JSON.stringify(formErrors) === '{}'
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
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, null, null)}
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
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, null, null)}
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
                            || Object.keys(formErrors).length === 0} >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Register