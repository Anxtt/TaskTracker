import React from "react"

import { deleteTask } from "../Services/Api";

import "../Styles/Task.css"

function Task({ task, tasks, setTasks }) {

    return (
        <>
            <div className="card mb-3" style={{ border: "0.3rem solid #a3cfbb", background: "#0c0c0d", fontFamily: "Arial, Helvetica, sans-serif" }}>
                <div style={{ borderBottom: "0.15rem solid #a3cfbb", color: "#cfe2ff", fontFamily: "Arial, Helvetica, sans-serif" }}>{task.name}</div>
                <div className="card-body" style={{ color: "#cfe2ff", fontFamily: "Arial, Helvetica, sans-serif" }}>
                    <h5 className="card-title" style={{ color: "#cfe2ff", fontFamily: "Arial, Helvetica, sans-serif" }}>#{task.id}</h5>
                    <p className="card-text" style={{ color: "#cfe2ff", fontFamily: "Arial, Helvetica, sans-serif" }}>Created on: {task.createdOn}</p>
                    <p className="card-text" style={{ color: "#cfe2ff", fontFamily: "Arial, Helvetica, sans-serif" }}>Updated on: {task.updatedOn}</p>
                    <p className="card-text" style={{ color: "#cfe2ff", fontFamily: "Arial, Helvetica, sans-serif" }}>Is Completed: {task.isCompleted === true ? "true" : "false"}</p>
                </div>
                <div style={{ borderTop: "0.15rem solid #a3cfbb", color: "#cfe2ff", fontFamily: "Arial, Helvetica, sans-serif" }}>
                    <button className="btn mx-auto col-4 text-center"
                        style={{ backgroundColor: "yellow" }}
                        onClick={(e) => {

                        }}>Edit</button>
                    <button className="btn mx-auto col-4 text-center"
                        style={{ backgroundColor: "red" }}
                        onClick={async () => {
                            const state = await deleteTask(task.id);

                            if (state === true) {
                                alert("task was successfully deleted.");
                                setTasks(tasks.filter(x => x.id !== task.id))
                            }
                            else {
                                alert("task could not be deleted.");
                            }
                        }}>Delete</button>
                </div>
            </div>
        </>
    )
}

export default Task
