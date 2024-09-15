const NodeCache = require('node-cache');
const DecoratorClient = require('./DecoratorClient');

class CachedClient extends DecoratorClient {
    constructor(client, ttlSeconds = 60) {
        super(client);
        this.cache = new NodeCache({ stdTTL: ttlSeconds });
    }

    getScore(cpf) {
        const cachedScore = this.cache.get(cpf);

        if (cachedScore) {
            console.log('Score encontrado no cache');
            return Promise.resolve(cachedScore);
        }

        return this.client.getScore(cpf).then((score) => {
            this.cache.set(cpf, score);
            return score;
        });
    }
}

module.exports = CachedClient;