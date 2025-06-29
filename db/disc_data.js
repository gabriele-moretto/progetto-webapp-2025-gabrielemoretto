const Database = require('better-sqlite3')
const db = new Database('../backend/discs.db')

//Prendo un numero random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getAllDiscs() {
  const select = db.prepare('SELECT * FROM albums');
  return select.all(); // restituisce un array di oggetti
}

function getDiscFromId(id) {
  const select = db.prepare('SELECT * FROM albums WHERE id = ?').get(id);
  if(!select)
    return null

  return select; // restituisce un singolo oggetto o undefined
}

function getTopNDiscs(N) {
  const select = db.prepare('SELECT * FROM albums WHERE id = ?')
  const lenght = db_lenght(db)

  if(lenght < N)
    return null
  
  let max = 0, index = 0, current_idx = 0
  let discs = []
  while(index < N) {
    current_idx = 0
    max = 0
    for(let i = 1; i <= lenght; i++) {
      const stats = select.get(i).stats
      const isPresent = discs.some(item => item.id === i);
      if(max < select.get(i).stats & !isPresent) {
        max = select.get(i).stats
        current_idx = i
      }
    }
    discs.push(getDiscFromId(current_idx))
    index++
  }

  return discs
}

function getRandNDiscs(N, NTop) {
  const lenght = db_lenght(db)

  N = parseInt(N)
  NTop = parseInt(NTop)
  if(lenght < (N + NTop))
    return null

  topDiscs = getTopNDiscs(NTop)
  topArray = []
  for(let i = 0; i < NTop; i++) {
    topArray[i] = topDiscs[i].id
  }

  let arrayRand = []
  let num = 0, len = 0
  while(len <= N) {
    num = getRandomInt(lenght - 1) + 1
    if((arrayRand.includes(num) == false) && (topArray.includes(num) == false)) {
      arrayRand.push(num);
    }
    len = arrayRand.length
  }
  
  let index = 0
  let discs = []
  while(index < N) {
    discs.push(getDiscFromId(arrayRand[index]))
    index++
  }

  return discs
}

//Funzione che conta il numero di dischi nel database
function db_lenght(db) {
  return db.prepare("SELECT COUNT(*) as count FROM albums").get().count
}

module.exports = { getAllDiscs, getDiscFromId, getTopNDiscs, getRandNDiscs }