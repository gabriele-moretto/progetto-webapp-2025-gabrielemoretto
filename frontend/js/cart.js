async function getDisc(id) {
    try {
        const res = await fetch(`/disc/${id}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function load_items() {
   res = await fetch('/cart/items')
   res = await res.json()

   const itemList = document.getElementById("container");
   itemList.innerHTML = ""

   const length = res.length
   for (let i = 0; i < length; i++) {
      item = await getDisc(res[i].id_disc)

      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="disk">
            <div class="image-div">
                <img src="${item.cover_url}" alt="">
            </div>
            <div class="text-div">
                <p class="title">${item.title}</p>
                <p class="artist">${item.artist}</p>
            </div>
            <div class="button-div">
                <button class="btn_minus" name="${item.id}" onclick="minusItem(name)">-</button>
                <div>
                    <p>${res[i].quantity}</p>
                    <button class="btn_delete" name="${item.id}" onclick="deleteItem(name)">🗑️</button>
                </div>
                <button class="btn_plus" name="${item.id}" onclick="plusItem(name)">+</button>
            </div>
        </div>
        ${max_lenght(i, length)}
        `
      itemList.appendChild(div)
   }

   if (length == 0) {
        const button = document.getElementById('proceed');
        button.style.display = 'none';

        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `<p class="void_cart">Empty cart!</p>`
        itemList.appendChild(div)
   } else {
        const button = document.getElementById('proceed');
        button.style.display = 'block';
   }
}

async function plusItem(id) {
    addToCart(id, 1)
    load_items()
}

async function minusItem(id) {
    addToCart(id, -1)
    load_items()
}

async function deleteItem(id) {
    removeFromCart(id)
    load_items()
}

function max_lenght(index, max) {
    if(index < max - 1) {
        return "<hr>"
    }
    return ""
}

//Funzione che aggiunge al carrello un disco
async function addNewToCart(id) {
    try {
        const res = await fetch(`/cart/data?id=${id}&quantity=${quantity}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify({
                id: id,
                quantity: quantity})
        })
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

//Funzione che aggiunge al carrello N dischi (o li toglie)
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
        console.error(err);
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
        console.error(err);
        return null;
    }
}