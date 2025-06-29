const Database = require('better-sqlite3')
const db = new Database('../backend/discs.db')

//Creo la tabella se non esiste
db.exec(`
  CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY,
    title TEXT,
    artist TEXT,
    release_date TEXT,
    cover_url TEXT,
    stats INTEGER
  )
`)

const DISCOGS_API = 'https://api.discogs.com'
const TOKEN = 'TScZzLffyyRAmLnPXfefZiDZVKatrfXGdxpeAzjc'
const HEADERS = { 'User-Agent': 'AppWeb/1.0', 'Authorization': `Discogs token=${TOKEN}` }

//Funzione per cercare dischi
async function fetchDiscs(page) {
  const res = await fetch(`${DISCOGS_API}/database/search?genre=hip-hop&type=release&sort=have&page=${page}`, { headers: HEADERS })
  return await res.json()
}

//Funzione per estrarre le informazioni che mi servono da un disco
async function discDetailsFromId(id) {
  let res = await fetch(`${DISCOGS_API}/releases/${id}`, { headers: HEADERS });
  if (!res.ok) return null;
  const data = await res.json();

  res = await fetch(`${DISCOGS_API}/releases/${id}/rating`, { headers: HEADERS })
  res = await res.json()

  if(!data || !res.rating)
    return

  return {
    title: data.title,
    artist: data.artists?.map(a => a.name).join(', ') || 'Sconosciuto',
    release_date: data.released || null,
    cover_url: data.images?.[0]?.uri || null,
    stats: res.rating.average || null,
  }
}

//Salvo nel database
function saveDisc(disc) {
  exists = alreadyIn(disc.title, disc.artist)

  if (!exists) {
    const select = db.prepare(`
      INSERT INTO albums (title, artist, release_date, cover_url, stats)
      VALUES (?, ?, ?, ?, ?)
    `);
    select.run(disc.title, disc.artist, disc.release_date, disc.cover_url, disc.stats)
    console.log(`✔ Inserito: ${disc.title}`)
  } else {
    console.log(`⏭ Già presente: ${disc.title}`)
  }
}


//Verifica se il disco è già caricato
function alreadyIn(title, artist) {
  const exists = db.prepare(`
    SELECT 1 FROM albums WHERE title = ? AND artist = ?
  `).get(title, artist);

  if(!exists)
    return false;
  else 
    return true;
}


//Carica i dischi dal server
async function load_disc(disc_limit, init_page) {
  console.log(`discLimit = ${disc_limit}, init_page = ${init_page}`)

  let addedDisc = 0
  let page = init_page;
  while (addedDisc < disc_limit) {
    let discs = await fetchDiscs(page) //Scarico la pagina di dischi
    discs = discs.results
    page++

    if(!discs) {
      return;
    }

    for (item of discs) {
      if (!item || !item.id) {
        console.warn('Elemento malformato, salto...');
        continue;
      }

      const details = await discDetailsFromId(item.id);
      if (details) {
        console.log(`Salvo: ${details.title} - ${details.artist}`);
        addedDisc++
        saveDisc(details);
      }
    }
  }

  console.log('Importazione completata.');
}

module.exports = { load_disc }