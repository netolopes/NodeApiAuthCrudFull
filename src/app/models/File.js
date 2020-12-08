import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // conexao
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
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
}
export default File;
