import React, { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext();

export default function TasksProvider({ children }) {
    const [tasks, dispatch] = useReducer(tasksReducer, []);

    return (
        <TasksContext.Provider value={{ tasks, dispatch }}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    return useContext(TasksContext);
}

function tasksReducer(state, action) {
    switch (action.type) {
        case "deleteTask": {
            return state.filter(x => x.id !== action.id);
        }
        case "editTask": {
            return state.map(x => {
                if (x.id !== action.task.id) {
                    return x;
                }

                return { ...x, name: action.task.name, deadline: action.task.deadline, isCompleted: action.task.isCompleted };
            })
        }
        case "getTasks": {
            return action.tasks;
        }
        default:
            alert("Error");
            break;
    }
}
