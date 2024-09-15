import type { Request, Response } from 'express';
import Task from '../models/Tasks';
import Project from '../models/Project';

export class TaskControlller {
    static createTask = async (req: Request, res: Response) => {
        const { id } = req.params;
        
        const project = await Project.findById(id);

        if(!project) return res.status(404).json({ error: 'Proyecto no encontrado '});

        try {
            const task = new Task(req.body)
            
            task.project = project.id;
            project.tasks.push(task.id)
            
            await task.save();
            await project.save();

            res.status(200).send('Tarea creada correctamente');
        } catch (error) {
            console.log(error);
            
        }
    }
}
