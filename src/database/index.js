import Sequelize from 'sequelize';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';
import databaseConfig from '../config/database';

import mongoose from 'mongoose';

const models = [User, File, Appointment];
// class de conexao
class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // conexoes cm postgres
  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models) // mapeia os modes cm relacionamentos
      );
  }

  // ---- CONEXAO cm MONGODB ----
  // cria o banco automaticamente no mongodb compass, ao CRIAR um novo registro
  mongo() {
    //  useNewAndModify: true, old version
    this.mongo.Connection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}
export default new Database();
