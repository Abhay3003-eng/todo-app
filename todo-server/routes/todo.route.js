import express from "express";
import { createTodo, deleteTodo, getAllTodos, getTodoById, updateTodo } from "../controllers/todo.controller.js";

const router = express.Router();

router.post("/", createTodo);
router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;