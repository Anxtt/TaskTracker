import React, { useState } from 'react'

import { editTask } from "../Services/Api";

import isFormInvalid from '../Helpers/FormErrorsValidator';

import CustomInput from "./CustomInput";
import CustomButton from './CustomButton';

import "../Styles/Form.css";

export default function FormPopUp({ task, tasks, setTasks, seen, setSeen }) {
    const [newName, setNewName] = useState(task.name);
    const [newDate, setNewDate] = useState(task.updatedOn);
    const [newStatus, setNewStatus] = useState(task.isCompleted);

    const [formErrors, setFormErrors] = useState({});

    async function HandleCreate(e) {
        e.preventDefault();

        if (isFormInvalid(formErrors) === true) {
            return null;
        }

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

                        <CustomInput type="text" name={`Current name: ${task.name}`} refValue={null} value={undefined} setValue={null}
                            formErrors={{}} setFormErrors={null} formType={null}
                            password={null} confirmPassword={null} disabled={true} />

                        <CustomInput type="text" name="Task Name" refValue={null} value={newName} setValue={setNewName}
                            formErrors={formErrors} setFormErrors={setFormErrors} formType={null}
                            password={null} confirmPassword={null} disabled="" />

                        <CustomInput type="text" name={`Last updated on: ${task.updatedOn}`} refValue={null} value={undefined} setValue={null}
                            formErrors={{}} setFormErrors={null} formType={null}
                            password={null} confirmPassword={null} disabled={true} />

                        <CustomInput type="text" name="Date" refValue={null} value={newDate} setValue={setNewDate}
                            formErrors={formErrors} setFormErrors={setFormErrors} formType={null}
                            password={null} confirmPassword={null} disabled="" />

                        <CustomInput type="text" name={`Status: ${task.isCompleted}`} refValue={null} value={undefined} setValue={null}
                            formErrors={{}} setFormErrors={null} formType={null}
                            password={null} confirmPassword={null} disabled={true} />

                        <div className='col-md-6 mx-auto'>
                            <label className='form-label'>Task State</label>
                            <select className='form-control' onChange={(e) => setNewStatus(e.target.value)} value={newStatus}>
                                <option value='false'>Incomplete</option>
                                <option value='true'>Complete</option>
                            </select>
                        </div>

                        <CustomButton handleOnClick={HandleCreate} formErrors={formErrors} name="Edit"/>
                    </form>
                </div>
            </div>
        </div >
    )
}
