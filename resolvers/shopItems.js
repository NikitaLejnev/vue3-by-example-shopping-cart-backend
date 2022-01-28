const sqlite3 = require('sqlite3').verbose();

module.exports = {
  addShopItem: ({ shopItem: { name, description, image_url: imageUrl, price } }) => {
    const db = new sqlite3.Database('./db.sqlite');
    return new Promise((resolve) => {
      db.serialize(() => {
        const stmt = db.prepare(`
          INSERT INTO shop_items (
            name,
            description,
            image_url,
            price
          ) VALUES (?, ?, ?, ?)
        `
        );
        stmt.run(name, description, imageUrl, price)
        stmt.finalize();
        resolve({ status: 'success' })
      })
      db.close();
    })
  },
}