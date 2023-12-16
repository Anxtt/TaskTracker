import React from 'react'

import { validateForm } from '../Helpers/ValidateForm'

function CustomForm({ firstType, firstName, firstRef, firstValue, firstSet,
    formErrors, setFormErrors, formType,
    secondType, secondName, secondRef, secondValue, secondSet,
    password, confirmPassword }) {
    return (
        <>
            <div className='mx-auto col-md-6'>
                <label className="form-label">{firstName}</label>
                <input type={firstType}
                    className={formErrors[firstName] === undefined
                        ? 'form-control'
                        : 'form-control-error'}
                    id={firstName} name={firstName}
                    placeholder={`Your ${firstName}...`}
                    ref={firstRef}
                    value={firstValue} onChange={(e) => firstSet(e.target.value)}
                    onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword, formType)}
                />
                {
                    formErrors[firstName] !== undefined
                        ? <span>{formErrors[firstName]}</span>
                        : null
                }
            </div>

            <div className='mx-auto col-md-6'>
                <label className="form-label">{secondName}</label>
                <input type={secondType}
                    className={formErrors[secondName] === undefined
                        ? 'form-control'
                        : 'form-control-error'}
                    id={secondName} name={secondName}
                    placeholder={`Your ${secondName}...`}
                    ref={secondRef}
                    value={secondValue} onChange={(e) => secondSet(e.target.value)}
                    onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword, formType)}
                />
                {
                    formErrors[secondName] !== undefined
                        ? <span>{formErrors[secondName]}</span>
                        : null
                }
            </div>
        </>
    )
}

export default CustomForm