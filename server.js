const express = require('express');
     const axios = require('axios');
     const cors = require('cors');
     const app = express();
     const port = process.env.PORT || 3000;

     // URL do Pico W (substituir pelo URL do ngrok)
     const PICO_IP = 'http://your-ngrok-url.ngrok.io';

     app.use(express.json());
     app.use(cors());

     let estado = {
         led: 'DESLIGADO',
         comodo: 'QUARTO_1',
         cor: 'VERMELHO',
         temperatura: 25.0,
         emergencia: 'DESLIGADA'
     };

     app.get('/status', async (req, res) => {
         try {
             const response = await axios.get(`${PICO_IP}/status`);
             estado = { ...estado, ...response.data };
             res.json(estado);
         } catch (error) {
             res.status(500).json({ mensagem: 'Erro ao consultar Pico W', erro: error.message });
         }
     });

     app.post('/update', async (req, res) => {
         const novoEstado = req.body;
         estado = { ...estado, ...novoEstado };

         try {
             await axios.post(`${PICO_IP}/update`, novoEstado);
             res.json({ mensagem: 'Estado atualizado', estado });
         } catch (error) {
             res.status(500).json({ mensagem: 'Erro ao comunicar com Pico W', erro: error.message });
         }
     });

     async function atualizarTemperatura() {
         try {
             const response = await axios.get(`${PICO_IP}/status`);
             estado.temperatura = response.data.temperatura;
         } catch (error) {
             console.error('Erro ao atualizar temperatura:', error.message);
         }
     }

     setInterval(atualizarTemperatura, 5000);

     app.listen(port, () => {
         console.log(`Servidor rodando na porta ${port}`);
     });
