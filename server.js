const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let estado = {
    led: 'DESLIGADO',
    comodo: 'QUARTO_1',
    cor: 'VERMELHO',
    temperatura: 25.0,
    emergencia: 'DESLIGADA'
};

app.get('/comando', (req, res) => {
    res.json(estado);
});

app.post('/update', (req, res) => {
    const novoEstado = req.body;
    estado = { ...estado, ...novoEstado };
    res.json({ mensagem: 'Estado atualizado' });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
