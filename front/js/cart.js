const retrieveProductListApi = () => fetch("http://localhost:3000/api/products")
.then(res => res.json())
.catch(err => console.log("Erreur retrieveProductListApi", err));


const retrieveProductApi = id => fetch(`http://localhost:3000/api/products/${id}`)
.then(res => res.json())
.catch(err => console.log('Erreur retrieveProductApi', err));


const retrieveProductStorage = rank => {

    return JSON.parse(localStorage.getItem(`Product${rank}`));
};


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

    const productStorage = retrieveProductStorage(rank);
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


const calculateTotalQuantity = () => {

    let totalQuantity = 0;

    for(let i = 0; i < localStorage.length; i++) {

        const rank = i + 1;
        const productStorage = retrieveProductStorage(rank);

        totalQuantity += parseInt(productStorage.quantity, 10);
    };

    return totalQuantity;
};


const displayTotalQuantity = () => {

    const totalQuantityPlace = document.getElementById("totalQuantity");
    totalQuantityPlace.innerText = calculateTotalQuantity();

    return totalQuantityPlace;
};


const calculateTotalPrice = async () => {

    let totalPrice = 0;

    for(let i = 0; i < localStorage.length; i++) {

        const rank = i + 1;
        const productStorage = retrieveProductStorage(rank);
        const product = await retrieveProductApi(productStorage.id);

        totalPrice += parseInt(productStorage.quantity, 10) * parseFloat(product.price);
    };

    return totalPrice;
};


const displayTotalPrice = async () => {

    const totalPricePlace = document.getElementById("totalPrice");
    totalPricePlace.innerText = await calculateTotalPrice();

    return totalPricePlace;
};


