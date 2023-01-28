const { Order, OrderStatus, OrderAction } = require("../common/order");
const logger = require('../common/logger');
const BaseService = require("./base");

module.exports = class OrderBookService extends BaseService {
    name = 'orderbook';

    constructor() {
        super();
        this.book = [];
    }

    newOrder(order) {
        if (!order instanceof Order) {
            throw new Error('Wrong object');
        }
        this.book.push(order);
        logger.info(`New order (${order.oid})`, order);
        this.orderMatchingEngine(order);
    }

    getUpdated(date) {
        return this.book
            .filter(order => order.date > date);
    }

    orderMatchingEngine(order) {
        // Get the opposite action
        const action = order.action === OrderAction.Buy ? OrderAction.Sell : OrderAction.Buy;
        // Filter the matching orders
        const matches = this.book
            .filter(o => o.uid !== order.uid)  
            .filter(o => o.status === OrderStatus.Opened)
            .filter(o => o.action === action)
            .filter(o => o.action === OrderAction.Buy ? o.price <= order.price : o.price >= order.price)
            .sort((a, b) => a.price - b.price);
      
        logger.info(`Engine matching ${matches.length} orders`);

        const matchedOrder = matches.shift();
        if (matchedOrder) {
            this.closeOrder(order.oid);
            this.closeOrder(matchedOrder.oid);
        }
    }

    closeOrder(oid) {
        const order = this.book.find(order => order.oid === oid && order.status === OrderStatus.Opened);
        if (order) {
            order.status = OrderStatus.Closed;
            order.date = Date.now();
            logger.info(`Order ${oid} is closed`);
        }
    }

    onRequest(payload) {
        switch (payload.command) {
            case 'get':
                return { book: this.book };
            case 'new':
                return this.newOrder(payload.order);
            case 'update':
                return this.getUpdated(payload.date);
            default:
                throw new Error(`Command ${payload.command} unrecognized`);
        }
    }
}
