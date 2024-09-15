import type { Request, Response } from 'express';
import Task from '../models/Tasks';
import Project from '../models/Project';

export class TaskControlller {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            
            task.project = req.project.id;
            req.project.tasks.push(task.id)
            
            await task.save();
            await req.project.save();

            res.status(200).send('Tarea creada correctamente');
        } catch (error) {
            console.log(error);
            
        }
    }
}