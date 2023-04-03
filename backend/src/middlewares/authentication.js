require('dotenv').config();
const knex = require('../database/connection');
const jwt = require('jsonwebtoken');

const authenticationFilter = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "Não autorizado." });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, process.env.HASH_JWT);

        const user = await knex('usuarios').where({ id }).first();

        if (!user) {
            return res.status(401).json({ mensagem: "Não autorizado." });
        }

        const { senha: _, ...userData } = user;

        req.user = userData;

        next();

    } catch (error) {
        return res.status(401).json({"mensagem": "Não autorizado."});
    }
}

module.exports = {
    authenticationFilter
}