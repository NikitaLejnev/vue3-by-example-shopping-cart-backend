const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors')
const shopItemResolvers = require('./resolvers/shopItems')
const orderResolvers = require('./resolvers/orders')
const authResolvers = require('./resolvers/auth')
const jwt = require('jsonwebtoken');

const schema = buildSchema(`
  type Response {
    status: String
  }

  type Token {
    token: String
  }

  input User {
    username: String
    password: String
    token: String
  }

  input ShopItem {
    shop_item_id: Int
    name: String
    description: String
    image_url: String
    price: Float
  }

  type ShopItemOutput {
    shop_item_id: Int
    name: String
    description: String
    image_url: String
    price: Float
  }

  type OrderOutput {
    order_id: Int
    name: String
    address: String
    phone: String
    ordered_items: [ShopItemOutput]
  }

  input Order {
    order_id: Int
    name: String
    address: String
    phone: String
    ordered_items: [ShopItem]
  }

  type Query {
    getShopItems: [ShopItemOutput],
    getOrders: [OrderOutput]
  }

  type Mutation {
    addShopItem(shopItem: ShopItem): Response
    removeShopItem(shopItemId: Int): Response
    addOrder(order: Order): Response
    removeOrder(orderId: Int): Response
    login(user: User): Token
  }
`);
