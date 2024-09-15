const axios = require('axios');
const ScoreClient = require('./ScoreClient');

class APIClient extends ScoreClient {
    async getScore(cpf) { 
        try {
            const response = await axios.get(`https://score.hsborges.dev/api/score?cpf=${cpf}`);
            return response.data.score;
        } catch (error) {
            console.error('Erro ao buscar o score: ', error);
            throw error;
        }
    }
}

module.exports = APIClient;