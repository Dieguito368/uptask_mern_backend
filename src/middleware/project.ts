import { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Project';

declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}

export const projectExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId: id } = req.params;

        const project = await Project.findById(id);

        if(!project || (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id))) {
            const error = new Error('Proyecto no encontrado');

            return res.status(404).json({ error: error.message })
        }

        req.project = project;

        next();
    } catch (error) {
        res.status(500).json({ error: `Hubo un error: ${error}` });
    }
} 