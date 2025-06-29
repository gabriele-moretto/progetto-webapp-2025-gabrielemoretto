const Database = require('better-sqlite3')
const cart = new Database('cart.db')

cart.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    id_disc INTEGER UNIQUE,
    quantity INTEGER
  )
`)

const { getAllDiscs, getDiscFromId, getTopNDiscs } = require('../db/disc_data.js')

//PUT /disc/id
async function putDisc(id, quantity) {
  let disc = await getDiscFromId(id)
  
  if(!disc) {
    return null
  }

  cart.prepare(`
    INSERT INTO items (id_disc, quantity) VALUES (?, ?)
    ON CONFLICT(id_disc) DO UPDATE 
    SET quantity = quantity + ?;
    `).run(id, quantity, quantity)

  let select = cart.prepare(`SELECT * FROM items WHERE id_disc = ?`).get(id)
  if(select.quantity <= 0) {
    deleteDisc(id)
  }
  
}

//DELETE /disc/id
function deleteDisc(id) {
  const select = cart.prepare('SELECT * FROM items WHERE id_disc = ?').get(id);
  
  if(!select) {
    return null
  }

  cart.prepare('DELETE from items WHERE id_disc = ?').run(id)
}

function getAllItems() {
  const select = cart.prepare('SELECT * FROM items').all()

  if(!select) {
    return null
  }

  return select
}

module.exports = { putDisc, deleteDisc, getAllItems }