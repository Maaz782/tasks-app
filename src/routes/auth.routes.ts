import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserValidator } from '../validators/user.validator';

export class AuthRoutes {
  public router: Router;
  private authController: AuthController;
  private userValidator: UserValidator

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.userValidator = new UserValidator();
    this.routes();
  }

  private routes(): void {
    this.router.post('/register', this.userValidator.validateUser, async (req: Request, res: Response): Promise<void> => {
      try {
        const result = await this.authController.registerUser(req, res);
        console.log('Register result:', result);
        if (result) {
          res.status(201).json(result);
        }
      } catch (error) {
        throw error;
      }
    });

    this.router.post('/login', async (req: Request, res: Response): Promise<void> => {
      try {
        const result = await this.authController.loginUser(req, res);
        if (result) {
          res.status(201).json(result);
        }
      } catch (error) {
        throw error;
      }
    });
  }
}
