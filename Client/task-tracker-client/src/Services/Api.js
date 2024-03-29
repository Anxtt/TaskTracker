const URL = "https://localhost:7219/api";
const IDENTITY = "Identity";
const CHORE = "Chore";

/************
*    User   *
************/
export async function register(email, username, password, confirmPassword) {
    const formData = JSON.stringify({
        email: email,
        username: username,
        password: password,
        confirmPassword: confirmPassword
    });

    const settings = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: formData
    };

    const response = await fetch(
        `${URL}/${IDENTITY}/Register`,
        settings
    );

    let status = {
        state: true,
        messages: []
    };

    if (response.ok === false) {
        const data = await response.json();
        status.state = false;

        // console.log("Data object:");
        // console.log(data);

        // console.log("Data errors:");
        // console.log(data.errors);

        const errors = data.errors !== undefined
            ? Object.entries(data.errors) : null;

        if (data.length > 0) {
            // data.map(({ code, description }) => {
            //     console.log(code);
            //     console.log(description);

            //     status.messages.push(description);
            // })
            status.messages.push("User with such credentials already exists.");

            return status;
        }
        else if (errors !== null && errors.length !== 0) {
            // console.log("Errors:");
            // console.log(errors);

            // console.log("Errors length:");
            // console.log(errors.length);

            // errors.map(([errorName, errorMessage]) => {
            //     console.log("Error name:");
            //     console.log(errorName);

            //     console.log("Error message:");
            //     console.log(errorMessage);

            //     status.messages.push(errorMessage);
            // });
            status.messages.push("User with such credentials already exists.");

            return status;
        }

        status.messages.push('User with such credentials already exists.');

        return status;
    }

    return status;
}

export async function login(username, password) {
    const settings = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
        credentials: "include", // важно, за да може да пратя бисквитките
        mode: "cors"
    };

    const response = await fetch(
        `${URL}/${IDENTITY}/Login`,
        settings
    );

    console.log("Login Response:");
    console.log(response);

    const status = {
        state: true,
        data: null,
        messages: []
    };

    if (response.ok === false) {
        status.state = false;
        status.messages.push('Invalid credentials.');

        return status;
    }

    const data = await response.json();

    console.log("Response data:");
    console.log(data);

    status.data = data;

    return status;
}

export async function logout() {
    await fetch(`${URL}/${IDENTITY}/Logout`, {
        method: "POST",
        credentials: "include",
        mode: "cors"
    });
}

export async function verifyUser() {
    const response = await fetch(`${URL}/${IDENTITY}/VerifyUser`, {
        method: "GET",
        credentials: "include",
        mode: "cors"
    });

    return response.ok === true
        ? await response.json()
        : null;
}

export async function doesEmailExist(email) {
    const response = await fetch(`${URL}/${IDENTITY}/DoesExistByEmail/${email}`, {
        method: "GET",
        credentials: "include", // важно, за да мога да получавам бисквитки
        mode: "cors"
    });

    return response.status === 429
        ? null
        : await response.json();
}

export async function doesUsernameExist(username) {
    const response = await fetch(`${URL}/${IDENTITY}/DoesExistByUserName/${username}`, {
        method: "GET",
        credentials: "include", // важно, за да мога да получавам бисквитки
        mode: "cors"
    });

    return response.status === 429
        ? null
        : await response.json();
}

/************
*    Task   *
************/
export async function createTask(name, deadline) {
    const response = await fetch(`${URL}/${CHORE}/Create`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            deadline: deadline
        }),
        credentials: "include", // важно, за да мога да получавам бисквитки
        mode: "cors"
    });

    return response.status === 201
        ? await response.json()
        : null;
}

export async function allTasks() {
    const response = await fetch(`${URL}/${CHORE}/All`, {
        method: "GET",
        credentials: "include", // важно, за да мога да получавам бисквитки
        mode: "cors"
    });

    return response.status === 200
        ? await response.json()
        : null;
}

export async function allTasksFiltered(isCompletedStatus, sortStatus, filterStatus) {
    const response = await fetch(`${URL}/${CHORE}/AllFiltered?isCompletedStatus=${isCompletedStatus}&sortStatus=${sortStatus}&filterStatus=${filterStatus}`, {
        method: "GET",
        credentials: "include",
        mode: "cors"
    });

    return response.status === 200
        ? await response.json()
        : response.status === 429
            ? 429
            : null;
}

export async function deleteTask(id) {
    const response = await fetch(`${URL}/${CHORE}/Delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        mode: "cors"
    });

    return response.status === 200
        ? true
        : false;
}

export async function doesExistByName(name) {
    const response = await fetch(`${URL}/${CHORE}/DoesExistByName/${name}`, {
        method: "GET",
        credentials: "include",
        mode: "cors"
    });

    return response.status === 429
        ? null
        : await response.json();
}

export async function editTask(id, name, deadline, isCompleted) {
    const response = await fetch(`${URL}/${CHORE}/Edit/${id}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            deadline: deadline,
            isCompleted: isCompleted === true ? true : false
        }),
        credentials: "include",
        mode: "cors"
    });

    return response.status === 204
        ? true
        : false;
}

// function getToken(key) {
//   return JSON.parse(localStorage.getItem(key));
// }
