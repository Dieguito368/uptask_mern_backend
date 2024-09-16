import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskControlller } from '../controllers/TaskController';
import { projectExists } from '../middleware/project';
import { taskBelongToProject, taskExists } from '../middleware/task';

const router = Router();

// Routes for projects
router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
);
router.get('/', ProjectController.getAllProjects);
router.get('/:projectId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'), 
    handleInputErrors,
    projectExists,
    ProjectController.getProjectById
);
router.put('/:projectId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'), 
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    projectExists,
    ProjectController.updateProject
);
router.delete('/:projectId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
    handleInputErrors,
    projectExists,
    ProjectController.deleteProject
)

// Routes for tasks
router.post('/:projectId/tasks',
    param('projectId').
        isMongoId().withMessage('ID del proyecto no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    projectExists,
    TaskControlller.createTask
);
router.get('/:projectId/tasks',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
    handleInputErrors,
    projectExists,
    TaskControlller.getProjectTasks
);
router.get('/:projectId/tasks/:taskId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
    param('taskId')
        .isMongoId().withMessage('ID de la tarea no válida'),
    handleInputErrors,
    projectExists,
    taskExists,
    taskBelongToProject,
    TaskControlller.getTaskById
);
router.put('/:projectId/tasks/:taskId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
    param('taskId')
        .isMongoId().withMessage('ID de la tarea no válida'),
    body('name')
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    projectExists,
    taskExists,
    taskBelongToProject,
    TaskControlller.updateTask
);
router.patch('/:projectId/tasks/:taskId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
        param('taskId')
            .isMongoId().withMessage('ID de la tarea no válida'),
        body('status')
            .notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    projectExists,
    taskExists,
    taskBelongToProject,
    TaskControlller.updateStatusTask
);

router.delete('/:projectId/tasks/:taskId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
    param('taskId')
        .isMongoId().withMessage('ID de la tarea no válida'),
    handleInputErrors,
    projectExists,
    taskExists,
    taskBelongToProject,
    TaskControlller.deleteTask
);

export default router;