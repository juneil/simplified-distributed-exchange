const uuid = require('uuid');

const OrderAction = {
    Buy: 'BUY',
    Sell: 'SELL'
}
exports.OrderAction = OrderAction;

const OrderStatus = {
    Opened: 'OPENED',
    Closed: 'CLOSED'
}
exports.OrderStatus = OrderStatus;

exports.Order = class Order {
    constructor(uid, price, quantity, action) {
        this.oid = uuid.v4();
        this.uid = uid;
        this.price = Number(price);
        this.quantity = Number(quantity) || 1;
        this.action = action;
        this.date = Date.now();
        this.status = OrderStatus.Opened;
        this.validate();
    }

    validate() {
        if(!this.uid) {
            throw new Error('Cannot instantiate an Order without uid');
        }
        if(!this.price) {
            throw new Error('Cannot instantiate an Order without price');
        }
        if(!Object.values(OrderAction).includes(this.action)) {
            throw new Error('Cannot instantiate an Order with invalid action');
        }
    }
}

exports.newOrder = function newOrder(uid, price, quantity, action) {
    return new Order(uid, price, quantity, action);
}
