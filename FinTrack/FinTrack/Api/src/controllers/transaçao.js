const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTransacao = async (req, res) => {
    const { usuarioId, data, descricao, categoria, valor, tags } = req.body;

    if (!usuarioId || !data || !descricao || !categoria || !valor) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const transacao = await prisma.transacao.create({
            data: {
                usuario: {
                    connect: { id: usuarioId } // Conectar a transação com o usuário pelo ID
                },
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
        res.status(500).json({ error: 'Erro ao criar transação.' });
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
