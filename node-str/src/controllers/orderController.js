'use strict'

const repository = require('../repositories/orderRepository');
const repositoryProduct = require('../repositories/productRepository');
const guid = require('guid');
const emailService = require('../services/emailService');
const authService = require('../services/authService');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição! '
        });
    }
};

exports.post = async (req, res, next) => {

    //Gerar numero do pedido
    let number = guid.raw().substring(0, 6);

    // Variaveis de controle
    let productId = [];
    let dataProductId = [];
    let titleProduct = [];
    let totalPrice = 0;
    let i;

    try {

        // Decoficar o token Antes
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        console.log(data);

        await repository.create({
            customer: data.id,
            number: number,
            items: req.body.items
        });

        let product = req.body.items;
        i = 0; 
        product.forEach(element => {
            productId[i] = element.product;
            totalPrice = totalPrice + Number(element.price)
            i++;
        });

        // Chamada ProdutoNome Retornando Id´s e Titulo
        for (i = 0; i < productId.length; i++) {
            dataProductId[i] = await repositoryProduct.getByProductName(productId[i]);
        }

        // Armarzenar Nome Produto
        i = 0;
        dataProductId.forEach(element => {
            titleProduct[i] = element.title;
            i++;
        });

        // Formatar em Valor Monetário 
        var totalPriceBR = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        //Email de Compra Cliente
        emailService.send(
           data.email, 
           'Node Store Pedido n°' + number, 
           'Olá ' + data.name + ' seu pedido nº ' + number + ', com os produtos:\n\n'
           + titleProduct + '\n' + 'Foi realizado com sucesso!\n' + 'Valor Total: ' + totalPriceBR + '\n' +
           'Agradecemos a sua preferência, volte sempre!\n' +
           'Node Store - Loja Online\n'
           + 'acesse: www.nodestoreloja.com.br\n'
       );   

        res.status(201).send({ message: 'Pedido cadastrado com sucesso! ' });

    } catch (e) {

        console.log(e);

        res.status(500).send({
            message: 'Falha ao processar sua requisição!'
        });
    }
}

exports.getByOrderId = async (req, res, next) => {
    try {
        var data = await repository.getByOrderId(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição! '
        });
    }
}

exports.getByOrderHistory = async (req, res, next) => {
    try {

        // Decoficar o token Antes
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
        
        var dataCostumer = await repository.getByOrderHistory(data.id);
        res.status(200).send(dataCostumer);
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição! '
        });
    }
}

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id);
        res.status(201).send({ message: 'Pedido removido com sucesso! ' });
    } catch (e) {
        res.status(400).send({
            message: 'Falha ao processar sua requisição!'
        });
    }
};


