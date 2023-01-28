'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const logger = require('../common/logger');
const OrderBookService = require('./order_book');

logger.info('Starting server...');

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start();

logger.info('Server linked to grape');

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init();

logger.info('Peer initialized');

new OrderBookService().run(peer);
