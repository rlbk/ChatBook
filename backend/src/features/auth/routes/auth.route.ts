import express, { Router } from 'express';
import { SignUp } from '../controllers/signup.controller';

class AuthRoutes {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.route('/signup').post(SignUp.prototype.create);
    return this.router;
  }
}

export const authRoutes = new AuthRoutes();
