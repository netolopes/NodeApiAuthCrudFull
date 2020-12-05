import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
export default routes;

/*
import User from './app/models/User';
routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'netoxxxyy',
    email: 'netoy@gmail.com.br',
    password_hash: '123456',
  });
  return res.json(user);
});
*/
