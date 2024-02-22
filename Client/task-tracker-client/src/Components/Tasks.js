import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from '../Hooks/useAuth';
import useRedirect from "../Hooks/useRedirect";

import { allTasks } from "../Services/Api";

import Task from "./Task";

import "../Styles/Tasks.css";

export default function Tasks() {
    const { auth, user } = useAuth();
    const [tasks, setTasks] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    useRedirect(null);

    useEffect(() => {
        async function getTasks() {
            const data = await allTasks();

            if (data !== null && ignore === false) {
                setTasks(data);
            }
        }

        let ignore = false;
        getTasks();

        return () => {
            ignore = true;
        }
    }, [auth, location, navigate, user]);

    return (
        <div className="mx-auto row">
            {auth === true
                ? <h1 className="pe-5">Hello, {user.username}</h1>
                : null
            }

            <div className="offset-md-1 ps-5 row">
                {tasks !== null && tasks.length !== 0
                    ? tasks.map(task => <Task key={task.id} task={task} tasks={tasks} setTasks={setTasks} />)
                    : <p>You have no tasks currently</p>
                }
            </div>
        </div>
    );
}
