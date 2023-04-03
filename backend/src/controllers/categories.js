const knex = require('../database/connection');

const listCategories = async (req, res) => {
    try {
        const categories = await knex('categorias');

        return res.json(categories);
        
    } catch (error) {
        return res.status(500).json({mensagem: "Erro interno do servidor."});
    }
}

module.exports = {
    listCategories
}