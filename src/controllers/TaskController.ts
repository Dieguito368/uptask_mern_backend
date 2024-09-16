import type { Request, Response } from 'express';
import Task from '../models/Tasks';

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
            const { taskId } = req.params;
            
            const task = await Task.findById(taskId);
    
            if(!task) {
                const error = new Error('Tarea no encontrada');
    
                return res.status(404).json({ error: error.message });
            }

            if(task.project.toString() !== req.project.id) {
                const error = new Error('Acción no válida')
                
                return res.status(400).json({ error: error.message })
            }
    
            res.status(200).json(task);
        } catch (error) {
            console.log(error);
        }
    }
}