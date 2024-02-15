import React, { useState } from 'react'

import CustomInput from "./CustomInput";

import { editTask } from "../Services/Api";

import "./Alabala.css";

export default function FormPopUp({ task, tasks, setTasks, seen, setSeen }) {
    const [newName, setNewName] = useState(task.name);
    const [newDate, setNewDate] = useState(task.updatedOn);
    const [newStatus, setNewStatus] = useState(task.isCompleted);

    async function HandleCreate(e) {
        e.preventDefault();
        
        const state = await editTask(task.id, newName, newDate, newStatus);

        if (state === true) {
            const nextTasks = tasks.map(x => {
                if (x.id !== task.id) {
                    return x;
                }

                return { ...x, name: newName, updatedOn: newDate, isCompleted: newStatus };
            })

            setTasks(nextTasks);
            alert("task updated successfully.");
        }
        else {
            alert("error.");
        }

        setSeen(!seen);
    }

    return (
        <div className="mx-auto">
            <div className="popup-inner">
                <form>
                    <CustomInput type="text" name={`Current name: ${task.name}`} refValue={null} value={null} setValue={null}
                        formErrors={{}} setFormErrors={null} formType={null}
                        password={null} confirmPassword={null} disabled="true" />

                    <CustomInput type="text" name="New Name" refValue={null} value={newName} setValue={setNewName}
                        formErrors={{}} setFormErrors={null} formType={null}
                        password={null} confirmPassword={null} disabled="" />

                    <CustomInput type="text" name={`Last updated on: ${task.updatedOn}`} refValue={null} value={null} setValue={null}
                        formErrors={{}} setFormErrors={null} formType={null}
                        password={null} confirmPassword={null} disabled="true" />

                    <CustomInput type="text" name="Date" refValue={null} value={newDate} setValue={setNewDate}
                        formErrors={{}} setFormErrors={null} formType={null}
                        password={null} confirmPassword={null} disabled="" />

                    <CustomInput type="text" name={`Status: ${task.isCompleted}`} refValue={null} value={null} setValue={null}
                        formErrors={{}} setFormErrors={null} formType={null}
                        password={null} confirmPassword={null} disabled="true" />

                    <div className='col-md-6 mx-auto'>
                        <label className='form-label'>Task State</label>
                        <select className='form-control' onChange={(e) => setNewStatus(e.target.value)} value={newStatus}>
                            <option value='false'>Incomplete</option>
                            <option value='true'>Complete</option>
                        </select>
                    </div>

                    <div className="mx-auto mt-3 mb-2 col-md-1">
                        <button
                            className="btn"
                            style={{ backgroundColor: "#a3cfbb" }}
                            name="Submit"
                            onClick={(e) => HandleCreate(e)} >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div >
    )
}
