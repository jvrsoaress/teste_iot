const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Substitua pelo IP do Pico W na sua rede
const PICO_IP = 'http://192.168.x.x'; // Atualize com o IP real do Pico W

app.use(express.json());
app.use(cors()); // Habilita CORS para todas as origens

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

app.post('/update', async (req, res) => {
    const novoEstado = req.body;
    estado = { ...estado, ...novoEstado };

    try {
        // Envia comando ao Pico W
        await axios.post(`${PICO_IP}/update`, novoEstado);
        res.json({ mensagem: 'Estado atualizado', estado });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao comunicar com o Pico W', erro: error.message });
    }
});

// Função para atualizar temperatura periodicamente
async function atualizarTemperatura() {
    try {
        const response = await axios.get(`${PICO_IP}/status`);
        estado.temperatura = response.data.temperatura;
    } catch (error) {
        console.error('Erro ao atualizar temperatura:', error.message);
    }
}

setInterval(atualizarTemperatura, 5000); // Atualiza a cada 5 segundos

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
