import mongoose, { Schema, Document, Types } from'mongoose';

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITask extends Document {
    name: string
    description: string
    status: TaskStatus
    updatedBy: {
        user: Types.ObjectId
        status: TaskStatus
    }[]	
    project: Types.ObjectId,
    notes: Types.ObjectId[]
}

const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    updatedBy: [
        {
            user: {
                type: Types.ObjectId,
                default: null,
                ref: 'User'
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, { timestamps: true });

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;