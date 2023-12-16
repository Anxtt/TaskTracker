import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../Context/AuthContext";

import { allChores } from "../Services/Api";

import Task from "./Task";

import "../Styles/Tasks.css";

function Tasks() {
  const { auth, setAuth, user, setUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    async function startFetching() {
      const data = await allChores();
      console.log(data);
      console.log(auth);
      console.log(user);

      if (data !== null) {
        setTasks(await allChores());
      }
      else  {
        setAuth(false);
        setUser(null);
        return navigation("/Login");
      }
    }

    startFetching();
  }, [auth]);

  return (
    <>
      <div className="container mx-auto">
        {auth === true
          ? <h1 className="mx-auto">Hello, {user.username}</h1>
          : <h1 className="mx-auto">Hello, Taskmaster</h1>
        }

        { tasks !== null && tasks.length !== 0
          ? tasks.map((task) => <Task className="mx-auto" key={task.id} task={task} />)
          : <p>You have no tasks currently</p>
        }
      </div>
    </>
  );
}

export default Tasks;
