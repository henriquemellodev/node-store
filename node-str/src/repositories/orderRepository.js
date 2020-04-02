'use strict'

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.create = async (data) => {
    const order = new Order(data);
    await order.save();
}

exports.get = async () => {
    const res = await Order
        .find({}, 'number status customer items')
        .populate('customer', 'name')
        .populate('items.product', 'title');
    return res;
}

exports.getByOrderId = async (id) => {
    const res = await Order.findById(id)
    return res;
}

exports.getByOrderHistory = async (id) => {
    const res = await Order
        .find({
            customer: id
        }, 'number status customer items')
        .populate('customer', 'name')
        .populate('items.product', 'title');
    return res;
}

exports.delete = async (id) => {
    await Order.findOneAndRemove(id);
}