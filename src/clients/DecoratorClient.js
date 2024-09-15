const ScoreClient = require('./ScoreClient');

class DecoratorClient extends ScoreClient {
    constructor(client) {
        super();
        this.client = client;
    }

    getScore(cpf) {
        return this.client.getScore(cpf);
    }
}

module.exports = DecoratorClient;