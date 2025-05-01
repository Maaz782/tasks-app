import { body, validationResult } from 'express-validator';
import { RequestHandler } from 'express';

export class UserValidator {
  public validateUser: RequestHandler[] = [
    body('name').isString().notEmpty(),
    body('email').isString().notEmpty().isEmail(),
    body('password').isString().notEmpty().isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'admin']),

    (req, res, next) => {
      console.log('Validating user...', body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      next();
    },
  ];
}
