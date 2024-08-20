const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para criar orçamento
const createOrcamento = async (req, res) => {
    const { categoria, valor } = req.body;
    const usuarioId = req.user.id;

    if (!categoria || !valor) {
        return res.status(400).json({ error: 'Categoria e valor são obrigatórios.' });
    }

    try {
        const categoriaId = await prisma.categoria.findUnique({ where: { nome: categoria } });
        if (!categoriaId) {
            return res.status(400).json({ error: 'Categoria inválida.' });
        }

        const orcamento = await prisma.orcamento.create({
            data: {
                usuarioId,
                categoriaId: categoriaId.id,
                valor,
                dataInicio: new Date(),
                dataFim: new Date(new Date().setMonth(new Date().getMonth() + 1))
            }
        });
        res.status(201).json(orcamento);
    } catch (error) {
        console.error('Erro ao criar orçamento:', error);
        res.status(500).json({ error: 'Erro ao criar orçamento.' });
    }
};

// Função para ler orçamentos
const readOrcamento = async (req, res) => {
    try {
        const orcamentos = await prisma.orcamento.findMany({
            where: { usuarioId: req.user.id }
        });
        res.json(orcamentos);
    } catch (error) {
        console.error('Erro ao obter orçamentos:', error);
        res.status(500).json({ error: 'Erro ao obter orçamentos.' });
    }
};

// Função para atualizar orçamento
const updateOrcamento = async (req, res) => {
    const { id } = req.params;
    const { categoriaId, valor } = req.body;
    try {
        const orcamento = await prisma.orcamento.update({
            where: { id: parseInt(id, 10) },
            data: {
                categoriaId,
                valor
            }
        });
        return res.status(202).json(orcamento);
    } catch (error) {
        console.error('Erro ao atualizar orçamento:', error);
        res.status(500).json({ error: 'Erro ao atualizar orçamento.' });
    }
};

// Função para deletar orçamento
const deleteOrcamento = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.orcamento.delete({
            where: { id: parseInt(id, 10) }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir orçamento:', error);
        res.status(500).json({ error: 'Erro ao excluir orçamento.' });
    }
};

module.exports = {
    createOrcamento,
    readOrcamento,
    updateOrcamento,
    deleteOrcamento
};
