import type { Request, Response } from "express";
import User from "../models/User";

export class TeamController {
    static findUserByEmail = async (req: Request, res: Response) => {
        const { email } = req.body;

        const user = await User.findOne({ email }).select('id email name');

        if(!user) {
            const error = new Error('Usuario no encontrado.');
            return res.status(404).json({ error: error.message });
        }

        res.status(200).json(user);
    }

    static getAllProjectMembers = async (req: Request, res: Response) => {
        const { team } = await req.project.populate('team', 'id email name');

        res.status(200).json(team);
    }

    static addMember = async (req: Request, res: Response) => {
        const { id } = req.body;

        const user = await User.findById(id).select('id');

        if(!user) {
            const error = new Error('Usuario no encontrado.');
            return res.status(404).json({ error: error.message });
        }

        if(req.project.team.some(member => member.toString() === user.id.toString())) {
            const error = new Error('El usuario ya es miembro del proyecto.');
            return res.status(409).json({ error: error.message });    
        }

        if(req.project.manager.toString() === user.id.toString()) {
            const error = new Error('Eres el administrador del proyecto. No puedes agregarte a ti mismo al proyecto.');
            return res.status(409).json({ error: error.message });    
        }

        req.project.team.push(user.id);

        await req.project.save();

        res.status(200).send('Usuario agregado correctamente');
    }

    static removeMember = async (req: Request, res: Response) => {
        const { userId } = req.params;

        if(!req.project.team.some(member => member.toString() === userId)) {
            const error = new Error('El usuario no existe en el proyecto.');
            return res.status(409).json({ error: error.message });
        }

        if(req.project.manager.toString() === userId) {
            const error = new Error('Eres el administrador del proyecto. No puedes eliminarte a ti mismo del proyecto.');
            return res.status(409).json({ error: error.message });    
        }

        req.project.team = req.project.team.filter(member => member.toString() !== userId);

        await req.project.save();

        res.status(200).send('Usuario eliminado correctamente');
    }
}