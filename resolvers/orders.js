const sqlite3 = require('sqlite3').verbose();

module.exports = {
  getOrders: () => {
    const db = new sqlite3.Database('./db.sqlite');
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`
          SELECT *,
            orders.name AS purchaser_name,
            shop_items.name AS shop_item_name
          FROM orders
          INNER JOIN order_shop_items ON orders.order_id = order_shop_items.order_id
          INNER JOIN shop_items ON order_shop_items.shop_item_id = shop_items.shop_item_id
        `, [], (err, rows = []) => {
          if (err) {
            reject(err)
          }
          const orders = {}
          for (const row of rows) {
            const {
              order_id,
              purchaser_name: name,
              address,
              phone
            } = row
            orders[order_id] = {
              order_id,
              name,
              address,
              phone
            }
          }
          const orderArr = Object.values(orders)
          for (const order of orderArr) {
            order.ordered_items = rows
              .filter(({ order_id }) => order_id === order.order_id)
              .map(({ shop_item_id, shop_item_name: name, price, description }) => ({
                shop_item_id, name, price, description
              }))
          }
          resolve(orderArr)
        });
      })
      db.close();
    })
  },
}
