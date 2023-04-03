const app = require('../src/server');
const request = require('supertest');
const { userData, userDataImcomplete, userInvalidEmail, userInvalidPassword } = require('./faker/fakerUser');

describe("Rota de cadastro de um usuário", () => {
    it('Cadastro de um usuário com o body correto...', async () => {
        const res = await request(app).post("/usuario").send(userData);

        expect(res.status).toBe(201);
    });

    it('Cadastro de um usuário com o body incompleto...', async () => {
        const res = await request(app).post("/usuario").send(userDataImcomplete);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Cadastro de um usuário com o e-mail com formato inválido...', async () => {
        const res = await request(app).post("/usuario").send(userInvalidEmail);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Cadastro de um usuário com a senha inválida...', async () => {
        const res = await request(app).post("/usuario").send(userInvalidPassword);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });
});

describe("Rota de detalhamento dos dados do usuário", () => {
    let token;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;
    });

    it('Detalhamento correto dos dados do usuário logado...', async () => {
        const res = await request(app).get("/usuario").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    it('Usuário não logado...', async () => {
        const res = await request(app).get("/usuario");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });
});

describe("Rota de edição dos dados do usuário", () => {
    let token;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;
    });

    it('Edição dos dados com o usuário não logado...', async () => {
        const res = await request(app).put("/usuario").send(userData);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição correta dos dados do usuário logado...', async () => {
        const res = await request(app).put("/usuario").send(userData).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(204);
    });

    it('Edição dos dados do usuário com o body incompleto...', async () => {
        const res = await request(app).put("/usuario").send({
            email: userData.email,
            senha: userData.senha
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição dos dados do usuário passando um e-mail já existente no banco de dados...', async () => {
        const res = await request(app).put("/usuario").send({
            "nome": "Raphael Veiga",
            "email": "raphael@email.com",
            "senha": "raphael123"
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição dos dados do usuário com um e-mail com formato inválido...', async () => {
        const res = await request(app).put("/usuario").send({
            nome: userData.nome,
            email: 'raphaelemail.com',
            senha: userData.senha
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição dos dados do usuário com uma senha inválida...', async () => {
        const res = await request(app).put("/usuario").send({
            nome: userData.nome,
            email: userData.email,
            senha: '123'
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });
});