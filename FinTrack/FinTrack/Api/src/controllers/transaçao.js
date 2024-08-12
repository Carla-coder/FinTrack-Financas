const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função de criação de transação
const createTransacao = async (req, res) => {
    try {
        const { usuarioId, data, descricao, categoria, valor, tags } = req.body;
        const transacao = await prisma.transacao.create({
            data: {
                usuarioId: usuarioId,
                data: new Date(data),
                descricao: descricao,
                categoria: categoria,
                valor: valor,
                tags: tags
            }
        });
        return res.status(201).json(transacao);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Função para leitura de transações
const readTransacao = async (req, res) => {
    if (req.params.id !== undefined) {
        const transacao = await prisma.transacao.findUnique({
            where: {
                id: parseInt(req.params.id, 10)
            }
        });
        return res.json(transacao);
    } else {
        const transacoes = await prisma.transacao.findMany();
        return res.json(transacoes);
    }
};

// Função de atualização de transação
const updateTransacao = async (req, res) => {
    const { id } = req.params;
    try {
        const transacao = await prisma.transacao.update({
            where: {
                id: parseInt(id, 10)
            },
            data: req.body
        });
        return res.status(202).json(transacao);
    } catch (error) {
        return res.status(404).json({ message: "Transação não encontrada" });
    }
};

// Função de exclusão de transação
const deleteTransacao = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.transacao.delete({
            where: {
                id: parseInt(id, 10)
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ message: "Transação não encontrada" });
    }
};

module.exports = {
    createTransacao,
    readTransacao,
    updateTransacao,
    deleteTransacao
};
