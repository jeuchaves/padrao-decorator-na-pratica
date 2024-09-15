const NodeCache = require('node-cache');
const DecoratorClient = require('./DecoratorClient');
const config = require('../config');

class CachedClient extends DecoratorClient {
    constructor(client, ttlSeconds) {
        super(client);
        this.cache = new NodeCache({ stdTTL: ttlSeconds || config.cacheTTL });
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