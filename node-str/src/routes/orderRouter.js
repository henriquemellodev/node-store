'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const authService = require('../services/authService');

router.post('/', authService.authorize, controller.post);
router.get('/', authService.authorize, controller.get);
router.get('/admin/:id',controller.getByOrderId);
router.get('/history',controller.getByOrderHistory);
router.post('/:id', authService.isAdmin,controller.delete)

module.exports = router;