const { faker } = require('@faker-js/faker');

const userData = {
    nome: faker.name.fullName(),
    email: faker.helpers.unique(faker.internet.email),
    senha: faker.internet.password()
};

const userDataImcomplete = {
    email: faker.helpers.unique(faker.internet.email),
    senha: faker.internet.password()
};

const userInvalidEmail = {
    nome: faker.name.fullName(),
    email: faker.animal.dog(),
    senha: faker.internet.password()
};

const userInvalidPassword = {
    nome: faker.name.fullName(),
    email: faker.helpers.unique(faker.internet.email),
    senha: faker.science.unit().symbol
};

module.exports = {
    userData,
    userDataImcomplete,
    userInvalidEmail,
    userInvalidPassword
}