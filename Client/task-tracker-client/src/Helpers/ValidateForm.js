import { doesUsernameExist, doesEmailExist } from "../Services/Api";

async function validateForm(e, formErrors, setFormErrors, password, confirmPassword, type) {
    const { name, value } = e;
    const currentFormErrors = {};
    let merge = {};

    switch (name) {
        case "Username":
            value.length < 4 || value.length > 16
                ? currentFormErrors[name] = "Username must be between 4 and 16 characters."
                : type === "register" && await doesUsernameExist(value) === true
                    ? currentFormErrors[name] = "Username already exists."
                    : currentFormErrors[name] = undefined;

            merge = {
                ...formErrors,
                ...currentFormErrors
            }

            setFormErrors(merge);
            break;
        case "Email":
            const rx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.\.[A-Z]{2,4}$/gim;

            value.length === 0 || rx.test(value) === false
                ? currentFormErrors[name] = "Invalid email address."
                : await doesEmailExist(value) === true
                    ? currentFormErrors[name] = "Email is already in use."
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

                type === "register" && confirmPassword.length === 0
                ? currentFormErrors["ConfirmPassword"] = "This field is required."
                : type === "register" && confirmPassword !== password
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
                ? currentFormErrors[name] = "This field is required."
                : value !== password
                    ? currentFormErrors[name] = "Confirm Password does not match Password."
                    : currentFormErrors[name] = undefined;

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