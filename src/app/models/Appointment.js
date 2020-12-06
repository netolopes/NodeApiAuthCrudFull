import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  // conexao
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
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
