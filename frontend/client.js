//Funzione di inizializzazione della pagina
async function init() {
    let topN = 7
    res = await fetch(`/disc/top/${topN}`)
    res = await res.json()
    
    for(let i = 0; i < topN; i++) {
        document.querySelector(`#top-cover-${i+1}`).src = res[i].cover_url
        document.querySelector(`#top-ref-${i+1}`).href = `./pages/disc.html?id=${res[i].id}`

        if (i == 0) {
            document.querySelector(`#top-artist-${i+1}`).innerHTML = "<strong> Artist: </strong>" + res[i].artist
            document.querySelector(`#top-title-${i+1}`).innerHTML = "<strong> Title: </strong>" + res[i].title
        } else {
            document.querySelector(`#top-artist-${i+1}`).innerText = res[i].artist
            document.querySelector(`#top-title-${i+1}`).innerText = res[i].title
            document.querySelector(`#button-${i+1}`).name = res[i].id
        }
    }

    let randN = 6
    res = await fetch(`/disc/rand/data?N=${randN}&NTop=${topN}`)
    res = await res.json()
    
    for(let i = 0; i < randN; i++) {
        document.querySelector(`#rand-cover-${i+1}`).src = res[i].cover_url
        document.querySelector(`#rand-ref-${i+1}`).href = `./pages/disc.html?id=${res[i].id}` 
        document.querySelector(`#rand-artist-${i+1}`).innerText = res[i].artist
        document.querySelector(`#rand-title-${i+1}`).innerText = res[i].title
        document.querySelector(`#button-rand-${i+1}`).name = res[i].id
    }
}

//Funzione che richiede l'id di un disco
async function getDisc(id) {
    try {
        const res = await fetch(`/disc/${id}`);
        return await res.json();
    } catch (err) {
        console.error("Errore nella richiesta del disco");
        return null;
    }
}

//Funzione che aggiunge al carrello un disco
async function addNewToCart(id) {
    try {
        const res = await fetch(`/cart/item/${id}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: id})
        })
        return await res.json();
    } catch (err) {
        console.error("Errore nell'aggiunta del nuovo elemento al carrello");
        return null;
    }
}

//Funzione che aggiunge al carrello un disco
async function addToCart(id, quantity) {
    try {
        const res = await fetch(`/cart/data?id=${id}&quantity=${quantity}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify({
                id: id,
                quantity: quantity})
        })
        return await res.json();
    } catch (err) {
        console.error("Errore nell'aggiunta dell'elemento al carrello");
        return null;
    }
}

//Funzione che rimuove dal carrello un disco
async function removeFromCart(id) {
    try {
        const res = await fetch(`/cart/${id}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify({
                id: id})
        })
        return await res.json();
    } catch (err) {
        console.error("Errore nella rimozione dell'elemento");
        return null;
    }
}