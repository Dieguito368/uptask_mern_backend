import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskControlller } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { hasAuthorization, taskBelongToProject, taskExists } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';

const router = Router();

const validateProjectId = param('projectId').isMongoId().withMessage('ID del proyecto no válido');
const validateTaskId = param('taskId').isMongoId().withMessage('ID de la tarea no válida');
const validateProjectFields = [
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
];
const validateTaskFields = [
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
];

router.use(authenticate);

// Routes for projects
router.post('/', 
    validateProjectFields,
    handleInputErrors,
    ProjectController.createProject
);
router.get('/', ProjectController.getAllProjects);
router.get('/:projectId',
    validateProjectId, 
    handleInputErrors,
    projectExists,
    ProjectController.getProjectById
);
router.put('/:projectId',
    validateProjectId, 
    validateProjectFields,
    handleInputErrors,
    projectExists,
    ProjectController.updateProject
);
router.delete('/:projectId',
    validateProjectId,
    handleInputErrors,
    projectExists,
    ProjectController.deleteProject
)

// Routes for tasks
router.post('/:projectId/tasks',
    validateProjectId, 
    validateTaskFields,
    handleInputErrors,
    projectExists,
    hasAuthorization,
    TaskControlller.createTask
);
router.get('/:projectId/tasks',
    validateProjectId, 
    handleInputErrors,
    projectExists,
    TaskControlller.getProjectTasks
);
router.get('/:projectId/tasks/:taskId',
    validateProjectId,
    validateTaskId,
    handleInputErrors,
    projectExists,
    taskExists,
    taskBelongToProject,
    TaskControlller.getTaskById
);
router.put('/:projectId/tasks/:taskId',
    validateProjectId,
    validateTaskId,
    validateTaskFields,
    handleInputErrors,
    projectExists,
    taskExists,
    taskBelongToProject,
    hasAuthorization,
    TaskControlller.updateTask
);
router.patch('/:projectId/tasks/:taskId',
    validateProjectId,
    validateTaskId,
    body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    projectExists,
    taskExists,
    taskBelongToProject,
    TaskControlller.updateStatusTask
);
router.delete('/:projectId/tasks/:taskId',
    validateProjectId,
    validateTaskId,
    handleInputErrors,
    projectExists,
    taskExists,
    taskBelongToProject,
    hasAuthorization,
    TaskControlller.deleteTask
);

// Routes for Teams
router.post('/:projectId/team/find', 
    validateProjectId,
    body('email')
        .notEmpty().withMessage('El email no puede ir vacio.')
        .isEmail().toLowerCase().withMessage('Email no válido.'),
    handleInputErrors,
    projectExists,
    TeamController.findUserByEmail
);
router.get('/:projectId/team', 
    validateProjectId,
    handleInputErrors,
    projectExists,
    TeamController.getAllProjectMembers
);
router.post('/:projectId/team', 
    validateProjectId,
    body('id')
        .notEmpty().withMessage('El ID del usuario no puede ir vacio.')
        .isMongoId().withMessage('ID no válido.'),
    handleInputErrors,
    projectExists,
    TeamController.addMember
);
router.delete('/:projectId/team/:userId', 
    validateProjectId,
    param('userId')
        .notEmpty().withMessage('El ID del usuario no puede ir vacio.')
        .isMongoId().withMessage('ID no válido.'),
    handleInputErrors,
    projectExists,
    TeamController.removeMember
);

// Routes for Notes
router.get('/:projectId/tasks/:taskId/notes', 
    validateTaskId,
    validateProjectId,
    projectExists,
    taskExists,
    taskBelongToProject,
    NoteController.getTaskNotes
);
router.post('/:projectId/tasks/:taskId/notes',
    validateProjectId,
    validateTaskId,
    body('content').notEmpty().withMessage('El contenido de la nota es obligatorio'),
    projectExists,
    taskExists,
    taskBelongToProject,
    handleInputErrors,
    NoteController.createNote
);
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    validateProjectId,
    validateTaskId,
    param('noteId').isMongoId().withMessage('ID de la nota no válido'),
    projectExists,
    taskExists,
    taskBelongToProject,
    NoteController.deleteNote
);


export default router;