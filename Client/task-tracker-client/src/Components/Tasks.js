import React, { useEffect, useState } from "react";

import { useAuth } from '../Hooks/useAuth';
import useRedirect from "../Hooks/useRedirect";
import { useTasks } from "../Hooks/useTasks";

import { allTasks, allTasksByCompletionStatus } from "../Services/Api";

import Task from "./Task";

import "../Styles/Tasks.css";
import "../Styles/Buttons.css";

export default function Tasks() {
    const { auth, user } = useAuth();
    const { tasks, dispatch } = useTasks();

    const [param, setParam] = useState(null);

    useRedirect(null);

    useEffect(() => {
        async function getTasks() {
            const data = await allTasks();

            if (data === null || ignore === true) {
                return;
            }

            dispatch({
                type: "getTasks",
                tasks: data
            });
        }

        let ignore = false;
        getTasks();

        return () => {
            ignore = true;
        }
    }, [auth, user, dispatch]);

    async function HandleFiltering(status) {
        if (param === status) {
            dispatch({
                type: "getTasks",
                tasks: await allTasks()
            })

            setParam(null);
            
            return;
        }

        const data = await allTasksByCompletionStatus(status);

        if (data === null) {
            alert("error.");
            return;
        }

        dispatch({
            type: "filteredTasks",
            tasks: data
        })

        setParam(status);
    }

    return (
        <div className="mx-auto row">
            {auth === true
                ? <h1 className="pe-5">Hello, {user.username}</h1>
                : null
            }

            <div className="d-inline-flex offset-md-1 mb-2 ps-5">
                <button className="param" onClick={async () => {
                    await HandleFiltering(false);
                }}>Incomplete</button>
                <button className="ms-5 param" onClick={async () => {
                    await HandleFiltering(true);
                }}>Complete</button>
            </div>

            <div className="offset-md-1 ps-5 row">
                {tasks !== null && tasks.length !== 0
                    ? tasks.map(task => <Task key={task.id} task={task} />)
                    : <p>You have no tasks currently</p>
                }
            </div>
        </div>
    );
}
