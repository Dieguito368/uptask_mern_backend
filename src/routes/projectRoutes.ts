import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskControlller } from '../controllers/TaskController';
import { validateProjectExists } from '../middleware/project';

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
    validateProjectExists,
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
    validateProjectExists,
    ProjectController.updateProject
);
router.delete('/:projectId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
    handleInputErrors,
    validateProjectExists,
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
    validateProjectExists,
    TaskControlller.createTask
);
router.get('/:projectId/tasks',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
    handleInputErrors,
    validateProjectExists,
    TaskControlller.getProjectTasks
)
router.get('/:projectId/tasks/:taskId',
    param('projectId')
        .isMongoId().withMessage('ID del proyecto no válido'),
    param('taskId')
        .isMongoId().withMessage('ID de la tarea no válida'),
    handleInputErrors,
    validateProjectExists,
    TaskControlller.getTaskById
)
export default router;