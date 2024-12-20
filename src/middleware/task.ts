import { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/Tasks';

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}

export const taskExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId: id } = req.params;

        const task = await Task.findById(id);

        if(!task) {
            const error = new Error('Tarea no encontrada');

            return res.status(404).json({ error: error.message })
        }

        req.task = task;

        next();
    } catch (error) {
        res.status(500).json({ error: `Hubo un error: ${error}` });
    }
}

export const taskBelongToProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.task.project.toString() !== req.project.id.toString()) {
            const error = new Error('Acción no válida')
            
            return res.status(400).json({ error: error.message })
        }

        next();
    } catch (error) {
        res.status(500).json({ error: `Hubo un error: ${error}` });
    }   
}

export const hasAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(req.user.id.toString() !== req.project.manager.toString()) {
            const error = new Error('Acción no válida');
            
            return res.status(400).json({ error: error.message })
        }

        next();
    } catch (error) {
        res.status(500).json({ error: `Hubo un error: ${error}` });
    }   
}