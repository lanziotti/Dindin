const joi = require('joi');

const loginSchema = joi.object({
    email: joi.string().email().required().messages({
        'any.required': 'Todos os campos são obrigatórios.',
        'string.empty': 'Todos os campos são obrigatórios.',
        'string.email': 'O campo email precisa ter um formato válido.'
    }),
    senha: joi.string().required().messages({
        'any.required': 'Todos os campos são obrigatórios.',
        'string.empty': 'Todos os campos são obrigatórios.'
    })
});

module.exports = loginSchema;