//Funzione che richiede l'id di un disco
async function getDisc(id) {
    try {
        const res = await fetch(`/disc/${id}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function init_disc_id() {
   const params = new URLSearchParams(window.location.search);
   const id = params.get('id');

   if (!id) {
    console.error('ID mancante nell\'URL');
    return;
  }

   res = await getDisc(id)

   document.querySelector(`#cover`).src = res.cover_url
   document.querySelector(`#artist`).innerText = res.artist
   document.querySelector(`#title`).innerText = res.title
   document.querySelector(`#add_to_cart`).name = res.id
}