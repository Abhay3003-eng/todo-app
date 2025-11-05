import axios from "axios";


export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8002/api",
});

export const fetchTodos = async (page=0) => {
  const response = await API.get(`/todos?page=${page}&limit=10`);
  if (response.status !== 200) throw new Error("Failed to fetch todos");

  return response.data;
};

export const createTodo = async (title) => {
  const response = await API.post("/todos", { title, completed: false });
  return response.data;
};
export const updateTodo = async (id, updates) => {
  const response = await API.put(`/todos/${id}`, updates);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await API.delete(`/todos/${id}`);
  return response.data;
};