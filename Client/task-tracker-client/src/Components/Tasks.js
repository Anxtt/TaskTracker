import React, { useEffect } from "react";

import { useAuth } from '../Hooks/useAuth';
import useRedirect from "../Hooks/useRedirect";
import { useTasks } from "../Hooks/useTasks";

import { allTasks } from "../Services/Api";

import Task from "./Task";

import "../Styles/Tasks.css";

export default function Tasks() {
    const { auth, user } = useAuth();   
    const { tasks, dispatch } = useTasks();

    useRedirect(null);

    useEffect(() => {
        async function getTasks() {
            const data = await allTasks();

            if (data !== null && ignore === false) {
                dispatch({
                    type: "getData",
                    tasks: data
                });
            }
        }

        let ignore = false;
        getTasks();

        return () => {
            ignore = true;
        }
    }, [auth, user, dispatch]);

    return (
        <div className="mx-auto row">
            {auth === true
                ? <h1 className="pe-5">Hello, {user.username}</h1>
                : null
            }

            <div className="offset-md-1 ps-5 row">
                {tasks !== null && tasks.length !== 0
                    ? tasks.map(task => <Task key={task.id} task={task} />)
                    : <p>You have no tasks currently</p>
                }
            </div>
        </div>
    );
}
