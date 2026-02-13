import { Request, Response } from "express";
import { prisma } from "../db/prisma.js";

const addTask = async(req: Request, res: Response) => {
    const user = req.user;
    const { content } = req.body;

    if(!user){
        return res.status(400).json({message: "Invalid Request"});
    }

    if(!content?.trim()){
        return res.status(400).json({message: "Task can't be empty"});
    }

    try {
        const task = await prisma.todo.create({
            data: {
                userId: user.userId,
                content: content
            }
        });
        if(!task){
            return res.status(500).json({message: "Error occurred creating the task"});
        }

        return res.status(200).json({message: "Task added successfully", 
            data: {
                taskId: task.id,
                content: task.content,
                status: task.status
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error occurred during adding task" });
    }
}

const updateTask = async(req: Request, res: Response) => {
    const user = req.user;
    const { taskId, content, status } = req.body;

    if (!user) {
        return res.status(400).json({ message: "Invalid Request" });
    }

    if (taskId === undefined || taskId === null) {
        return res.status(400).json({ message: "taskId is required" });
    }

    if (content === undefined && status === undefined) {
        return res.status(400).json({ message: "Nothing to update" });
    }

    try {
        const task = await prisma.todo.findFirst({
            where: { id: taskId, userId: user.userId },
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const updateData: { content?: string; status?: number } = {};
        if (content !== undefined) updateData.content = content;
        if (status !== undefined) updateData.status = status;

        const updatedTask = await prisma.todo.update({
            where: { id: taskId },
            data: updateData,
        });

        return res.status(200).json({
            message: "Task updated successfully",
            data: {
                taskId: updatedTask.id,
                content: updatedTask.content,
                status: updatedTask.status,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error occurred during updating task" });
    }
}

const queryAllTasks = async(req: Request, res: Response) => {
    const user = req.user;

    if(!user){
        return res.status(400).json({message: "Invalid Request"});
    }

    try {
        const tasks = await prisma.todo.findMany({ where: { userId: user.userId } });

        return res.status(200).json({
            message: tasks.length === 0 ? "No tasks found" : "Tasks fetched successfully",
            data: { tasks },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error occurred during fetching tasks" });
    }
}

const deleteTask = async(req: Request, res: Response) => {
    const user = req.user;
    const { taskId } = req.body;

    if (!user) {
        return res.status(400).json({ message: "Invalid Request" });
    }

    if (taskId === undefined || taskId === null) {
        return res.status(400).json({ message: "taskId is required" });
    }

    try {
        const task = await prisma.todo.findFirst({ where: { userId: user.userId, id: taskId } }); 
        
        if(!task){
            return res.status(404).json({message: "task not found"});
        }

        await prisma.todo.delete({ where: { id: taskId } });

        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error occurred during deleting task" });
    }
}

export { addTask, updateTask, queryAllTasks, deleteTask };
