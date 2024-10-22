import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Prevenir dupicados
            const userExists = await User.findOne({ email });

            if(userExists) {
                const error = new Error('Ya existe una cuenta con ese email');

                return res.status(409).json({ error: error.message });
            }

            // Crear un usuario
            const user = new User(req.body);

            // Hash password
            user.password = await hashPassword(password) 

            // Generar el token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // Enviar el email
            AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: token.token
            });

            await Promise.allSettled([ user.save(), token.save() ])

            res.status(200).send('Cuenta creada correctamente, revisa tu email para confirmarla');
        } catch (error) {
            res.status(500).json(error)
        }
    }

    static confimAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExists = await Token.findOne({ token })

            if(!tokenExists) {
                const error = new Error('Token no válido');
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user);

            user.confirmed = true;
            
            await Promise.allSettled([ user.save(), tokenExists.deleteOne() ])

            res.status(200).send('Cuenta confirmada correctamente');
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if(!user) {
                const error = new Error('No logramos encontrar tu cuenta de UpTask');
                return res.status(404).json({ error: error.message })
            }

            if(!user.confirmed) {
                const token = new Token();
                token.user = user.id;
                token.token = generateToken();

                AuthEmail.sendConfirmationEmail({
                    name: user.name,
                    email: user.email,
                    token: token.token
                });

                const error = new Error('No haz confirmado tu cuenta de UpTask. Hemos enviado un email de confirmación');
                return res.status(401).json({ error: error.message })
            }

            // Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password);
            
            if(!isPasswordCorrect) {
                const error = new Error('Contraseña incorrecta');
                return res.status(401).json({ error: error.message })
            }
            
            res.status(200).send('Autenticado...');
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });

            if(!user) {
                const error = new Error('No logramos encontrar tu cuenta de UpTask');

                return res.status(404).json({ error: error.message });
            }

            if(user.confirmed) {
                const error = new Error('Tu cuenta de UpTask ya esta confirmada');

                return res.status(403).json({ error: error.message });
            }

            // Generar el token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;

            // Enviar el email
            AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: token.token
            });

            await Promise.allSettled([ user.save(), token.save() ])

            res.status(200).send('Se envió un nuevo token a tu Email');
        } catch (error) {
            res.status(500).json(error)
        }
    }
}