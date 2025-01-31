import type { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskControlller {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            
            task.project = req.project.id;
            req.project.tasks.push(task.id)
            
            await Promise.allSettled([ task.save(), req.project.save() ])

            res.status(200).send('Tarea creada correctamente');
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate('project');

            res.status(200).json(tasks)
        } catch (error) {
            console.log(error);
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            res.status(200).json(req.task);
        } catch (error) {
            console.log(error);
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            await req.task.updateOne(req.body);

            res.status(200).send('Tarea actualizada correctamente');
        } catch (error) {
            console.log(error);
        }
    }

    static updateStatusTask = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;

            req.task.status = status;

            const data = {
                user:  req.user.id,
                status: req.body.status
            }

            req.task.updatedBy.push(data);
            
            await req.task.save();

            res.status(200).send('Estado actualizado correctamente');
        } catch (error) {
            console.log(error);
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(taskState => taskState.toString() !== req.task.id);

            await Promise.allSettled([ req.task.deleteOne(), req.project.save() ])
    
            res.status(200).send('Tarea eliminada correctamente');
        } catch (error) {
            console.log(error);
        }
    }
}