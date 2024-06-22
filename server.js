import express from "express";
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Criar um novo usuário
app.post('/usuarios', async (req, res) => {
    try {
        const novoUsuario = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        });
        res.status(201).json(novoUsuario);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário', detalhes: error.message });
    }
});

// Listar todos os usuários ou filtrar usuários
app.get('/usuarios', async (req, res) => {
    try {
        let usuarios;
        if (Object.keys(req.query).length > 0) {
            usuarios = await prisma.user.findMany({
                where: {
                    ...(req.query.name && { name: req.query.name }),
                    ...(req.query.email && { email: req.query.email }),
                    ...(req.query.age && { age: parseInt(req.query.age) })
                }
            });
        } else {
            usuarios = await prisma.user.findMany();
        }
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários', detalhes: error.message });
    }
});

// Atualizar um usuário existente
app.put('/usuarios/:id', async (req, res) => {
    try {
        const usuarioAtualizado = await prisma.user.update({
            where: {
                id: req.params.id // id como String
            },
            data: {
                email: req.body.email,
                name: req.body.name,
                age: req.body.age
            }
        });
        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário', detalhes: error.message });
    }
});

// Excluir um usuário
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const id = req.params.id; // id como String

        // Verificar se o usuário existe antes de deletar
        const usuarioExistente = await prisma.user.findUnique({ where: { id } });

        if (!usuarioExistente) {
            console.warn(`Usuário com ID ${id} não encontrado para exclusão`);
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Tentar excluir o usuário
        const usuarioDeletado = await prisma.user.delete({
            where: {
                id: id
            }
        });

        console.log(`Usuário com ID ${id} deletado:`, usuarioDeletado);
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário', detalhes: error.message });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
