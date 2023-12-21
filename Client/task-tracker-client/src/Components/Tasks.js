import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "../Context/AuthContext";

import { allTasks } from "../Services/Api";

import Task from "./Task";

import "../Styles/Tasks.css";

function Tasks() {
    const { auth, user } = useContext(AuthContext);
    const [tasks, setTasks] = useState(null);
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
        }

        startFetching();
    }, [auth]);

    return (
        <div className="mx-auto">
            {auth === true
                ? <h1 className="mx-auto">Hello, {user.username}</h1>
                : null
            }

            {tasks !== null && tasks.length !== 0
                ? tasks.map((task) => <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />)
                : <p>You have no tasks currently</p>
            }
        </div>
    );
}

export default Tasks;
