const DecoratorClient = require('./DecoratorClient');

class ControlledClient extends DecoratorClient {
    constructor(client) {
        super(client);
        this.lastRequestTime = 0;
        this.requestQueue = [];
        this.isRequesting = false;
    }

    async getScore(cpf) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ cpf, resolve, reject });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isRequesting || this.requestQueue.length === 0) return;

        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest >= 1000) {
            this.isRequesting = true;
            const { cpf, resolve, reject } = this.requestQueue.shift();
            try {
                const score = await this.client.getScore(cpf);
                this.lastRequestTime = Date.now();
                resolve(score);
            } catch (error) {
                reject(error);
            } finally {
                this.isRequesting = false;
                setTimeout(() => {
                    this.processQueue();
                }, 1000);
            }
        } else {
            setTimeout(() => {
                this.processQueue();
            }, 1000 - timeSinceLastRequest);
        }
    }
}

module.exports = ControlledClient;