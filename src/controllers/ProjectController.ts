import type { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);

        // Asigna a un manager
        project.manager = req.user.id;

        try {
            await project.save();    

            res.status(200).send('Proyecto creado correctamente');
        } catch (error) {
            console.log(error);

            res.status(500).json(error);
        }
    }
    
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({ 
                $or: [
                    { manager: { $in: req.user.id } }
                ]
            });

            res.status(200).json(projects)
        } catch (error) {
            console.log(error);
        }
    }

    static getProjectById = async(req: Request, res: Response) => {
        try {
            const project = await req.project.populate('tasks');

            res.status(200).json(project);
        } catch (error) {
            console.log(error);
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            await Project.findByIdAndUpdate(req.project.id, req.body);

            res.status(200).send('Proyecto actualizado correctamente');
        } catch (error) {
            console.log(error);
        }
    } 

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await Project.findByIdAndDelete(req.project.id);
            
            res.status(200).send('Proyecto eliminado correctamente');
        } catch (error) {
            console.log(error);
            
        }
    }
}