const express = require('express');
const { listCategories } = require('../controllers/categories');
const { login } = require('../controllers/login');
const {
    registerTransaction,
    updateTransaction,
    detailTransaction,
    listTransactions,
    deleteTransaction,
    consultExtract
} = require('../controllers/transactions');
const { userRegistration,
    getUserProfile,
    updateUserProfile
} = require('../controllers/users');
const { authenticationFilter } = require('../middlewares/authentication');
const validateRequest = require('../middlewares/validateRequest');
const loginSchema = require('../validations/loginSchema');
const transactionSchema = require('../validations/transactionSchema');
const userSchema = require('../validations/userSchema');

const routes = express();

routes.post('/usuario', validateRequest(userSchema), userRegistration);
routes.post('/login', validateRequest(loginSchema), login);

routes.use(authenticationFilter);

routes.get('/usuario', getUserProfile);
routes.put('/usuario', validateRequest(userSchema), updateUserProfile);
routes.get('/categoria', listCategories);
routes.post('/transacao', validateRequest(transactionSchema), registerTransaction);
routes.put('/transacao/:id', validateRequest(transactionSchema), updateTransaction);
routes.get('/transacao/extrato', consultExtract);
routes.get('/transacao/:id', detailTransaction);
routes.get('/transacao', listTransactions);
routes.delete('/transacao/:id', deleteTransaction);

module.exports = routes;