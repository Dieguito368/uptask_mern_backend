import { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Project';

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export const validateProjectExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);

        if(!project) {
            const error = new Error('Proyecto no encontrado');

            res.status(404).json({ error: error.message })
        }

        req.project = project;

        next()
    } catch (error) {
        res.status(500).json({ error: `Hubo un error: ${error}` });
    }
} 