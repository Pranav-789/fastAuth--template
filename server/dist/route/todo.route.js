import { Router } from "express";
import { addTask, updateTask, queryAllTasks, deleteTask } from "../controller/todo.controller.js";
import { verfiyJwt } from "../middleware/verifyJwt.js";
const router = Router();
router.post('/add-task', verfiyJwt, addTask);
router.put('/update-task', verfiyJwt, updateTask);
router.get('/query-all-tasks', verfiyJwt, queryAllTasks);
router.delete('/delete-task', verfiyJwt, deleteTask);
export default router;
