import { Request, Response } from 'express';
import Note, { INote } from '../models/Note';

export class NoteController {
    static getAllNotes = async (req: Request, res: Response) => {
    
    }

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const note = new Note();

        note.content = req.body.content;
        note.createdBy = req.user.id;
        note.task = req.task.id;

        req.task.notes.push(note.id);

        try {
            await Promise.allSettled([ note.save(), req.task.save()] );

            res.status(200).send('Nota creada correctamente');
        } catch (error) {
            res.status(200).json(error);
        }
    }
} 