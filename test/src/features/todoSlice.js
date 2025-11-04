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
    async (updatedTodo, { rejectWithValue }) => {
        try {
            // Call API to update the todo (assuming you have an updateTodo() function)
            const response = await updateTodo(updatedTodo);
            return response; // Return the updated todo object
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


// --- Initial State ---
const initialState = {
    todos: null,
    loading: false,
    error: null,
    page: 0,
    hasMore: true,
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
            .addCase(addTodoAsync.fulfilled, (state, action) => {
                state.loading = false;
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
            .addCase(updateTodoAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.todos.findIndex(todo => todo.id === action.payload.id);
                if (index !== -1) {
                    state.todos[index] = action.payload; // Replace with updated todo
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
