import React from 'react'

import { validateForm } from '../Helpers/ValidateForm'

function CustomInput({ type, name, refValue, value, setValue,
    formErrors, setFormErrors, formType, disabled,
    password, confirmPassword }) {
    return (
        <div className='mx-auto col-md-6'>
            <label className="form-label">{name}</label>
            <input type={type}
                className={formErrors[name] === undefined
                    ? 'form-control'
                    : 'form-control-error'}
                id={name} name={name}
                placeholder={`Your ${name}...`}
                ref={refValue}
                value={value} onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword, formType)}
                disabled={disabled}
            />
            {
                formErrors[name] !== undefined
                    ? <span>{formErrors[name]}</span>
                    : null
            }
        </div>
    )
}

export default CustomInput