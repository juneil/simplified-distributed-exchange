const logger = require('../common/logger');

module.exports = class BaseService {
    constructor() {
        if (this.constructor == BaseService) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
    }

    run(peer) {
        if (!this.name) {
            throw new Error('Service must have a name');
        }
        logger.info(`Service ${this.name} is running...`);
        // const port = 1024 + Math.floor(Math.random() * 1000);
        const port = 1926;
        const service = peer.transport('server');
        service.listen(port);
        this.service = service;
        logger.info(`Service ${this.name} is listening on port ${port}`);
        service.on('request', (rid, key, payload, handler) => 
            handler.reply(null, this.onRequest(payload)));
        setInterval(() => peer.link.announce(this.name, service.port, {}), 1000);
    }

    onRequest(_payload) {
        throw new Error("Method 'onRequest()' must be implemented.");
    }
}
