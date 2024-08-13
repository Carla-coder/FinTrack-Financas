const express = require('express');
const router = express.Router();

const Middleware = require('./middleware/middleware');
const Usuario = require('./controllers/usuario');
const transacaoController = require('./controllers/transaçao');
const Categoria = require('./controllers/categoria');
const Subcategoria = require('./controllers/subcategoria');
const Orcamento = require('./controllers/orçamento');
const HistoricoOrcamento = require('./controllers/historico');
const Relatorio = require('./controllers/relatorio');
const RelatorioJson = require('./controllers/relatoriojson');

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

router.post('/orcamento', Orcamento.createOrcamento);
router.get('/orcamento/:id?', Orcamento.readOrcamento); 
router.put('/orcamento/:id', Orcamento.updateOrcamento); 
router.delete('/orcamento/:id', Orcamento.deleteOrcamento); 

router.post('/historico-orcamento', HistoricoOrcamento.createHistoricoOrcamento);
router.get('/historico-orcamento/:id?', HistoricoOrcamento.readHistoricoOrcamento); 
router.put('/historico-orcamento/:id', HistoricoOrcamento.updateHistoricoOrcamento); 
router.delete('/historico-orcamento/:id', HistoricoOrcamento.deleteHistoricoOrcamento); 

router.post('/relatorio', Relatorio.createRelatorio);
router.get('/relatorio/:id?', Relatorio.readRelatorio); 
router.put('/relatorio/:id', Relatorio.updateRelatorio); 
router.delete('/relatorio/:id', Relatorio.deleteRelatorio);

router.post('/relatorio-json', RelatorioJson.createRelatorioJson);
router.get('/relatorio-json/:id?', RelatorioJson.readRelatorioJson);
router.put('/relatorio-json/:id', RelatorioJson.updateRelatorioJson);
router.delete('/relatorio-json/:id', RelatorioJson.deleteRelatorioJson);


router.get('/', (req, res) => { 

    return res.json("API respondendo"); 

});

module.exports = router;
