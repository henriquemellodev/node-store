'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const authService = require('../services/authService');

router.post('/', controller.post);
router.get('/', authService.isAdmin, controller.get);
router.get('/admin/:id',controller.getById);
router.post('/auth', controller.authenticate);
router.post('/delete', controller.delete)
router.post('/refresh', authService.authorize, controller.refreshToken);

module.exports = router;