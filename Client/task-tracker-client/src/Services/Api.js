/************
*    User   *
************/
async function register(email, username, password, confirmPassword) {
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
            "Content-Type": "application/json",
        },
        body: formData
    };

    const response = await fetch(
        "https://localhost:7219/api/identity/register",
        settings
    );

    if (response.ok === false) {
        const data = await response.json();

        console.log("Data object:");
        console.log(data);

        console.log("Data errors:");
        console.log(data.errors);

        const errors = data.errors !== undefined
            ? Object.entries(data.errors) : null;

        if (errors !== null && errors.length !== 0) {
            console.log("Errors:");
            console.log(errors);

            console.log("Errors length:");
            console.log(errors.length);

            errors.map(([errorName, errorMessage]) => {
                console.log("Error name:");
                console.log(errorName);

                console.log("Error message:");
                console.log(errorMessage);

                return alert(errorMessage);
            });

            return false;
        }

        alert('User with such credentials already exists');

        return false;
    }

    return true;
}

async function login(username, password) {
    const settings = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
        credentials: "include", // важно, за да може да пратя бисквитките
        mode: "cors"
    };

    const response = await fetch(
        "https://localhost:7219/api/identity/login",
        settings
    );

    console.log("Response:");
    console.log(response);

    if (response.ok === false) {
        alert('Invalid credentials.');

        return {
            status: false,
            user: null
        };
    }

    const data = await response.json();

    console.log("Response data:");
    console.log(data);

    return {
        status: true,
        data: data
    };
}

async function logout() {
    await fetch("https://localhost:7219/api/identity/logout", {
        method: "POST",
        credentials: "include",
        mode: "cors"
    });
}

async function verifyUser() {
    const response = await fetch("https://localhost:7219/api/identity/verifyuser", {
        method: "GET",
        credentials: "include",
        mode: "cors"
    });

    return response.ok === true
        ? await response.json()
        : undefined;
}

async function doesEmailExist(email) {
    const response = await fetch(`https://localhost:7219/api/identity/doesExistByEmail/${email}`, {
        method: "GET",
        credentials: "include", // важно, за да мога да получавам бисквитки
        mode: "cors"
    });

    return await response.json();
}

async function doesUsernameExist(username) {
    const response = await fetch(`https://localhost:7219/api/identity/doesExistByUserName/${username}`, {
        method: "GET",
        credentials: "include", // важно, за да мога да получавам бисквитки
        mode: "cors"
    });

    return await response.json();
}

/************
*    Task   *
************/
async function createTask(name, isCompleted) {
    const response = await fetch("https://localhost:7219/api/chore/create", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            isCompleted: isCompleted
        }),
        credentials: "include", // важно, за да мога да получавам бисквитки
        mode: "cors"
    });

    return response.status === 201
        ? await response.json()
        : null;
}

async function allTasks() {
    const response = await fetch("https://localhost:7219/api/chore/all", {
        method: "GET",
        credentials: "include", // важно, за да мога да получавам бисквитки
        mode: "cors"
    });

    return response.status === 200
        ? await response.json()
        : null;
}

// function getToken(key) {
//   return JSON.parse(localStorage.getItem(key));
// }

export { register, login, logout, verifyUser, doesUsernameExist, doesEmailExist, allTasks, createTask };