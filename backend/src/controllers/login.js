require('dotenv').config();
const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await knex('usuarios').where({ email }).first();

    if (!user) {
      return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const correctPassword = await bcrypt.compare(senha, user.senha);

    if (!correctPassword) {
      return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." });
    }

    const token = jwt.sign({ id: user.id }, process.env.HASH_JWT, { expiresIn: '8h' });

    const { senha: _, ...userData } = user;

    return res.json({
      usuario: userData,
      token
    });

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor." });
  }
}

module.exports = {
  login
}