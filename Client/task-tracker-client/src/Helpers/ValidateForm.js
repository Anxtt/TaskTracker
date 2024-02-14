import { doesUsernameExist, doesEmailExist } from "../Services/Api";

export default async function validateForm(e, formErrors, setFormErrors, password, confirmPassword, type) {
    const { name, value } = e;
    const currentFormErrors = {};
    let merge = {};

    switch (name) {
        case "Username":
            value.length === 0 || value.length < 4 || value.length > 16
                ? currentFormErrors[name] = `This field is required. ${name} must be between 4 and 16 characters.`
                : type === "register" && (await doesUsernameExist(value)) === true
                    ? currentFormErrors[name] = `${name} already exists.`
                    : currentFormErrors[name] = undefined;
            break;
        case "Email":
            const rx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.\.[A-Z]{2,4}$/gim;

            value.length === 0 || value.length < 6 || value.length > 50
                ? currentFormErrors[name] = `This field is required. ${name} must be between 6 and 50 characters.`
                : rx.test(value) === false
                    ? currentFormErrors[name] = `Invalid ${name} address.`
                    : (await doesEmailExist(value)) === true
                        ? currentFormErrors[name] = `${name} is already in use.`
                        : currentFormErrors[name] = undefined;
            break;
        case "Password":
            value.length === 0
                ? currentFormErrors[name] = "This field is required."
                : value.length < 6 || value.length > 18
                    ? currentFormErrors[name] = `${name} must be between 6 and 18 characters. ${name} must contain at least 1 Capital letter, 1 Lower-case letter, 1 number, 1 special character.`
                    : currentFormErrors[name] = undefined;

            type === "register" && confirmPassword.length === 0
                ? currentFormErrors["Password Confirmation"] = "This field is required."
                : type === "register" && confirmPassword !== password
                    ? currentFormErrors["Password Confirmation"] = `Confirm Password does not match ${name}.`
                    : currentFormErrors["Password Confirmation"] = undefined;
            break;
        case "Password Confirmation":
            value.length === 0
                ? currentFormErrors[name] = "This field is required."
                : value !== password
                    ? currentFormErrors[name] = `${name} does not match Password.`
                    : currentFormErrors[name] = undefined;
            break;
        case "Task Name":
            value.length === 0 || value.length < 4 || value.length > 16
                ? currentFormErrors[name] = `This field is required. ${name} must be between 4 and 16 characters.`
                : currentFormErrors[name] = undefined;
            break;
        default:
            break;
    }

    merge = {
        ...formErrors,
        ...currentFormErrors
    }

    setFormErrors(merge);
}
