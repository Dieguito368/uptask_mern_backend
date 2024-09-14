import { Router } from 'express';
import { body } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('projectDescription')
        .notEmpty().withMessage('La descripción del proyecto es obligatoria'),
        handleInputErrors,
        ProjectController.createProject
);
router.get('/', ProjectController.getAllProjects);
router.get('/:id', ProjectController.getProjectById);

export default router;