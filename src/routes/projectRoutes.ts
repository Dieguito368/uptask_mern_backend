import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskControlller } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { taskBelongToProject, taskExists } from '../middleware/task';
import { authenticate } from '../middleware/auth';

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
    TaskControlller.deleteTask
);

export default router;