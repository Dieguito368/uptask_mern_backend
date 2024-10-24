import { Router } from 'express';
import { body } from 'express-validator'; 
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio')
        .isLength({ min: 8} ).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req }) => value != req.body.password ? false : true).withMessage('Los password no son iguales'),
    body('email')
        .notEmpty().withMessage('El email no puede ir vacio')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.createAccount 
);
router.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErrors,
    AuthController.confimAccount
);
router.post('/login',
    body('email')
        .notEmpty().withMessage('El email no puede ir vacio')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.login
);
router.post('/request-code',
    body('email')
        .notEmpty().withMessage('El email no puede ir vacio')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
);
router.get('/user', authenticate, AuthController.user);

export default router;