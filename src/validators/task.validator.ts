import { body, validationResult } from 'express-validator';
import { RequestHandler } from 'express';

export class TaskValidator {
  public validateTask: RequestHandler[] = [
    body('title').isString().notEmpty(),
    body('description').optional().isString(),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']),
    body('dueDate').optional().isISO8601(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      next();
    },
  ];
}
