import Fastify from "fastify";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
 
const db = new PrismaClient()

const pessoasSquema = z.object({
    Nome: z.string(),
    DataNasc: z.date(),
    Email: z.string(),
    Cpf: z.string(),
    Rua: z.string(),
    Numero: z.number(),
    Bairro: z.string(),
    Cidade: z.string(),
    Estado: z.string(),
    Cep: z.string(),
    Pais: z.string()
});

const app = Fastify({ logger: true });

app.get('/', async (request, reply) => {
    return { hello: "world" };
});

app.get('/pessoas',async (request,reply) => {
    const pessoas = await db.pessoas.findMany();
    return {pessoas};
})

app.post('/pessoas',async (request,reply) => {
    const body = request.body;

    const pessoasParsed = pessoasSquema.safeParse(body);

    if (!pessoasParsed.success) return;

    const pessoa = pessoasParsed.data;

    const datinha = await db.pessoas.create({
        data: pessoa as any
    });

    return datinha;
})

try {
    app.listen({ port: 3000 })
} catch (error) {
    app.log.error(error);
    process.exit(1)
}

