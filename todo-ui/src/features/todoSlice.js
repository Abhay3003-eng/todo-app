import { updateTodo } from "../config/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTodos, createTodo } from "../config/api";

export const fetchTodosAsync = createAsyncThunk(
    "todo/fetchTodosAsync",
    async (page, { rejectWithValue }) => {
        try {
            const todos = await fetchTodos(page);
            // console.log("Fetched todos:", todos);
            return todos.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const addTodoAsync = createAsyncThunk(
    "todo/addTodoAsync",
    async (title, { rejectWithValue }) => {
        try {
            const newTodo = await createTodo(title);
            return newTodo;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);
export const updateTodoAsync = createAsyncThunk(
    "todo/updateTodoAsync",
    async ({ id, updatedTodo }, { rejectWithValue }) => {
        try {
            // Call API to update the todo (assuming you have an updateTodo() function)
            console.log("Updating todo:", id, updatedTodo);
            const response = await updateTodo(id, updatedTodo);
            console.log("response:", response);

            return response; // Return the updated todo object
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


// --- Initial State ---
const initialState = {
    todos: [],
    loading: false,
    error: null,
    page: 0,
    hasMore: true,
    pagination: null, // 👈 add this
    currentPage: 0,   // 👈 you're using this but it's not in initialState
};


// --- Slice ---
const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodosAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodosAsync.fulfilled, (state, action) => {
                const { todos, pagination } = action.payload;
                console.log("Fetched todos:payload", action.payload, todos, pagination);
                const page = pagination.page;

                state.loading = false;
                state.error = null;
                state.pagination = pagination;
                state.currentPage = page;
                state.hasMore = pagination.hasNext;

                if (page === 1) {
                    // ✅ Always replace on page 1 — this prevents duplicates after delete/add
                    state.todos = todos;
                } else {
                    // Optional: deduplicate here too
                    const newIds = new Set(state.todos.map(t => t._id));
                    const uniqueNew = todos.filter(t => !newIds.has(t._id));
                    state.todos = [...state.todos, ...uniqueNew];
                }
            })
            .addCase(fetchTodosAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.hasMore = false;
            })

            // Add new todo
            .addCase(addTodoAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(addTodoAsync.fulfilled, (state, action) => {
            //     state.loading = false;
            // })
            .addCase(addTodoAsync.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    // Add to top (adjust if you use pagination/sorting)
                    state.todos = [action.payload, ...state.todos];
                }
            })
            .addCase(addTodoAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update todo
            .addCase(updateTodoAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // .addCase(updateTodoAsync.fulfilled, (state, action) => {
            //     state.loading = false;
            //     console.log("state.todos",state.todos)
            //     const index = state.todos.findIndex(todo => todo._id === action.payload.id);
            //     if (index !== -1) {
            //         state.todos[index] = action.payload; // Replace with updated todo
            //     }
            // })
            .addCase(updateTodoAsync.fulfilled, (state, action) => {
                state.loading = false;
                // normalize payload (handle response.data or direct todo)
                const updated = action.payload && action.payload.data ? action.payload.data : action.payload;
                console.log("update payload:", action.payload, "normalized:", updated);
                if (!Array.isArray(state.todos)) state.todos = [];
                const id = updated && (updated._id || updated.id);
                if (!id) return;
                const index = state.todos.findIndex(todo => (todo._id || todo.id) === id);
                if (index !== -1) {
                    state.todos[index] = updated;
                }
            })
            .addCase(updateTodoAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export const { removeTodo, toggleTodo } = todoSlice.actions;

export default todoSlice.reducer;
