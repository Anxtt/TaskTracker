import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import useRedirect from '../Hooks/useRedirect';

import { createTask } from '../Services/Api';

import isFormInvalid from '../Helpers/FormErrorsValidator';

import CustomInput from './CustomInput';
import CustomButton from './CustomButton';

import '../Styles/Form.css';

export default function AddTask() {
    const navigate = useNavigate();

    useRedirect(null);

    const [taskName, setTaskName] = useState("");
    const taskNameRef = useRef(taskName);

    const [isCompleted, setIsCompleted] = useState(false);

    const [formErrors, setFormErrors] = useState({});

    async function HandleCreate(e) {
        e.preventDefault();

        if (taskName === "") {
            taskNameRef.current.focus();
            taskNameRef.current.blur();
            return;
        }

        if (isFormInvalid(formErrors) === true) {
            return null;
        }

        return (await createTask(taskName, isCompleted)) !== null
            ? navigate("/Tasks")
            : null;
    }

    // color: "#cfe2ff"
    return (
        <div className='mx-auto col-6'>
            <form>
                <CustomInput type='text' name='Task Name' refValue={taskNameRef} value={taskName} setValue={setTaskName}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType={null} disabled='' />

                <div className='col-md-6 mx-auto pt-3'>
                    <label className='form-label'>Task State</label>
                    <select className='form-control' onChange={(e) => setIsCompleted(e.target.value)} value={isCompleted}>
                        <option value='false'>Incomplete</option>
                        <option value='true'>Complete</option>
                    </select>
                </div>

                <CustomButton handleOnClick={HandleCreate} formErrors={formErrors} name="Create" />
            </form>
        </div>
    )
}
