import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    // req.userId => USUARIO LOGADO
    // Verifica se é um provider== true (fornecedor)
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load Notifications' });
    }
    // aqui utiliza-se  metodos de busca do mongo
    const notifications = await Notification.find({
      user: req.userId,
    })
      // .sort('createdAt')
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }, // altera para true
      { new: true } // retorna a nova os  dadod modificados
    );
    return res.json(notification);
  }
}

export default new NotificationController();
