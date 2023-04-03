const app = require('../src/server');
const request = require('supertest');
const { userData } = require('./faker/fakerUser');

describe("Rota de listagem das categorias", () => {
    let token;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;
    });

    it('Listagem das categorias cadastradas com o usuário não logado...', async () => {
        const res = await request(app).get("/categoria");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Listagem das categorias cadastradas com o usuário logado...', async () => {
        const res = await request(app).get("/categoria").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });
});