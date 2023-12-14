import React, { useContext } from "react"
import { Link } from "react-router-dom"

import { AuthContext } from "../Context/AuthContext"

import { logout } from "../Services/Api"

import "../Styles/Header.css"

function Header() {
  console.log("Header:");
  console.log(AuthContext);

  const { auth, setAuth, setUser } = useContext(AuthContext);

  return (
    <nav>
      <ul>
        <li className="navigation">
          <Link to="/">Home</Link>
        </li>
        <li className="navigation">
          <Link to="/Tasks">Tasks</Link>
        </li>
        <li className="navigation">
          <Link to="/About">About</Link>
        </li>
      </ul>

      { auth ?
        <ul className="authenticationUl">
          <li className="authenticationLi">
            <Link to="/" onClick={async () => {
              const status = await logout();

              if (status === true) {
                setAuth(false);
                setUser(null);
              }
            }}>Logout</Link>
          </li>
        </ul>
        :
        <ul className="authenticationUl">
          <li className="authenticationLi">
            <Link to="/Login">Login</Link>
          </li>
          <li className="authenticationLi">
            <Link to="/Register">Register</Link>
          </li>
        </ul>
      }
    </nav>
  )
}

export default Header