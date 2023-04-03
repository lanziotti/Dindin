const app = require('../src/server');
const request = require('supertest');
const { userData } = require('./faker/fakerUser');

describe("Rota de login de um usuário", () => {
    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);
    });

    it('Login do usuário com o body correto...', async () => {
        const res = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        expect(res.status).toBe(200);
    });

    it('Login do usuário com o body imcompleto...', async () => {
        const res = await request(app).post("/login").send({
            email: userData.email
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Login do usuário com o e-mail do body no formato inválido...', async () => {
        const res = await request(app).post("/login").send({
            email: 'cs@emailcom',
            senha: 'carlos123'
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Login do usuário com o e-mail do body não cadastrado no sistema...', async () => {
        const res = await request(app).post("/login").send({
            email: 'rodrigolf@emailcom',
            senha: 'carlos123'
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Login do usuário com a senha do body inválido...', async () => {
        const res = await request(app).post("/login").send({
            email: 'cs@email.com',
            senha: 'carlos1234'
        });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('mensagem');
    });
});