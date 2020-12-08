import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

// UTC vai diminuir 3hrs.   ex: Pra ser 19hs, no banco alterar pra 22hrs
// pegar data atual vindo do datepicker: console->new Date()getTime()=1607432242544

// Mostra os horarios disponiveis pra agendamento pra um determinado
// prestador de servico dentro de 1 dia
class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // converte em number
    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    // 2020-10-12 15:10:10 -> 2020-10-12 08:00:00,2020-10-12 09:00:00 ...
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map((time) => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      // retorna obj do map acima
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"), // formato de data cm timezone UTC
        available:
          isAfter(value, new Date()) && // retorna available==true. Compara a hora atual cm os horarios acima para exibir os horarios "disponiveis"(APOS A HORA ATUAL)
          !appointments.find((a) => format(a.date, 'HH:mm') === time), // comparando cm os horarios de appointments(no BANCO) , verifica se horario(s) disponivel(s) nao estao contidos no banco, pois caso esteja siguinifica q o horario ja esta agendado
      };
    });
    return res.json(available);
  }
}
export default new AvailableController();