const createProductInfo = async () => {

    for(let i = 0; i < localStorage.length; i++) {

        const rank = i + 1;
        const productStorage = retrieveProductStorage(rank);
        const product = await retrieveProductApi(productStorage.id);

        if(productStorage.quantity != 0){ 

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
    };

    displayTotalQuantity();
    await displayTotalPrice();
};

/* *
*Find a product and its rank in localStorage from known id and quantity of product
*@param {string} id
*@param {interger|string} quantity
*@return {oject} product, {interger} rank
*/
const findProductAndRankInStorageFromIdAndQuantity = (id, quantity) => {

    let product;
    let rank;

    for(let i = 0; i < localStorage.length; i++) {

        const productRank = i + 1;
        const productStorage = retrieveProductStorage(productRank);

        if(id == productStorage.id && quantity == productStorage.quantity){

            product = productStorage;
            rank = productRank;
        };
    };

    return [product, rank];
};


const replaceProductInStorage = (rank, product) => {

    localStorage.removeItem(`Product${rank}`);
    localStorage.setItem(`Product${rank}`, JSON.stringify(product));
};


const addEventListenerToQuantityInput = () => {

    const inputList = document.querySelectorAll(".itemQuantity");

    for(let input of inputList) {

        const productArticle = input.closest("article.cart__item");
        const quantityOfProduct = input.value;
        const productId = productArticle.dataset.id;
        const product = findProductAndRankInStorageFromIdAndQuantity(productId, quantityOfProduct)[0];
        const rank = findProductAndRankInStorageFromIdAndQuantity(productId, quantityOfProduct)[1];

        input.addEventListener("change", async (e) => {

            const newQuantity = e.target.value;

            product.quantity = newQuantity;

            replaceProductInStorage(rank, product);

            if (newQuantity == 0) {

                productArticle.remove();
            };

            displayTotalQuantity();
            await displayTotalPrice();
        });
    };
};


const addEventListenerToDeleteButton = () => {

    const buttonList = document.querySelectorAll("p.deleteItem");

    for(let button of buttonList) {

        const productArticle = button.closest("article.cart__item");
        const quantityInput = productArticle.querySelector("input.itemQuantity")
        const quantityOfProduct = quantityInput.value;
        const productId = productArticle.dataset.id;
        const product = findProductAndRankInStorageFromIdAndQuantity(productId, quantityOfProduct)[0];
        const rank = findProductAndRankInStorageFromIdAndQuantity(productId, quantityOfProduct)[1];

        button.addEventListener("click", async () => {

            product.quantity = 0;

            replaceProductInStorage(rank, product);

            productArticle.remove();

            displayTotalQuantity();
            await displayTotalPrice();
        });
    };
};


//_________________________________________________________________________________


const sendOrderData = (contact, productList) => fetch("http://localhost:3000/api/order", {
    method: 'POST',
	headers: { 
        "Accept": "application/json", 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    },
	body: {
        contact: contact,
        products: productList
    }
})
.then(res => res.json())
.catch(err => console.log("Erreur sendOrderData", err));


/* caractères spéciaux france MAJ: ÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ
caratctères spéciaux france min: àâæçéèêëîïôœùûüÿ
regex prénom: /^[A-Z][a-zA-Z '-]*$/ 
régex nom: /^[A-Z][a-zA-Z '-]*$/
regex adresse: /^[0-9]*[a-zA-Z0-9 ,.'-]+$/
regex ville: /^[A-Z][a-zA-Z '-]+$/
regex email: /^.+@.+\.[a-z]+$/  */

let userFirstName;
let userLastName;
let userAddress;
let userCity;
let userEmail;


const isFirstNameCorrect = firstName => {

    const regex = /^[A-ZÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ][a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ '-]*$/;

    return regex.test(firstName);
};


const isLastNameCorrect = lastName => {

    const regex = /^[A-ZÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ][a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ '-]*$/;

    return regex.test(lastName);
};


const isAddressCorrect = address => {

    const regex = /^[0-9]*[a-zA-Z0-9àâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ ,.'-]+$/;

    return regex.test(address);
};


const isCityCorrect = city => {

    const regex = /^[A-Z][a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ '-]+$/;

    return regex.test(city);
};


const isEmailCorrect = email => {

    const regex = /^.+@.+\.[a-z]+$/;

    return regex.test(email);
};


const verifyIfFirstNameIsCorrect = () => {

    const firstNamePlace = document.getElementById("firstName");

    firstNamePlace.addEventListener("input", function(e) {

        const input = e.target.value;
        const errorMessageFirstNamePlace = document.getElementById("firstNameErrorMsg");
        

        if(isFirstNameCorrect(input)) {

            errorMessageFirstNamePlace.innerText = "";
            userFirstName = input;

        } else {

            errorMessageFirstNamePlace.innerText = "Entrez un prénom commançant par une majuscule.";
        };
    });
};


const verifyIfLastNameIsCorrect = () => {

    const lastNamePlace = document.getElementById("lastName");

    lastNamePlace.addEventListener("input", function(e) {

        const input = e.target.value;
        const errorMessageLastNamePlace = document.getElementById("lastNameErrorMsg");

        if(isLastNameCorrect(input)) {

            errorMessageLastNamePlace.innerText = "";
            userLastName = input;

        } else {

            errorMessageLastNamePlace.innerText = "Entrez un nom commançant par une majuscule.";
        };
    });
};


const verifyIfAddressIsCorrect = () => {

    const addressPlace = document.getElementById("address");

    addressPlace.addEventListener("input", function(e) {

        const input = e.target.value;
        const errorMessageAddressPlace = document.getElementById("addressErrorMsg");

        if(isAddressCorrect(input)) {

            errorMessageAddressPlace.innerText = "";
            userAddress = input;

        } else {

            errorMessageAddressPlace.innerText = "Entrez une adresse.";
        };
    });
};


const verifyIfCityIsCorrect = () => {

    const cityPlace = document.getElementById("city");

    cityPlace.addEventListener("input", function(e) {

        const input = e.target.value;
        const errorMessageCityPlace = document.getElementById("cityErrorMsg");

        if(isCityCorrect(input)) {

            errorMessageCityPlace.innerText = "";
            userCity = input;

        } else {

            errorMessageCityPlace.innerText = "Entrez le nom d'une ville commançant par une majuscule.";
        };
    });
};


const verifyIfEmailIsCorrect = () => {

    const emailPlace = document.getElementById("email");

    emailPlace.addEventListener("input", function(e) {

        const input = e.target.value;
        const errorMessageEmailPlace = document.getElementById("emailErrorMsg");

        if(isEmailCorrect(input)) {

            errorMessageEmailPlace.innerText = "";
            userEmail = input;

        } else {

            errorMessageEmailPlace.innerText = "Entrez une adresse email valide";
        };
    });
};


const addEventListenerToFormFields = () => {

    verifyIfFirstNameIsCorrect();
    verifyIfLastNameIsCorrect();
    verifyIfAddressIsCorrect();
    verifyIfCityIsCorrect();
    verifyIfEmailIsCorrect();
};


const verifyIfFormIsCorrect = () => {

    if(userFirstName && userLastName && userAddress && userCity && userEmail) {

        return {
            firstName : userFirstName,
            lastName: userLastName,
            address: userAddress,
            city: userCity,
            email: userEmail
        };
    };
};


const isProductAlreadyInList = (productId, list) => {

    if(list.length != 0) {

        for(let i = 0; i < list.length; i++) {

            if(productId == list[i]) {

                return true;
            };
        };
    } else {

        return false;
    };
};


const createProductList = () => {

    let productList = [];

    for(i = 0; i < localStorage.length; i++) {

        const rank = i + 1;
        const product = retrieveProductStorage(rank);
        const productQuantity = product.quantity;
        const productId = product.id;

        if(!isProductAlreadyInList(productId, productList) && productQuantity != 0) {

            productList.push(productId);
        };   
    };

    return productList;
};

const isProductListEmpty = () => {

    const productList = createProductList();

    if(productList.length === 0) {

        return true;

    } else {

        return false;
    }
}


const addEventListenerToOrderButton = /*async*/ () => {

    const orderButton = document.getElementById("order");

    orderButton.addEventListener("click", function(e) {

        if(verifyIfFormIsCorrect() && !isProductListEmpty()) {

            const contactUser = verifyIfFormIsCorrect();
            const productList = createProductList();
            //const resultFetch = await sendOrderData(contactUser, productList);
            //const orderNumber = resultFetch.id;
            const mockedOrderNumber = "123";

            localStorage.clear();
            //window.location.href = `../html/confirmation.html?id=${orderNumber}`;
            const url = new URL(`http://localhost:5500/html/confirmation.html?id=${mockedOrderNumber}`)
            window.location.href = url;

        } else {

            e.preventDefault();
            alert("Veuillez remplir tous les champs du formulaire correctement et avoir ajouté des produits au panier.");
        };
    });
};


//_______________________________________________________________________________________________________


const showOrderId = () => {

    const orderIdPlace = document.getElementById("orderId");
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const orderId = url.searchParams.get("id");

    orderIdPlace.innerText = orderId;
};


const main = async () => {

    const currentUrl = window.location.href;

    if(/cart.html/.test(currentUrl)) {

        await createProductInfo();
        addEventListenerToQuantityInput();
        addEventListenerToDeleteButton();
        addEventListenerToFormFields();
        /*await*/ addEventListenerToOrderButton();

    } else {

        showOrderId();
    };
};

main();