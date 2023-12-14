async function register(email, username, password, confirmPassword) {
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

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

    const errors = data.errors !== undefined ? Object.entries(data.errors) : null;

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
  
  console.log("Response data:");

  const data = await response.json();
  console.log(data);

  return {
    status: true,
    data: data
  };
}

async function logout() {
  const request = await fetch("https://localhost:7219/api/identity/logout", {
    method: "POST",
    credentials: "include",
    mode: "cors"
  });

  if (request.ok === false) {
    alert('Error. Try again!');

    return false;
  }

  return true;
}

async function doesUsernameExist() {
  const response = await fetch("https://localhost:7219/api/identity/", {
    method: "GET",
    credentials: "include", // важно, за да мога да получавам бисквитки
    mode: "cors"
  });

  const data = await response.json();

  return data;
}

async function allChores() {
  const response = await fetch("https://localhost:7219/api/chore/all", {
    method: "GET",
    credentials: "include", // важно, за да мога да получавам бисквитки
    mode: "cors"
  });

  const data = await response.json();

  return data;
}

async function verifyUser(){
  const response = await fetch("https://localhost:7219/api/identity/verifyuser", {
    method: "GET",
    credentials: "include",
    mode: "cors"
  });

  const data = await response.json();

  return data;
}

// function getToken(key) {
//   return JSON.parse(localStorage.getItem(key));
// }

export { allChores, register, login, logout, verifyUser };