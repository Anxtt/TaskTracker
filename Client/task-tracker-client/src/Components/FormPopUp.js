import React, { useState } from 'react'

import { useTasks } from '../Hooks/useTasks';

import { editTask } from "../Services/Api";

import isFormInvalid from '../Helpers/FormErrorsValidator';

import CustomInput from "./CustomInput";
import CustomButton from './CustomButton';

import "../Styles/Form.css";

export default function FormPopUp({ task, seen, setSeen }) {
    const [newName, setNewName] = useState(task.name);
    const [newDate, setNewDate] = useState(task.deadline);

    const { dispatch } = useTasks();

    const [formErrors, setFormErrors] = useState({});

    async function HandleCreate(e) {
        e.preventDefault();

        if (isFormInvalid(formErrors) === true) {
            return null;
        }

        const status = await editTask(task.id, newName, newDate, task.isCompleted);

        if (status === true) {
            dispatch({
                type: "editTask",
                task: {
                    id: task.id,
                    name: newName,
                    deadline: newDate,
                    isCompleted: task.isCompleted
                }
            })

            alert("task updated successfully.");
        }
        else {
            alert("error.");
            return;
        }

        setSeen(!seen);
    }
    return (
        <div className="modal show fade" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            <div className="modal-dialog">
                <div className='modal-content' style={{ backgroundColor: '#0c0c0d' }}>
                    <form className='modal-body'>
                        <div className="mb-2 offset-md-10">
                            <button
                                className="btn btn-danger"
                                onClick={() => setSeen(!seen)} >
                                X
                            </button>
                        </div>

                        <CustomInput type="text" name="Task Name" refValue={null} value={newName} setValue={setNewName}
                            formErrors={formErrors} setFormErrors={setFormErrors} formType={null}
                            password={null} confirmPassword={null} disabled="" />
                        <label className='pb-2' style={{ color: "#cfe2ff" }}>{`Current name: ${task.name}`}</label>

                        <CustomInput type="date" name="Update Deadline" refValue={null} value={newDate} setValue={setNewDate}
                            formErrors={formErrors} setFormErrors={setFormErrors} formType={null}
                            password={null} confirmPassword={null} disabled="" />
                        <label className='pb-2' style={{ color: "#cfe2ff" }}>{`Current Deadline: ${task.deadline}`}</label>

                        <CustomButton handleOnClick={HandleCreate} formErrors={formErrors} name="Edit" />
                    </form>
                </div>
            </div>
        </div >
    )
}
