import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';

const routes = new Router();
const upload = multer(multerConfig);

// routes.use(authMiddleware) // bloqueia todas as rotas abaixo
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);
routes.post(
  '/files',
  [authMiddleware, upload.single('arquivo')],
  FileController.store
);
routes.get('/providers', authMiddleware, ProviderController.index);
routes.post('/appointments', authMiddleware, AppointmentController.store);

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
