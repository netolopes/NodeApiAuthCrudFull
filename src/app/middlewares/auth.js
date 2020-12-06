import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

// verifica se ta logando , checando se tem o token(retorna id usuario dentro do payload)
export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: ['Token  not provided'],
    });
  }
  // pegar segunda parte do token - payload
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // get token
    // console.log(decoded);

    // incluir id do usuario no token
    req.userId = decoded.id;
    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expirado ou inválido.'],
    });
  }
};
