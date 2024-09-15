const request = require('supertest');
const config = require('../src/config');

const apiUrl = config.apiBaseUrl;

describe('Teste da API de Score', () => {

    // Teste para verificar o retorno de um CPF válido
    it('Deve retornar o score calculado para um CPF válido', async () => {
        const cpfValido = '443.997.600-01';  // CPF válido para teste (simulado)

        const response = await request(apiUrl)
            .get('/')
            .query({ cpf: cpfValido });

        expect(response.status).toBe(200);  // Verifica se o status é 200
        expect(response.body).toHaveProperty('cpf');  // Verifica se a resposta tem a propriedade 'cpf'
        expect(response.body).toHaveProperty('score');  // Verifica se a resposta tem a propriedade 'score'
        expect(response.body.score).toBeGreaterThanOrEqual(0);  // Verifica se o score é maior ou igual a 0
        expect(response.body.score).toBeLessThanOrEqual(1000);  // Verifica se o score é menor ou igual a 1000
    });

    // Teste para verificar o retorno de um CPF inválido
    it('Deve retornar erro 429 para CPF inválido ou não fornecido', async () => {
        const cpfInvalido = '111';  // CPF inválido para teste

        const response = await request(apiUrl)
            .get('/')
            .query({ cpf: cpfInvalido });
        
        expect(response.status).toBe(429);  // Verifica se o status é 400
    });

    // Teste para verificar o erro de limite de requisições (código 429)
    it('Deve retornar erro 429 quando o limite de requisições for excedido', async () => {
        const cpfValido = '356.707.740-60';  // CPF válido para teste

        // Simular requisições sucessivas para exceder o limite de 1 req/s
        await request(apiUrl)
            .get('/')
            .query({ cpf: cpfValido });
        
        const response = await request(apiUrl)
            .get('/')
            .query({ cpf: cpfValido });

        expect(response.status).toBe(429);  // Verifica se o status é 429
    });
})