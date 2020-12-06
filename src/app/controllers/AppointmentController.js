import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    // validacoes dos campos
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    // se nao validar os campos retorne erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { provider_id, date } = req.body;

    // Verifica se é um provider== true (fornecedor)
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'you can only appointment with providers' });
    }

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date,
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
