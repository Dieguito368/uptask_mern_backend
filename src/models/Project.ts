import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document  {
    projectName: string
    clientName: string
    projectDescription: string
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true,
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    projectDescription: {
        type: String,
        required: true,
        trim: true
    }
});

const Project = mongoose.model<IProject>('Project', ProjectSchema);

export default Project;