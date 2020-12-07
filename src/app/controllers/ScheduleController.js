import Appointment from '../models/Appointment';
import User from '../models/User';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

// ---- Agendamento(listagem) para Prestadores de Serviços -----
class ScheduleController {
  async index(req, res) {
    // verifica se eh um prestador (provider==true)
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }
    const { date } = req.query; // Passagem de parametros pela url
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}
export default new ScheduleController();
