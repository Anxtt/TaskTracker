import React from "react"

import "../Styles/Task.css"

function Task({ task }) {
    return (
        <p>Task #{task.id}: {task.name}</p>
    )
}

export default Task
