import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // conexao
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // so existe no codigo , nao existe no banco
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        // avatar_id -> incluso no relacionamento
      },
      {
        sequelize,
      }
    );
    // triggers
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    //  retorna init()
    return this;
  }

  // Esta Tabela (User) tem a fk avatar_id (File)
  // avatar_id =>tem os campos de file e user
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); // id de File
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
