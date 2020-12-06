import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  /*
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new multer.MulterError('Arquivo precisa ser PNG ou JPG.'));
    }

    return cb(null, true);
  },
  */
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      // Recebe um CALLBACK
      crypto.randomBytes(16, (err, res) => {
        // se der erro , retorne erro
        if (err) return cb(err);
        // se funcionar retorne
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
