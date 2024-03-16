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

    const [deadline, setDeadline] = useState();

    const [formErrors, setFormErrors] = useState({});

    async function HandleCreate(e) {
        e.preventDefault();

        if (taskName === "") {
            taskNameRef.current.focus();
            taskNameRef.current.blur();
            return;
        }

        if (isFormInvalid(formErrors) === true) {
            return;
        }

        return (await createTask(taskName, deadline)) !== null
            ? navigate("/Tasks")
            : null;
    }

    // color: "#cfe2ff"
    return (
        <div className='mx-auto col-6'>
            <form>
                <CustomInput type='text' name='Task Name' refValue={taskNameRef} value={taskName} setValue={setTaskName}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType={null} disabled='' />

                <CustomInput type="date" name="Deadline" refValue={null} value={deadline} setValue={setDeadline}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType={null} disabled="" />
                    
                <CustomButton handleOnClick={HandleCreate} formErrors={formErrors} name="Create" />
            </form>
        </div>
    )
}
