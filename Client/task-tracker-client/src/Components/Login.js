import React, { useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../Context/AuthContext";
import { login } from "../Services/Api"
import { validateForm } from "../Helpers/ValidateForm"

import "../Styles/Form.css"
import "../Styles/Login.css"

function Login() {
    const { setAuth, setUser } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const usernameRef = useRef(username);

    const [password, setPassword] = useState("");
    const passwordRef = useRef(password);

    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();

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

        const { status, data } = await login(username, password);

        if (status === true) {
            setUser({
                username: data.userName,
                token: data.token
            });
            setAuth(true);
        }

        return status === true
            ? navigate('/Tasks')
            : null;
    }

    return (
        <div className="mx-auto container col-6">
            <form>
                <div className='mx-auto col-md-6'>
                    <label className="form-label">Username</label>
                    <input type='text'
                        className={formErrors.Username === undefined
                            ? 'form-control'
                            : 'form-control-error'}
                        id="Username" name="Username"
                        placeholder="Your Username..."
                        ref={usernameRef}
                        value={username} onChange={(e) => setUsername(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, null, null, "login")}
                    />
                    {
                        formErrors.Username !== undefined
                            ? <span>{formErrors.Username}</span>
                            : null
                    }
                </div>

                <div className='mx-auto col-md-6'>
                    <label className="form-label">Password</label>
                    <input type='password' className={formErrors.Password === undefined
                        ? 'form-control'
                        : 'form-control-error'}
                        id="Password" name="Password"
                        placeholder="Your Password..."
                        ref={passwordRef}
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, null, "login")}
                    />
                    {
                        formErrors.Password !== undefined
                            ? <span>{formErrors.Password}</span>
                            : null
                    }
                </div>

                <div className="mx-auto mt-3 mb-2 col-md-1">
                    <button
                        className="btn"
                        style={{ backgroundColor: "#a3cfbb" }}
                        name="Submit"
                        onClick={(e) => HandleLogin(e)}
                        disabled={Object.entries(formErrors).some(([x, v]) => v !== undefined) === true
                            || Object.values(formErrors).length === 0} >
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login