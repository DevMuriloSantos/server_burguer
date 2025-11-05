import express, { request, response } from 'express';
import { v4 as uuid } from 'uuid';
import cors from 'cors';

const app = express();
app.use(express.json());
const port = 3000

app.use(cors());

//app.use(cors(express({ origin: 'http://localhost:5173' }))); => permite a entrada apenas da home


const clientes = [];

const checkCliente = (request, response, next) => {
    const { id } = request.params;

    const index = clientes.findIndex(cliente => cliente.id == id);

    if (index < 0) {
        return response.status(404).json({ message: 'Cliente não encontrado' });
    }
    request.clienteIndex = index; // se cliente existe, exporta o indice e o id
    request.clienteId = id;

    return next();
}

app.get('/pedidos', (request, response) => {
    return response.json(clientes);
})

app.get('/health', (request, response) => {
    return response.json({ status: 'ok' });
})

app.post('/pedidos', (request, response) => {
    try {
        const { pedido, nome } = request.body

        const newCliente = {
            id: uuid(), // gera um id unico
            pedido,
            nome
        }


        clientes.push(newCliente);
        return response.status(201).json(newCliente);
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
})

app.delete('/pedidos/:id', checkCliente, (request, response) => {
    clientes.splice(request.clienteIndex, 1); // splice remove um item do array
    return response.sendStatus(204);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})