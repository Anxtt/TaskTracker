import React, { useState } from "react"

import { deleteTask } from "../Services/Api";

import FormPopUp from '../Components/FormPopUp';

import "../Styles/Task.css"

export default function Task({ task, tasks, setTasks }) {
    const [seen, setSeen] = useState(false);
    
    const cardStyle = {
        color: "#cfe2ff", 
        fontFamily: "Arial, Helvetica, sans-serif"
    };

    return (
        <>
            <div className="card me-2 mb-2 col-3" style={{ ...cardStyle, ...{ border: "0.3rem solid #a3cfbb", background: "#0c0c0d" }}}>
                <div style={{ ...cardStyle, ...{ borderBottom: "0.15rem solid #a3cfbb" }}}>{task.name}</div>
                <div className="card-body" style={cardStyle}>
                    <h5 className="card-title" style={cardStyle}>#{task.id}</h5>
                    <p className="card-text" style={cardStyle}>Created on: {task.createdOn}</p>
                    <p className="card-text" style={cardStyle}>Updated on: {task.updatedOn}</p>
                    <p className="card-text" style={cardStyle}>Is Completed: {task.isCompleted === true ? "true" : "false"}</p>
                </div>
                <div style={{ ...cardStyle, ...{ borderTop: "0.15rem solid #a3cfbb" } }}>
                    <button className="btn btn-warning mx-auto mt-1 mb-1 ms-1 me-1 text-center"
                        onClick={() => setSeen(!seen)}>
                        Edit
                    </button>
                    {
                        seen === true
                            ? <FormPopUp seen={seen} setSeen={setSeen} task={task} tasks={tasks} setTasks={setTasks} />
                            : null
                    }
                    <button className="btn btn-danger mx-auto mt-1 mb-1 ms-1 me-1 text-center"
                        onClick={async () => {
                            const state = await deleteTask(task.id);

                            if (state === true) {
                                alert("task was successfully deleted.");
                                setTasks(tasks.filter(x => x.id !== task.id))
                            }
                            else {
                                alert("task could not be deleted.");
                            }
                        }}>
                        Delete
                    </button>
                </div>
            </div>
        </>
    )
}

