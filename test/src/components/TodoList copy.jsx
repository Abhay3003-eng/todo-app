import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTodosAsync, toggleTodo } from '../features/todoSlice.js';
import AddTodo from './AddTodo';
import { deleteTodo } from '../config/api.js';

const TodoList = () => {
    const dispatch = useDispatch();
    const { todos, loading, error } = useSelector(state => state.todos);
    useEffect(() => {
        dispatch(fetchTodosAsync());
    }, [dispatch]);
    console.log("Current todos:", todos);
    const deleteTodoHandler = async (id) => {
        try {
            await deleteTodo(id);
            dispatch(fetchTodosAsync());
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    }

    {loading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}

    return (
        <div>
            <h2>Todo List</h2>
            <div className="add-todo">
                <AddTodo />
            </div>
            <div className="card">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Completed</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.isArray(todos?.data?.todos) && todos.data.todos.map((todo, i) => {
                                return (<tr key={todo._id}>
                                    <td>{i + 1}</td>
                                    <td>{todo.title}</td>
                                    <td>{todo.completed ? 'Yes' : 'No'}</td>
                                    <td>
                                        <button onClick={() => dispatch(toggleTodo({ id: todo._id }))}>
                                            {todo.completed ? 'Undo' : 'Complete'}
                                        </button>

                                        <button className='p-2 m-2' onClick={() => deleteTodoHandler(todo._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default TodoList
