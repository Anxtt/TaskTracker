import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import { AuthContext } from "../Context/AuthContext";

import { allChores } from "../Services/Api";

import Task from "./Task";

import "../Styles/Tasks.css";

function Tasks() {
  const { auth, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const location = useLocation();

  const urlCheck = location.pathname === '/Tasks';

  useEffect(() => {
    async function startFetching() {
      setTasks(await allChores());
    }

    if (auth !== false) {
      startFetching();
    }
  }, [auth]);

  return (
    <>
      { user
        ? <h1>Hello, {user.username}</h1>
        : <h1>Hello, Taskmaster</h1>
      }

      {tasks.map((task) => <Task key={task.id} task={task} />)}
    </>
  );
}

export default Tasks;
