import React, { useContext } from "react"
import { Link } from "react-router-dom"

import { AuthContext } from "../Context/AuthContext"

import { logout } from "../Services/Api"

import "../Styles/Header.css"

function Header() {
    const { auth, setAuth, setUser } = useContext(AuthContext);

    return (
        <nav className="mx-auto">
            <div className="mx-auto">
                <ul>
                    <li className="navigation">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="navigation mx-auto">
                        <div id="dropdown-div" className="mx-auto">
                            <button id="dropdown-btn" data-bs-toggle="dropdown" aria-expanded="false">
                                Tasks
                            </button>
                            <ul id="dropdown-ul" className="dropdown-menu mx-auto">
                                <li id="dropdown-li" className="navigation dropdown-item mx-auto">
                                    <Link id="dropdown-a" to="/Tasks">All Tasks</Link>
                                </li>
                                <li className="navigation dropdown-item mx-auto">
                                    <Link to="/AddTask">Add Task</Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="navigation mx-auto">
                        <Link to="/About">About</Link>
                    </li>
                </ul>
                {auth === true ?
                    <ul className="authenticationUl">
                        <li className="authenticationLi">
                            <Link to="/" onClick={async () => {
                                await logout();

                                setAuth(false);
                                setUser(null);
                            }}>Logout</Link>
                        </li>
                    </ul> :
                    <ul className="authenticationUl">
                        <li className="authenticationLi">
                            <Link to="/Login">Login</Link>
                        </li>
                        <li className="authenticationLi">
                            <Link to="/Register">Register</Link>
                        </li>
                    </ul>
                }
            </div>
        </nav>
    )
}

export default Header