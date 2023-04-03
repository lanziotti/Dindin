const knex = require('../database/connection');

const registerTransaction = async (req, res) => {
    const { user } = req;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {
        const categorie = await knex('categorias').where({ id: categoria_id }).first();

        if (!categorie) {
            return res.status(404).json({ mensagem: "A categoria não existe." });
        }

        const transactionUser = await knex('transacoes').insert({
            tipo,
            descricao,
            valor,
            data,
            usuario_id: user.id,
            categoria_id,
        }).returning(['id', 'tipo', 'descricao', 'valor', 'data', 'usuario_id', 'categoria_id']);

        const transaction = { ...transactionUser[0], valor: Number(valor), categoria_nome: categorie.descricao };

        return res.status(201).json(transaction);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}


const listTransactions = async (req, res) => {
    const { user } = req;

    try {
        const transactions = await knex('transacoes')
            .where({ usuario_id: user.id })
            .leftJoin('categorias', 'transacoes.categoria_id', 'categorias.id')
            .select('transacoes.*', 'categorias.descricao as categoria_nome')
            ;


        for (const transaction of transactions) {
            transaction.valor = Number(transaction.valor);
        }

        return res.json(transactions);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}


const updateTransaction = async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {
        const transaction = await knex('transacoes').where({ usuario_id: user.id, id }).first();

        if (!transaction) {
            return res.status(404).json({ mensagem: "A transação não existe." });
        }

        const categorie = await knex('categorias').where({ id: categoria_id }).first();

        if (!categorie) {
            return res.status(404).json({ mensagem: "A categoria não existe." });
        }

        const updatedTransaction = await knex('transacoes').where({ id }).update({
            descricao,
            valor,
            data,
            categoria_id,
            tipo
        });

        if (!updatedTransaction) {
            return res.status(400).json({ mensagem: "A transação não foi atualizada." });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}


const detailTransaction = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const transaction = await knex('transacoes').where({ usuario_id: user.id, id }).first();

        if (!transaction) {
            return res.status(404).json({ mensagem: "A transação não existe." });
        }

        const { tipo, descricao, valor, data, usuario_id, categoria_id } = transaction;

        const categorie = await knex('categorias').where({ id: categoria_id }).first();


        const objectTransaction = {
            id: Number(id),
            tipo,
            descricao,
            valor: Number(valor),
            data,
            usuario_id,
            categoria_id,
            categoria_nome: categorie.descricao
        }

        return res.json(objectTransaction);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}


const deleteTransaction = async (req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const transaction = await knex('transacoes').where({ usuario_id: user.id, id }).first();

        if (!transaction) {
            return res.status(404).json({ mensagem: "A transação não existe." });
        }

        const transactionDeleted = await knex('transacoes').where({ id }).del();

        if (!transactionDeleted) {
            return res.status(400).json({ mensagem: "A transação não foi excuída." })
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}


const consultExtract = async (req, res) => {
    const { user } = req;

    try {
        const entry = await knex('transacoes').where({ usuario_id: user.id, tipo: 'entrada' }).sum('valor').first();
        const exit = await knex('transacoes').where({ usuario_id: user.id, tipo: 'saida' }).sum('valor').first();

        return res.json({
            entrada: Number(entry.sum),
            saida: Number(exit.sum)
        });

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor...." });
    }
}


module.exports = {
    registerTransaction,
    updateTransaction,
    detailTransaction,
    listTransactions,
    deleteTransaction,
    consultExtract
}