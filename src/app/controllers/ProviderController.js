import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findOne({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'], // mostrar somentes esses atributos
      // incluir o model File traz os dados referente ao relacionamento  FK avatar_id
      //  include: [File],
      include: [
        {
          model: File,
          as: 'avatar', // usuando alias aqui e no model
          attributes: ['name', 'path', 'url'], // exibir somente esses atributos
        },
      ],
    });
    return res.json(providers);
  }
}

export default new ProviderController();
