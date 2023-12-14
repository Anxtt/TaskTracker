async function validateForm(e, formErrors, setFormErrors, password, confirmPassword) {
    const { name, value } = e;
    const currentFormErrors = {};
    let merge = {};

    switch (name) {
        case "Username":
            value.length < 4 || value.length > 16
                ? currentFormErrors[name] = "Username must be between 4 and 16 characters."
                // : doesUsernameExist === true
                    // ? formErrors[name] = "Username already exists."
                    : currentFormErrors[name] = undefined;

            merge = {
                ...formErrors,
                ...currentFormErrors
            }

            setFormErrors(merge);
            break;
        case "Email":
            value.length === 0
                ? currentFormErrors[name] = "Invalid email address."
                // : doesEmailExist === true
                    // ? currentFormErrors[name] = "Email is already in use."
                    : currentFormErrors[name] = undefined;
                
            merge = {
                ...formErrors,
                ...currentFormErrors
            }
                
            setFormErrors(merge);
            break;
        case "Password":
            value.length < 6 || value.length > 18
                ? currentFormErrors[name] = "Password must be between 6 and 18 characters."
                : currentFormErrors[name] = undefined;

            confirmPassword.length === 0
                ? formErrors["ConfirmPassword"] = "This field is required."
                : confirmPassword !== password
                    ? currentFormErrors["ConfirmPassword"] = "Confirm Password does not match Password."
                    : currentFormErrors["ConfirmPassword"] = undefined;
            
            merge = {
                ...formErrors,
                ...currentFormErrors
            }
                
            setFormErrors(merge);
            break;
        case "ConfirmPassword":
            value.length === 0
                ? formErrors[name] = "This field is required."
                : value !== password
                    ? formErrors[name] = "Confirm Password does not match Password."
                    : formErrors[name] = undefined;

            merge = {
               ...formErrors,
               ...currentFormErrors
            }
                
            setFormErrors(merge);
            break;
        default:
            break;
    }
}

export { validateForm };