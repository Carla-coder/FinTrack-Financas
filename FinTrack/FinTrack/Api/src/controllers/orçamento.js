const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função de criação de orçamento
const createOrcamento = async (req, res) => {
    try {
        const { usuarioId, categoriaId, valor, dataInicio, dataFim } = req.body;
        const orcamento = await prisma.orcamento.create({
            data: {
                usuarioId,
                categoriaId,
                valor,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim)
            }
        });
        return res.status(201).json(orcamento);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Função para leitura de orçamento
const readOrcamento = async (req, res) => {
    if (req.params.id) {
        const orcamento = await prisma.orcamento.findUnique({
            where: { id: parseInt(req.params.id, 10) }
        });
        return res.json(orcamento);
    } else {
        const orcamentos = await prisma.orcamento.findMany();
        return res.json(orcamentos);
    }
};

// Função de atualização de orçamento
const updateOrcamento = async (req, res) => {
    const { id } = req.params;
    try {
        const { usuarioId, categoriaId, valor, dataInicio, dataFim } = req.body;
        const orcamento = await prisma.orcamento.update({
            where: { id: parseInt(id, 10) },
            data: {
                usuarioId,
                categoriaId,
                valor,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim)
            }
        });
        return res.status(202).json(orcamento);
    } catch (error) {
        return res.status(404).json({ message: "Orçamento não encontrado" });
    }
};

// Função de exclusão de orçamento
const deleteOrcamento = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.orcamento.delete({
            where: { id: parseInt(id, 10) }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ message: "Orçamento não encontrado" });
    }
};

module.exports = {
    createOrcamento,
    readOrcamento,
    updateOrcamento,
    deleteOrcamento
};
