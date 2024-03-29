import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

import { useAuth } from '../Hooks/useAuth';
import useRedirect from "../Hooks/useRedirect";
import { useTasks } from "../Hooks/useTasks";

import { allTasks, allTasksFiltered } from "../Services/Api";

import Task from "./Task";

import "../Styles/Buttons.css";
import "../Styles/Tasks.css";
import "../Styles/Form.css";

export default function Tasks() {
    const { auth, user } = useAuth();
    const { tasks, dispatch } = useTasks();

    const [isCompleted, setIsCompleted] = useState("");
    const [sort, setSort] = useState("");
    const [filter, setFilter] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);
    const [eventMessage, setEventMessage] = useState(null);
    const [shouldPop, setShouldPop] = useState(false);

    useRedirect(null);

    useEffect(() => {
        async function getTasks() {
            const data = await allTasks();

            if (data === null || ignore === true) {
                dispatch({
                    type: "getTasks",
                    tasks: []
                });
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

    async function HandleFiltering(isCompletedStatus, sortStatus, filterStatus) {
        const data = await allTasksFiltered(isCompletedStatus, sortStatus, filterStatus);

        if (data === null) {
            setErrorMessage("No existing tasks to filter.");
            return;
        }
        else if (data === 429) {
            setErrorMessage("Too many requests. Slow down.");
            return;
        }

        dispatch({
            type: "getTasks",
            tasks: data
        });
    }

    async function HandleIsCompleted(isCompletedStatus) {
        if (isCompleted === isCompletedStatus) {
            setIsCompleted("");
            await HandleFiltering("", sort, filter);
            return;
        }

        setIsCompleted(isCompletedStatus);
        await HandleFiltering(isCompletedStatus, sort, filter);
    }

    function HandleShouldPop(message) {
        setEventMessage(message);
        setShouldPop(true);
        setTimeout(() => setShouldPop(false), 3500);
    }

    return (
        <div className="mx-auto row">
            {auth === true
                ? <h1 className="pe-5">Hello, {user.username}</h1>
                : null
            }

            <div className="mb-2 mx-auto row">
                <div className="d-lg-inline-flex d-md-grid mx-auto col-lg-3">
                    <button className="param mx-auto" onClick={async () => {
                        await HandleIsCompleted(false);
                    }}>Incomplete</button>

                    <button className="param mx-auto" onClick={async () => {
                        await HandleIsCompleted(true);
                    }}>Complete</button>
                </div>

                <div className="mx-auto col-sm-6 col-lg-4" style={{ border: "transparent 0.4rem solid" }}>
                    <select className="" value={sort} onChange={async e => {
                        setSort(e.target.value);
                        await HandleFiltering(isCompleted, e.target.value, filter);
                    }}>
                        <option value="" disabled>Sort By:</option>
                        <option value="creation ASC">Creation ASC</option>
                        <option value="creation DESC">Creation DESC</option>
                        <option value="deadline ASC">Deadline ASC</option>
                        <option value="deadline DESC">Deadline DESC</option>
                        <option value="">Reset</option>
                    </select>

                    <input
                        className="ms-3 mt-2 col-xxl-5"
                        placeholder="Filter by name.."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        onBlur={async e => {
                            await HandleFiltering(isCompleted, sort, e.target.value);
                        }}
                    />
                </div>
            </div>

            {
                shouldPop === true
                    ? <p style={{ color: "#0dcaf0" }}>{eventMessage}</p>
                    : null
            }

            {
                errorMessage !== null && errorMessage.length > 0
                    ? <span className="pt-4">{errorMessage}</span>
                    : null
            }

            {
                tasks !== null && tasks.length !== 0
                    ? (
                        <div className="offset-md-1 row">
                            {tasks.map(task => <Task key={task.id} task={task}
                                                isCompleted={isCompleted} sort={sort}
                                                filter={filter} handleFiltering={HandleFiltering}
                                                handleShouldPop={HandleShouldPop} />)}
                        </div>
                    )
                    : (
                        <>
                            <h3 className="pt-5">You have no tasks currently</h3>
                            <h4>Create them at <Link to="/AddTask">Add Task</Link></h4>
                        </>
                    )
            }
        </div>
    );
}
