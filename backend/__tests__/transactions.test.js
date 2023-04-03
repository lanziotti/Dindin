const app = require('../src/server');
const request = require('supertest');
const { userData } = require('./faker/fakerUser');
const { transactionData, transactionDataIncomplete } = require('./faker/fakerTransaction');

describe("Rota de cadastro de uma transação", () => {
    let token;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;
    });

    it('Cadastro de uma transação de um usuário não logado...', async () => {
        const res = await request(app).post("/transacao").send(transactionData);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Cadastro de uma transação de um usuário logado com o body correto...', async () => {
        const res = await request(app).post("/transacao").send(transactionData).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(201);
    });

    it('Cadastro de uma transação de um usuário logado com o body incompleto...', async () => {
        const res = await request(app).post("/transacao").send(transactionDataIncomplete).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Cadastro de uma transação de um usuário logado com o tipo inválido...', async () => {
        const res = await request(app).post("/transacao").send({
            "tipo": "pago",
            "descricao": "Banho dog",
            "valor": 600,
            "data": "2022-08-31T15:30:00.000Z",
            "categoria_id": 9
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Cadastro de uma transação de um usuário logado com o valor inválido...', async () => {
        const res = await request(app).post("/transacao").send({
            "tipo": "saida",
            "descricao": "Banho dog",
            "valor": - 600,
            "data": "2022-08-31T15:30:00.000Z",
            "categoria_id": 9
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Cadastro de uma transação de um usuário logado com uma categoria não existente no banco de dados...', async () => {
        const res = await request(app).post("/transacao").send({
            "tipo": "saida",
            "descricao": "Banho dog",
            "valor": 600,
            "data": "2022-08-31T15:30:00.000Z",
            "categoria_id": 19
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('mensagem');
    });
});

describe("Rota de edição de uma transação", () => {
    let token;
    let transaction_id;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;

        const transaction = await request(app).post("/transacao").send(transactionData).set("Authorization", `Bearer ${token}`);

        transaction_id = transaction.body.id;
    });

    it('Edição de uma transação de um usuário não logado...', async () => {
        const res = await request(app).put(`/transacao/${transaction_id}`).send(transactionData);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição de uma transação de um usuário logado com o body correto', async () => {
        const res = await request(app).put(`/transacao/${transaction_id}`).send(transactionData).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(204);
    });

    it('Edição de uma transação de um usuário logado com o body incompleto...', async () => {
        const res = await request(app).put(`/transacao/${transaction_id}`).send(transactionDataIncomplete).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição de uma transação de um usuário logado com o tipo inválido...', async () => {
        const res = await request(app).put(`/transacao/${transaction_id}`).send({
            "descricao": "Venda cervejas",
            "valor": 1500,
            "data": "2022-09-05 12:35:00",
            "categoria_id": 16,
            "tipo": "pago"
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição de uma transação de um usuário logado com o valor inválido...', async () => {
        const res = await request(app).put(`/transacao/${transaction_id}`).send({
            "descricao": "Venda cervejas",
            "valor": - 1500,
            "data": "2022-09-05 12:35:00",
            "categoria_id": 16,
            "tipo": "saida"
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição de uma transação de um usuário logado com uma categoria não existente no banco de dados...', async () => {
        const res = await request(app).put(`/transacao/${transaction_id}`).send({
            "descricao": "Venda cervejas",
            "valor": 1500,
            "data": "2022-09-05 12:35:00",
            "categoria_id": 19,
            "tipo": "saida"
        }).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Edição de uma transação de um usuário logado que não existe no banco de dados...', async () => {
        const res = await request(app).put("/transacao/1000").send(transactionData).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('mensagem');
    });
});

describe("Rota de detalhamento de uma transação", () => {
    let token;
    let transaction_id;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;

        const transaction = await request(app).post("/transacao").send(transactionData).set("Authorization", `Bearer ${token}`);

        transaction_id = transaction.body.id;
    });

    it('Detalhamento de uma transação de um usuário não logado...', async () => {
        const res = await request(app).get(`/transacao/${transaction_id}`);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Detalhamento de uma transação de um usuário logado...', async () => {
        const res = await request(app).get(`/transacao/${transaction_id}`).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

    it('Detalhamento de uma transação inexistente de um usuário logado...', async () => {
        const res = await request(app).get("/transacao/1000").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('mensagem');
    });
});

describe("Rota de listagem das transações", () => {
    let token;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;
    });

    it('Listagem das transações de um usuário não logado...', async () => {
        const res = await request(app).get("/transacao");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Listagem das transações de um usuário logado...', async () => {
        const res = await request(app).get("/transacao").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });
});

describe("Rota de exclusão de uma transação", () => {
    let token;
    let transaction_id;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;

        const transaction = await request(app).post("/transacao").send(transactionData).set("Authorization", `Bearer ${token}`);

        transaction_id = transaction.body.id;
    });

    it('Exclusão de uma transação de um usuário não logado...', async () => {
        const res = await request(app).delete(`/transacao/${transaction_id}`);

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Exclusão de uma transação de um usuário logado...', async () => {
        const res = await request(app).delete(`/transacao/${transaction_id}`).set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(204);
    });

    it('Exclusão de uma transação inexistente de um usuário logado...', async () => {
        const res = await request(app).delete("/transacao/1000").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('mensagem');
    });
});

describe("Rota de consulta do extrato", () => {
    let token;

    beforeAll(async () => {
        await request(app).post("/usuario").send(userData);

        const login = await request(app).post("/login").send({
            email: userData.email,
            senha: userData.senha
        });

        token = login.body.token;
    });

    it('Extrato bancário de um usuário não logado...', async () => {
        const res = await request(app).get("/transacao/extrato");

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('Extrato bancário de um usuário logado...', async () => {
        const res = await request(app).get("/transacao/extrato").set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
    });
});