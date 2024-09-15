const axios = require('axios');
const ScoreClient = require('./ScoreClient');
const config = require('../config');

class APIClient extends ScoreClient {
    constructor(baseUrl) {
        super();
        this.baseUrl = baseUrl || config.apiBaseUrl;
    }
    async getScore(cpf) { 
        try {
            const response = await axios.get(`${this.baseUrl}?cpf=${cpf}`);
            return response.data.score;
        } catch (error) {
            console.error('Erro ao buscar o score: ', error);
            throw error;
        }
    }
}

module.exports = APIClient;