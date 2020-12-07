import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';
import mail from '../../config/mail';

//  ---- AGENDAMENTO ------
class AppointmentController {
  async index(req, res) {
    // paginacao
    const { page = 1 } = req.query; // Passagem de parametros pela url

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'], // ordernar por data
      attributes: ['id', 'date'], // trazer somente id e date
      limit: 20,
      offset: (page - 1) * 20,
      // relacionamento com user
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          // sub relacionamento de File X User
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

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
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'you can only appointment with providers' });
    }

    // usuario nao pode marcar agendamento para ele msm,
    // somente para um provider(prestador), verificar se user == provider
    const userLogin = await User.findOne({
      where: { id: req.userId },
    });
    if (checkIsProvider.id === userLogin.id) {
      return res
        .status(401)
        .json({ error: 'User(provider) can not appointment myself' });
    }

    // verifica se a Hora ja ta marcada
    // parseIso transforma a string em data
    // valida se a data solicitada é igual ou maior q a data atual
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    // verifica se ja tem agendamento na data solicitada
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not avaliable' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    // Notificacao  para o Prestador de servico
    const user = await User.findByPk(req.userId);

    const formatteDate = format(hourStart, "'dia' dd 'de' MMMM 'as' H:mm'h'", {
      locale: pt,
    });
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatteDate}`,
      user: provider_id,
    });
    return res.json(appointment);
  }

  // cancela agendamento caso esteja com 2 horas de antecedencia
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }
    // esta funcao verifica se esta a 2 horas de distancia da hora atual
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can cancel appointment 2 hours in  advance',
      });
    }
    appointment.canceled_at = new Date();

    await appointment.save();

    // Enviar email apos o cancelamennto
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      text: 'Voce tem um novo cancelamento',
    });
    return res.json(appointment);
  }
}
export default new AppointmentController();
