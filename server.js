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

// Mapeamento de cores para valores RGB
const coresRGB = {
    VERMELHO: { r: 255, g: 0, b: 0 },
    VERDE: { r: 0, g: 255, b: 0 },
    AZUL: { r: 0, g: 0, b: 255 },
    AMARELO: { r: 255, g: 255, b: 0 },
    CIANO: { r: 0, g: 255, b: 255 },
    LILAS: { r: 255, g: 0, b: 255 }
};

app.get('/comando', (req, res) => {
    res.json({ ...estado, cor_rgb: coresRGB[estado.cor] });
});

app.post('/update', (req, res) => {
    const novoEstado = req.body;
    estado = { ...estado, ...novoEstado };
    res.json({ mensagem: 'Estado atualizado', estado });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
