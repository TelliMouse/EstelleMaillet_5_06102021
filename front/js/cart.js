/*récupérer les procduit dans localStorage
pour chaque produit récupérer les infos depuis l'API
pour chaque info, créer le bon truc sur la page */

const retrieveProduct = (id) => fetch(`http://localhost:3000/api/products/${id}`)
.then(res => res.json())
.catch(err => console.log('Erreur retrieveProduct', err));


const createProductCard = product => {

    const productCard = document.createElement("article");
    productCard.classList.add("cart__item");
    productCard.setAttribute("data-id", product._id);

    return productCard;
};


const createProductImg = product => {

    const imagePlace = document.createElement("div");
    imagePlace.classList.add("cart__item__img");

    const image = document.createElement("img");
    image.setAttribute("src", product.imageUrl);
    image.setAttribute("alt", product.altTxt)

    imagePlace.appendChild(image);

    return imagePlace;
};


const createItemContent = () => {

    const itemContent = document.createElement("div");
    itemContent.classList.add("cart__item__content");

    return itemContent;
};


const createProductTitlePrice = product => {

    const titlePricePlace = document.createElement("div");
    titlePricePlace.classList.add("cart__item__content__titlePrice");

    const title = document.createElement("h2");
    title.innerText = product.name;

    const price = document.createElement("p");
    price.innerText = `${product.price} €`;

    titlePricePlace.appendChild(title);
    titlePricePlace.appendChild(price);

    return titlePricePlace;
};


const createContentSettings = () => {

    const contentSettings = document.createElement("div");
    contentSettings.classList.add("cart__item__content__settings");

    return contentSettings;
};


/* const retrieveQuantityFromId = rank => {

    for(let i=0; i<localStorage.length; i++) {

        const productRank = i + 1;
        const product = JSON.parse(localStorage.getItem(`Product${productRank}`));
        const productId = product.id;

        if(productId == id) {

            return product.quantity;
        };
    };
}; */


const createContentSettingsQuantity = rank => {

    const contentSettingsQuantity = document.createElement("div");
    contentSettingsQuantity.classList.add("cart__item__content__settings__quantity");

    const quantity = document.createElement("p");
    quantity.innerText = "Qté : ";

    const quantityInput = document.createElement("input");
    quantityInput.setAttribute("type", "number");
    quantityInput.classList.add("itemQuantity");
    quantityInput.setAttribute("name", "itemQuantity");
    quantityInput.setAttribute("min", "1");
    quantityInput.setAttribute("max", "100");

    const productStorage = JSON.parse(localStorage.getItem(`Product${rank}`))
    const productQuantity = productStorage.quantity;

    quantityInput.setAttribute("value", `${productQuantity}`);

    contentSettingsQuantity.appendChild(quantity);
    contentSettingsQuantity.appendChild(quantityInput);

    return contentSettingsQuantity;
};


const createContentSettingsDelete = () => {

    const contentSettingsDelete = document.createElement("div");
    contentSettingsDelete.classList.add("cart__item__content__settings__delete");

    const deleteItem = document.createElement("p");
    deleteItem.classList.add("deleteItem");
    deleteItem.innerText = "Supprimer";

    contentSettingsDelete.appendChild(deleteItem);

    return contentSettingsDelete;
};


const createProductInfo = (product, rank) => {

    const cartItemPlace = document.getElementById("cart__items");
    const productCard = createProductCard(product);
    const productImage = createProductImg(product);
    const itemContent = createItemContent();
    const titlePrice = createProductTitlePrice(product);
    const contentSettings = createContentSettings();
    const contentSettingsQuantity = createContentSettingsQuantity(rank);
    const contentSettingsDelete = createContentSettingsDelete();

    cartItemPlace.appendChild(productCard);
    productCard.appendChild(productImage);
    productCard.appendChild(itemContent);
    itemContent.appendChild(titlePrice);
    itemContent.appendChild(contentSettings);
    contentSettings.appendChild(contentSettingsQuantity);
    contentSettingsQuantity.appendChild(contentSettingsDelete);
};


const main = async () => {

    for(let i=0; i < localStorage.length; i++) {

        const productRank = i + 1;
        const productStorage = JSON.parse(localStorage.getItem(`Product${productRank}`));
        const product = await retrieveProduct(productStorage.id);

        createProductInfo(product, productRank);
    } 
};

main();