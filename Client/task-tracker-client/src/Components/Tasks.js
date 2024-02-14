import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from '../Hooks/useAuth';

import { allTasks } from "../Services/Api";

import Task from "./Task";

import "../Styles/Tasks.css";

export default function Tasks() {
    const { auth, user } = useAuth();
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
    }, [auth, location, navigate, user]);

    return (
        <div className="mx-auto row">
            {auth === true
                ? <h1 className="mx-auto">Hello, {user.username}</h1>
                : null
            }

            {tasks !== null && tasks.length !== 0
                ? tasks.map((task, idx) => <Task key={task.id} task={task} index={idx} tasks={tasks} setTasks={setTasks} />)
                : <p>You have no tasks currently</p>
            }
        </div>
    );
}
