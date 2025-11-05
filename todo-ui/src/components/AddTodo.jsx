import React from 'react'

import { useDispatch } from 'react-redux'
import { addTodoAsync, fetchTodosAsync } from '../features/todoSlice';

const AddTodo = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = React.useState('');

    // const addTodoHandler = async () => {
    //     if (title.trim() === '') return;
    //     await dispatch(addTodoAsync(title));
    //     await dispatch(fetchTodosAsync());
    //     setTitle('');
    // }
    const addTodoHandler = async () => {
        if (title.trim() === "") return;

        try {
            // Wait for the addTodoAsync thunk to complete
            await dispatch(addTodoAsync(title)).unwrap();
            // ⬆️ using .unwrap() will throw an error if the thunk fails

            // Then fetch updated todos from backend
            dispatch(fetchTodosAsync());
        } catch (err) {
            console.error("Failed to add todo:", err);
        } finally {
            setTitle("");
        }
    };

    return (
        <div className="add-todo">
            <label htmlFor="todo-title">Title:
                <input className="p-2 border rounded" type="text" id="todo-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button className="p-2 m-2 bg-blue-500 text-white rounded" onClick={addTodoHandler}>Add Todo</button>
            </label>
        </div>
    )
}

export default AddTodo
