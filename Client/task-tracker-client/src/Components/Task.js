import React, { useState } from "react"

import { useTasks } from "../Hooks/useTasks";

import { deleteTask, editTask } from "../Services/Api";

import EditPopUp from "./EditPopUp";

import "../Styles/Task.css"
import "../Styles/Buttons.css"

export default function Task({ task, isCompleted, sort, filter, handleFiltering, handleShouldPop }) {
    const { dispatch } = useTasks();

    const [seen, setSeen] = useState(false);

    const cardStyle = {
        color: "#cfe2ff",
        fontFamily: "Lucida Console, Courier New, Courier, monospace, Arial, Helvetica, sans-serif"
    };

    return (
        <>
            <div className="card me-3 mb-3 col-md-4 col-lg-3" style={{ ...cardStyle, ...{ border: "0.3rem solid #a3cfbb", background: "#0c0c0d" } }}>
                <div className="row">
                    <div style={{ borderBottom: "0.15rem solid #a3cfbb" }}>
                        <p style={cardStyle} className="text-center col-9 mt-auto mx-auto d-inline-flex">{task.name}</p>
                        <span style={{ cursor: "pointer", fontSize: "24px" }}
                            className="col-1 d-inline-flex mx-auto mt-auto"
                            onClick={async () => {
                                const state = await editTask(task.id, task.name, task.deadline, !task.isCompleted);

                                if (state === false) {
                                    handleShouldPop("Error. Failed to update the task. Try again.");
                                    return;
                                }

                                dispatch({
                                    type: "editTask",
                                    task: {
                                        id: task.id,
                                        name: task.name,
                                        deadline: task.deadline,
                                        isCompleted: !task.isCompleted
                                    }
                                })

                                handleShouldPop(
                                    `Task was updated successfully. 
                                    State changed to ${!task.isCompleted === true ? "Complete." : "Incomplete."}`);
                                await handleFiltering(isCompleted, sort, filter);
                            }}>
                            &#x2705;
                        </span>
                    </div>

                    <div className="card-body" style={cardStyle}>
                        <p className="card-text" style={cardStyle}>Created on: {task.createdOn}</p>
                        <p className="card-text" style={cardStyle}>Deadline: {task.deadline}</p>
                        <p className="card-text" style={cardStyle}>State: {task.isCompleted === true ? "Complete" : "Incomplete"}</p>
                    </div>

                    <div style={{ ...cardStyle, ...{ borderTop: "0.15rem solid #a3cfbb" } }}>
                        <button className="btn btn-warning mt-1 mb-1 me-4 mx-auto d-inline-flex"
                            id="editButton"
                            onClick={() => setSeen(!seen)}>
                            Edit
                        </button>

                        {
                            seen === true
                                ? <EditPopUp seen={seen} setSeen={setSeen} task={task} handleShouldPop={handleShouldPop} />
                                : null
                        }

                        <button className="btn btn-danger mt-1 mb-1 mx-auto d-inline-flex"
                            id="deleteButton"
                            onClick={async () => {
                                const state = await deleteTask(task.id);

                                if (state === false) {
                                    handleShouldPop("Error. Task could not be deleted. Try again.");
                                    return;
                                }

                                dispatch({
                                    type: "deleteTask",
                                    id: task.id
                                })

                                handleShouldPop(`Task ${task.name} was deleted successfully.`);
                            }}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

