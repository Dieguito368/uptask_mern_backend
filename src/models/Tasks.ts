import mongoose, { Schema, Document } from'mongoose';

export interface ITask extends Document {
    name: string
    description: string
}

const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        reqired: true
    },
    description: {
        type: String,
        tirm: true,
        required: true
    }
});

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;