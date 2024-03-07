import React, { useState } from "react"

import { useTasks } from "../Hooks/useTasks";

import { deleteTask, editTask } from "../Services/Api";

import EditPopUp from "./EditPopUp";

import "../Styles/Task.css"
import "../Styles/Buttons.css"

export default function Task({ task }) {
    const [seen, setSeen] = useState(false);
    const { dispatch } = useTasks();

    const cardStyle = {
        color: "#cfe2ff",
        fontFamily: "Arial, Helvetica, sans-serif"
    };

    return (
        <>
            <div className="card me-3 mb-3 col-3" style={{ ...cardStyle, ...{ border: "0.3rem solid #a3cfbb", background: "#0c0c0d" } }}>
                <div className="row">
                    <div style={{ borderBottom: "0.15rem solid #a3cfbb" }}>
                        <p style={cardStyle} className="text-center col-9 mt-auto mx-auto d-inline-flex">{task.name}</p>
                        <span style={{ cursor: "pointer", fontSize: "24px" }}
                            className="col-1 d-inline-flex mx-auto mt-auto"
                            onClick={async () => {
                                const state = await editTask(task.id, task.name, task.deadline, !task.isCompleted);

                                if (state === false) {
                                    alert("error.");
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
                                ? <EditPopUp seen={seen} setSeen={setSeen} task={task} />
                                : null
                        }

                        <button className="btn btn-danger mt-1 mb-1 mx-auto ms-5 d-inline-flex"
                            id="deleteButton"
                            onClick={async () => {
                                const state = await deleteTask(task.id);

                                if (state === false) {
                                    alert("task could not be deleted.");
                                    return;
                                }
                                
                                dispatch({
                                    type: "deleteTask",
                                    id: task.id
                                })

                                alert("task was successfully deleted.");
                            }}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

