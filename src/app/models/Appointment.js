import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  // conexao
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          // campo virtual, informa oa agendamentos ja acontecidos(se ja passou do horario)
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          // verifica se ainda , falta no minnimo 2 horas para data do agendamento
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );
    //  retorna init()
    return this;
  }

  // Esta Tabela (Appointment) tem a fk user_id (User) e fk provider_id(User)
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // id de User
    this.belongsTo(models.User, {
      foreignKey: 'provider_id',
      as: 'provider',
    }); // provider de User
  }
}
export default Appointment;
