'use strict'

const uuid = require('uuid');
const { PeerRPCClient } = require('grenache-nodejs-http');
const Link = require('grenache-nodejs-link');
const logger = require('../common/logger');
const { Order, OrderAction, OrderStatus } = require('../common/order');
const { request } = require('../common/utils');

logger.info('Starting client...');

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start();

logger.info('Client linked to grape');

const peer = new PeerRPCClient(link, {})
peer.init();

logger.info('Peer initialized');

// Client's order book instance

let book = [];

// Here is to identify the client
const uid = uuid.v4();
logger.info(`New client [${uid}]`);

// First we get the order book from the server
request(peer, 'orderbook', { command: 'get' }, { timeout: 10000 })
  .then(data => {
    book = data.book;
    logger.info(`Order book init (${data.book.length} order(s))`)
  })
  // Build new order
  .then(() => {
    const order = new Order(uid, 100, 1, process.argv[2] || 'BUY');
    book.push(order);
    return order;
  })
  // Send the new order
  .then(order => request(peer, 'orderbook', { command: 'new', order }, { timeout: 10000 })
  .then(() => {
    logger.info(`Order (${order.action}, ${order.price}) sent`);
    logger.info(`Order book (${book.length} order(s))`);
  }))
  .then(() => setInterval(() => 
    logger.info(`Opened order: ${book.filter(b => b.uid === uid && b.status === OrderStatus.Opened).length}`), 3000)
  )
  .catch(err => logger.error(err));

/**
 * Generate order every 10 seconds
 * With a random price between 100 and 120
 */
// setInterval(() => {
//   const price = Math.floor(
//     Math.random() * (100 - 120) + 100
//   )
//   const action = Math.round(Math.random()) === 0 ? OrderAction.Buy : OrderAction.Sell;
//   const order = new Order(uid, price, 1, action);
//   book.push(order);
//   request(peer, 'orderbook', { command: 'new', order }, { timeout: 10000 })
//     .then(() => {
//       logger.info(`Order (${order.action}, ${order.price}) sent`);
//       logger.info(`Order book (${book.length} order(s))`);
//     })
//     .catch(err => logger.error(err));
// }, 10000);


/**
 * Poll every sec any updates from other clients
 * It should be through a stream
 * 
 * Push new order
 * Update existing order status
 */
let lastDate = Date.now();
setInterval(() => {
  request(peer, 'orderbook', { command: 'update', uid, date: lastDate }, { timeout: 10000 })
    .then(data => {
      const list = (data || []).filter(o => !book.find(b => o.oid === b.oid && o.status === b.status));
      if (list.length > 0) {
        logger.info(`Updates (${data.length} order(s))`);
        list.forEach(item => {
          const found = book.find(b => item.oid === b.oid);
          if (found) {
            found.status = item.status;
          } else {
            book.push(item);
          }
        });
        logger.info(`Order book (${book.length} order(s))`);
      }
    })
    .catch(err => logger.error(err));
  lastDate = Date.now();
}, 1000);
