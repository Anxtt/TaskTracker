export default function isFormInvalid(formErrors) {
    return Object.entries(formErrors).some(([x, v]) => v !== undefined) === true
    || Object.values(formErrors).length === 0; // JSON.stringify(formErrors) === '{}')
}