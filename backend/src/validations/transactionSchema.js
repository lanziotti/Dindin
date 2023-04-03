const joi = require('joi');

const transactionSchema = joi.object({
    tipo: joi.string().valid('entrada').valid('saida').insensitive().required().messages({
        'any.required': 'Todos os campos são obrigatórios.',
        'string.empty': 'Todos os campos são obrigatórios.',
        'any.only': 'O tipo precisa ser: "entrada" ou "saida"'
    }),
    descricao: joi.string().required().messages({
        'any.required': 'Todos os campos são obrigatórios.',
        'string.empty': 'Todos os campos são obrigatórios.'
    }),
    valor: joi.number().positive().required().messages({
        'any.required': 'Todos os campos são obrigatórios.',
        'number.positive': 'O campo valor precisa ser positivo.',
        'number.base': 'O campo valor precisa ser um número (em centavos).'
    }),
    data: joi.string().required().messages({
        'any.required': 'Todos os campos são obrigatórios.',
        'string.empty': 'Todos os campos são obrigatórios.'
    }),
    categoria_id: joi.number().positive().integer().required().messages({
        'any.required': 'Todos os campos são obrigatórios.',
        'number.positive': 'O campo categoria_id precisa ser positivo.',
        'number.base': 'O campo categoria_id precisa ser um número inteiro.'
    }),
});

module.exports = transactionSchema;