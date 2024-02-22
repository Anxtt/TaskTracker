import React from 'react'

import isFormInvalid from '../Helpers/FormErrorsValidator'

export default function CustomButton({ formErrors, handleOnClick, name }) {
    return (
        <div className="mx-auto mt-3 mb-2">
            <button
                className="btn"
                style={{ backgroundColor: "#a3cfbb", color: "white" }}
                name={name}
                onClick={(e) => handleOnClick(e)}
                disabled={isFormInvalid(formErrors) === true} >
                {name}
            </button>
        </div>
    )
}