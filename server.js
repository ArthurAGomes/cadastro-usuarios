// import { json } from "body-parser"
import express from "express"
// importando biblioteca prisma com banco de dados 
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

app.post('/usuarios', async (req, res) => {
    // enviando para banco de dados 
    // await fala que o javascript deve esperar receber as informaçoes
    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body)
})

app.get('/usuarios', async (req, res) => {
    let users=[]
    if(req.query){
        // filtro de usuarios 
        users= await prisma.user.findMany({
            where:{
                name: req.query.name,
                email:req.query.email,
                age:age.query.age

            }
        })
    } else{
        const users = await prisma.user.findMany()
    }

    res.status(200).json(users)
})

app.put('/usuarios/:id', async (req, res) => {
    // alterando para banco de dados 
    await prisma.user.update({
        where: {
            // informaçoes que vai dar acesso a editar
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body)
})

// excluindo um usuario
app.delete('/usuarios/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id:(req.params.id) 
        },
    })

    res.status(200).json({ message: 'Usuário deletado com sucesso!' })
})

app.listen(3000)

// Criar API de usuarios

// -criar  um usuario
// -listar todos usuarios
// -editar os usuarios
// -deletar usuarios
