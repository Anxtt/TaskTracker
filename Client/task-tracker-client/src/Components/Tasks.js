import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "../Context/AuthContext";

import { allTasks } from "../Services/Api";

import Task from "./Task";

import "../Styles/Tasks.css";

function Tasks() {
    const { auth, setAuth, user, setUser } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (auth === false) {
            return navigate("/Login", { state: { from: location } });
        }

        async function startFetching() {
            const data = await allTasks();
            console.log(data);
            console.log(auth);
            console.log(user);

            if (data !== null) {
                setTasks(data);
            }
            else {
                setAuth(false);
                setUser(null);
                return navigate("/Login", { state: { from: location }});
            }
        }

        startFetching();
    }, [auth]);

    return (
        <>
            <div className="container mx-auto">
                {auth === true
                    ? <h1 className="mx-auto">Hello, {user.username}</h1>
                    : <h1 className="mx-auto">Hello, Taskmaster</h1>
                }

                {tasks !== null && tasks.length !== 0
                    ? tasks.map((task) => <Task className="mx-auto" key={task.id} task={task} />)
                    : <p>You have no tasks currently</p>
                }
            </div>
        </>
    );
}

export default Tasks;
