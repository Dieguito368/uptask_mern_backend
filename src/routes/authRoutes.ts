import { Router } from 'express';
import { body, param } from 'express-validator'; 
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
router.post('/forgot-password',
    body('email')
        .notEmpty().withMessage('El email no puede ir vacio')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.forgotPassword
);
router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErrors,
    AuthController.validateToken
);
router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token no válido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio')
        .isLength({ min: 8} ).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req }) => value != req.body.password ? false : true).withMessage('Los password no son iguales'),
    handleInputErrors,
    AuthController.updatePassword
);
router.get('/user', authenticate, AuthController.user);


/** Routes for Profile **/
router.put('/profile', 
    authenticate, 
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('email')
        .notEmpty().withMessage('El email no puede ir vacio')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.updateProfile
);
router.post('/update-password', 
    authenticate,
    body('current_password')
        .notEmpty().withMessage('El password actual no puede ir vacio'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio')
        .isLength({ min: 8} ).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation')
        .custom((value, { req }) => value != req.body.password ? false : true).withMessage('Los password no son iguales'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
);

export default router;