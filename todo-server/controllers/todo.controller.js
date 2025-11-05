import Todo from "../model/todo.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createTodo = async (req, res) => {
    try {
        const { title, completed } = req.body;
        console.log("Creating todo:", title, completed);
        const newTodo = new Todo({ title, completed });
        const createdTodo = await newTodo.save();
        if (!createdTodo) {
            return res.status(400).json(ApiResponse.error(res, "Failed to create todo"));
        }
        res.status(201).json(ApiResponse.created(res, createdTodo));
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json(ApiResponse.error(res, "Failed to create todo"));
    }
};

const getTodos = asyncHandler(async (req, res) => {
    // const todos = await Todo.find();
    // res.status(200).json(ApiResponse.success(res, todos));

    // ✅ SET DEFAULT VALUES
    const page = parseInt(req.query.page) || 1;        // default: 1
    const limit = parseInt(req.query.limit) || 10;     // default: 10

    // 🔒 Optional: Enforce reasonable limits (security & performance)
    const MAX_LIMIT = 100;
    const safeLimit = Math.min(limit, MAX_LIMIT);
    const safePage = page > 0 ? page : 1;

    const skip = (safePage - 1) * safeLimit;

    // Fetch data
    const total = await Todo.countDocuments();
    const todos = await Todo.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit);

    const totalPages = Math.ceil(total / safeLimit);

    const pagination = {
        total,
        elements: todos.length,
        page: safePage,
        limit: safeLimit,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1
    };
    res.status(200).json(
        ApiResponse.success(res, {
            todos,
            pagination
        }, "Todos fetched successfully")
    );
});
const getTodoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log("params", req.params);
    const todo = await Todo.findById(id);
    console.log("todo", todo);
    if (!todo) {
        return res.status(404).json(ApiResponse.notFound(res, "Todo not found"));
    }
    res.status(200).json(ApiResponse.success(res, todo));
    console.error("Error fetching todo:", error);
    res.status(500).json(ApiResponse.error(res, "Failed to fetch todo"));
});


const updateTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, completed },
        { new: true }
    );
    if (!updatedTodo) {
        return res.status(404).json(ApiResponse.notFound(res, "Todo not found"));
    }
    res.status(200).json(ApiResponse.success(res, updatedTodo));
});
const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
        return res.status(404).json(ApiResponse.notFound(res, "Todo not found"));
    }
    res.status(200).json(ApiResponse.success(res, deletedTodo, "Todo deleted successfully"));
});


export {
    createTodo,
    getTodos as getAllTodos,
    getTodoById,
    updateTodo,
    deleteTodo
};