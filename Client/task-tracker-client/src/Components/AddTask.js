import React, { useContext, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../Context/AuthContext';

function AddTask() {
  const { auth } = useContext(AuthContext);
  const navigation = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      if (auth === false) {
        return navigation("/Login");
      }
    }

    checkAuth();
  }, [auth]);

  return (
    <>
      <p style={{ color: "#adb5bd", fontSize: 40 }}>CreateTask</p>
      <p style={{ color: "#ced4da", fontSize: 40 }}>CreateTask</p>
      <p style={{ color: "#cfe2ff", fontSize: 40 }}>CreateTask</p>
      <p style={{ color: "#d1e7dd", fontSize: 40 }}>CreateTask</p>
      <p style={{ color: "#cff4fc", fontSize: 40 }}>CreateTask</p>
      <p style={{ color: "#9ec5fe", fontSize: 40 }}>CreateTask</p>
      <p style={{ color: "#9eeaf9", fontSize: 40 }}>CreateTask</p>
    </>
  )
}

export default AddTask