import React from 'react'

import validateForm from '../Helpers/ValidateForm'

export default function CustomInput({ type, name, refValue, value, setValue,
    formErrors, setFormErrors, formType, disabled,
    password, confirmPassword }) {
    const now = new Date();
    const min = now.toJSON().slice(0, 10);
    const max = new Date(now.setFullYear(now.getFullYear() + 1)).toJSON().slice(0, 10);

    return (
        type !== "date" ?
            (<div className='mx-auto col-sm-6 pb-2'>
                <label className="form-label">{name}</label>
                <input type={type}
                    className={formErrors[name] === undefined
                        ? 'form-control'
                        : 'form-control-error'}
                    id={name} name={name}
                    placeholder={name}
                    ref={refValue}
                    value={value} onChange={(e) => setValue(e.target.value)}
                    onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword, formType)}
                    disabled={disabled}
                    required
                />
                {
                    formErrors[name] !== undefined
                        ? <span className='col-sm-12'>{formErrors[name]}</span> 
                        : null
                }
            </div>) :
            (
                <div className='mx-auto col-sm-6 pb-2'>
                    <label className="form-label">{name}</label>
                    <input type={type}
                        min={min}
                        max={max}
                        className={formErrors[name] === undefined
                            ? 'form-control'
                            : 'form-control-error'}
                        id={name} name={name}
                        placeholder={name}
                        ref={refValue}
                        value={value} onChange={(e) => setValue(e.target.value)}
                        onBlur={(e) => validateForm(e.target, formErrors, setFormErrors, password, confirmPassword, formType)}
                        disabled={disabled}
                        required
                    />
                    {
                        formErrors[name] !== undefined
                            ? <span className='col-sm-12'>{formErrors[name]}</span>
                            : null
                    }
                </div>
            )
    )
}
