const APIClient = require('./clients/APIClient');
const CachedClient = require('./clients/CachedClient');
const ControlledClient = require('./clients/ControlledClient');

const cpfList = [
    '537.204.360-12',
    '567.270.030-68',
    '346.214.470-76',
    '912.289.810-78',
    '208.253.690-45',
];

async function main() {
    const apiClient = new APIClient();
    const controlledClient = new ControlledClient(apiClient);
    const cachedClient = new CachedClient(controlledClient);

    for (const cpf of cpfList) {
        try {
            const score = await cachedClient.getScore(cpf);
            console.log(`Score do CPF ${cpf}: ${score}`);
        } catch (error) {
            console.error(`Erro ao buscar score do CPF ${cpf}: ${error.message}`);
        }
    }
}

main();