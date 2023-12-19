import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../Context/AuthContext';
import { createTask } from '../Services/Api';
import CustomInput from './CustomInput';

function AddTask() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (auth === false) {
            return navigate("/Login", { state: { from: location } });
        }
    }, [auth]);

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

        if (Object.entries(formErrors).some(([x, v]) => v !== undefined) === true
            || Object.values(formErrors).length === 0) { // JSON.stringify(formErrors) === '{}')
            return null;
        }

        return (await createTask(taskName, isCompleted)) !== null
            ? navigate("/Tasks")
            : null;
    }

    // color: "#cfe2ff"
    return (
        <div className='mx-auto container col-6'>
            <form>
                <CustomInput type='text' name='Task Name' refValue={taskNameRef} value={taskName} setValue={setTaskName}
                    formErrors={formErrors} setFormErrors={setFormErrors} formType='login' disabled='' />

                <div className='col-md-6 mx-auto'>
                    <label className='form-label'>Task State</label>
                    <select className='form-control' onChange={(e) => setIsCompleted(e.target.value)} value={isCompleted}>
                        <option value='false'>Incomplete</option>
                        <option value='true'>Complete</option>
                    </select>
                </div>

                <div className="mx-auto mt-3 mb-2 col-md-1">
                    <button
                        className="btn"
                        style={{ backgroundColor: "#a3cfbb" }}
                        name="Submit"
                        onClick={(e) => HandleCreate(e)}
                        disabled={Object.entries(formErrors).some(([x, v]) => v !== undefined) === true} >
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddTask