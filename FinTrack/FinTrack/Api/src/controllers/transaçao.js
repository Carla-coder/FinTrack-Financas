// controllers/transacaoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTransacao = async (req, res) => {
    try {
        const { usuarioId, data, descricao, categoria, valor, tags } = req.body;

        // Validar categoria
        const validCategorias = ['RENDA', 'ALIMENTACAO', 'TRANSPORTE', 'UTILIDADES', 'ENTRETENIMENTO'];
        if (!validCategorias.includes(categoria)) {
            return res.status(400).json({ message: 'Categoria inválida.' });
        }

        // Criar transação
        const transacao = await prisma.transacao.create({
            data: {
                usuarioId,
                data: new Date(data),
                descricao,
                categoria,
                valor,
                tags
            }
        });

        res.status(201).json(transacao);
    } catch (error) {
        console.error('Erro ao criar transação:', error);
        res.status(500).json({ message: 'Erro ao criar transação.' });
    }
};

const readTransacao = async (req, res) => {
    if (req.params.id) {
        const transacao = await prisma.transacao.findUnique({
            where: { id: parseInt(req.params.id, 10) }
        });
        res.json(transacao);
    } else {
        const transacoes = await prisma.transacao.findMany();
        res.json(transacoes);
    }
};

const updateTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        const transacao = await prisma.transacao.update({
            where: { id: parseInt(id, 10) },
            data: req.body
        });
        res.status(202).json(transacao);
    } catch (error) {
        res.status(404).json({ message: 'Transação não encontrada' });
    }
};

const deleteTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.transacao.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: 'Transação não encontrada' });
    }
};

module.exports = {
    createTransacao,
    readTransacao,
    updateTransacao,
    deleteTransacao
};
