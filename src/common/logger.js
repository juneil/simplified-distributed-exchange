const pino = require('pino');
module.exports = pino({
    transport: {
        // only use in dev
      target: 'pino-pretty'
    },
});
