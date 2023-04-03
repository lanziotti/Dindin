const { faker } = require('@faker-js/faker');

const transactionData = {
    tipo: faker.helpers.arrayElement(['saida', 'entrada']),
    descricao: faker.lorem.sentence(),
    valor: faker.finance.amount(),
    data: faker.date.between(),
    categoria_id: faker.datatype.number({ min: 1, max: 17, precision: 1 })
};

const transactionDataIncomplete = {
    descricao: faker.lorem.sentence(),
    valor: faker.finance.amount(),
    data: faker.date.between(),
    categoria_id: faker.datatype.number({ min: 1, max: 17, precision: 1 })
};

module.exports = {
    transactionData,
    transactionDataIncomplete
}