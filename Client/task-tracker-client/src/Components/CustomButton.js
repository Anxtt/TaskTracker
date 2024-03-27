import React from 'react'

import isFormInvalid from '../Helpers/FormErrorsValidator'

import "../Styles/Buttons.css";

export default function CustomButton({ formErrors, handleOnClick, name }) {
    return (
        <div className="mx-auto mt-3 mb-2 col-md-12">
            <button
                id="submitButton"
                className="btn"
                name={name}
                onClick={(e) => handleOnClick(e)}
                disabled={isFormInvalid(formErrors) === true} >
                {name}
            </button>
        </div>
    )
}