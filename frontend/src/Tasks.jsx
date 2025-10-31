import { useEffect, useState } from 'react';
import api from "./api/axios"

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTask, setEditTask] = useState({ id: null, title: "", isDone: false});

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                console.error("No userId found in localStorage.");
                return;
            }

            const response = await api.get(`/tasks`, {
                params: { userId: userId }
            });

            setTasks(response.data);
        } catch (error) {
            console.error("Error loading tasks: ", error);
        }
    };

    const addTasks = async () => {
        const userId = localStorage.getItem("userId");

        //TODO can change later to SweetAlert2
        if(!newTitle.trim())
        {
            return alert("Task title is required")
        }

        try {
            await api.post("/tasks", {
                title: newTitle,
                isDone: false,
                userId: userId
            });

            await loadTasks();
            setNewTitle("");
            setShowModal(false);
        } catch(error) {
            console.error("error adding task: ", error);
        }
    }

    const updateTask = async () => {
        try {
            await api.put(`/tasks/${editTask.id}`, {
                title: editTask.title,
                isDone: editTask.isDone
            });

            await loadTasks();
            setShowEditModal(false);
        } catch (error) {
            console.error("error updating task: ", error);
        }
    };

    const handleEditChange = (e) => {
        setEditTask({
            ...editTask,
            [e.target.name]: e.target.type === "checkbox"
                ? e.target.checked
                : e.target.value
        });
    };

    const deleteTask = async (id) => {

        //TODO can use SweetAlert2 for better UI/UX
        if(!window.confirm("Are you sure you want to delete this task?"))
        {
            return;
        }

        try {
            await api.delete(`/tasks/${id}`);

            alert("task deleted successfully!")
            loadTasks();
        } catch(error) {
            console.error("error deleting task: ", error);
            alert("Failed to delete task");
        }
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Tasks</h2>
                <button className="btn btn-primary" onClick = {() => setShowModal(true) }>
                    Add Task
                </button>
            </div>

            <table className="table table-striped table-hover">
                <thead className="table-success">
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.isDone ? "✅ Done" : "❌ Not Done"}</td>
                                <td>
                                    <div className="btn-group" role = "group">
                                        <button className="btn btn-sm btn-warning" onClick = {() => {
                                            setEditTask({
                                                id: task.id,
                                                title: task.title,
                                                isDone: task.isDone
                                            });
                                            setShowEditModal(true);
                                        } }>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger ms-2" onClick = {() => deleteTask(task.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan = "3" className="text-center text-muted">
                                No tasks found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Task</h5>
                                <button
                                    type="button"
                                    className = "btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className = "form-control"
                                    placeholder = "Enter task title"
                                    value = {newTitle}
                                    onChange = {(e) => setNewTitle(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className = "btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className = "btn btn-primary"
                                    onClick={addTasks}
                                >
                                    Save Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Edit Task</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                {/* Title Input */}
                                <div className="mb-3">
                                    <label className="form-label">Task Title</label>
                                    <input
                                        type="text"
                                        name = "title"
                                        className="form-control"
                                        placeholder="Enter task title"
                                        value={editTask.title}
                                        onChange = {handleEditChange}
                                    />
                                </div>

                                {/* Done Toggle */}
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="isDone"
                                        id="isDoneSwitch"
                                        checked={editTask.isDone}
                                        onChange = {handleEditChange}
                                    />
                                    <label className="form-check-label" htmlFor="isDoneSwitch">
                                        {editTask.isDone ? "✅ Marked as Done" : "❌ Not Done"}
                                    </label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={updateTask}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;
