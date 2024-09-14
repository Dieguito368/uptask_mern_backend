import type { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        try {
            await project.save();    

            res.status(200).send('Proyecto creado correctamente');
        } catch (error) {
            console.log(error);
        }
    }
    
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find();

            res.status(200).json(projects)
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async(req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const project = await Project.findById(id);

            if(!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
            
            res.status(200).json(project);
        } catch (error) {
            console.log(error);
        }
    }
}