import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Note, { INote } from '../models/Note';

type NoteParams = {
    noteId: Types.ObjectId;
}

export class NoteController {
    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task.id });

            res.status(200).json(notes);
        } catch (error) {
            res.status(500).json(error);
        }
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
            res.status(500).json(error);
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);

        if (!note) {
            const error = new Error('Nota no encontrada');

            return res.status(401).json({ error: error.message });
        }

        if(note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Acción no válida');

            return res.status(401).json({ error: error.message });
        }

        req.task.notes = req.task.notes.filter(note => note._id.toString() !== noteId.toString());

        try {
            await Promise.allSettled([ req.task.save(), note.deleteOne() ]); 

            res.status(200).send('Nota eliminada correctamente');
        } catch (error) {
            res.status(500).json({ error: `Hubo un error ${error}` });
        }
    }
} 