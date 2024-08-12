const express = require('express');
const router = express.Router();
const Middleware = require('./middleware/middleware');
const Usuario = require('./controllers/usuario');
const transacaoController = require('./controllers/transaçao');
const Categoria = require('./controllers/categoria');
const Subcategoria = require('./controllers/subcategoria');

router.post('/signup', Usuario.create);
router.post('/login', Usuario.login);
router.get('/usuarios', Middleware.validaAcesso, Usuario.read);
router.get('/usuarios/:id', Middleware.validaAcesso, Usuario.read);
router.put('/usuarios/:id', Middleware.validaAcesso, Usuario.update);
router.delete('/usuarios/:id', Middleware.validaAcesso, Usuario.del);

router.post('/transacao', transacaoController.createTransacao);
router.get('/transacao/:id?', transacaoController.readTransacao);
router.put('/transacao/:id', transacaoController.updateTransacao);
router.delete('/transacao/:id', transacaoController.deleteTransacao);

router.post('/categoria', Categoria.createCategoria);
router.get('/categoria/:id?', Categoria.readCategoria);
router.put('/categoria/:id', Categoria.updateCategoria);
router.delete('/categoria/:id', Categoria.deleteCategoria);

router.post('/subcategoria', Subcategoria.createSubcategoria);
router.get('/subcategoria/:id?', Subcategoria.readSubcategoria);
router.put('/subcategoria/:id', Subcategoria.updateSubcategoria);
router.delete('/subcategoria/:id', Subcategoria.deleteSubcategoria);

// Rota para verificar se a API está respondendo
router.get('/', (req, res) => { 
    return res.json("API respondendo"); 
});

module.exports = router;
