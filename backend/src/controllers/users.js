const knex = require('../database/connection');
const bcrypt = require('bcrypt');

const userRegistration = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const user = await knex('usuarios').where({ email }).first();

        if (user) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
        }

        const encryptedPassword = await bcrypt.hash(senha, 10);

        const registeredUser = await knex('usuarios').insert({
            nome,
            email,
            senha: encryptedPassword
        }).returning(['id', 'nome', 'email']);

        if (!registeredUser[0]) {
            return res.status(500).json({ mensagem: "Erro interno do servidor." });
        }

        return res.status(201).json(registeredUser[0]);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}


const getUserProfile = async (req, res) => {
    return res.json(req.user);
}


const updateUserProfile = async (req, res) => {
    const { user } = req;
    const { nome, email, senha } = req.body;
    
    try {
        const emailExists = await knex('usuarios').where({ email }).first();

        if (emailExists && emailExists.email !== user.email) {
            return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." });
        }

        const encryptedPassword = await bcrypt.hash(senha, 10);

        const updatedUser = await knex('usuarios')
            .where({ id: user.id })
            .update({
                nome,
                email,
                senha: encryptedPassword
            });

        if (!updatedUser) {
            return res.status(400).json({mensagem: "O usuário não foi atualizado."});
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

module.exports = {
    userRegistration,
    getUserProfile,
    updateUserProfile
}