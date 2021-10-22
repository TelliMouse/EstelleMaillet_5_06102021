/**
 * Retrieve the object from the API with the product ID
 * @param {String} id 
 * @returns {Json} -object-
 */
const retrieveProductApi = id => fetch(`http://localhost:3000/api/products/${id}`)
.then(res => res.json())
.catch(err => console.log('Erreur retrieveProductApi', err));

/**
 * Retrieve an object from localStorage and return it as a JSON object
 * @param {Integer} rank 
 * @returns {Json} -object-
 */
const retrieveProductStorage = rank => {

    return JSON.parse(localStorage.getItem(`Product${rank}`));
};

/**
 * Inject HTML article <article> with the product id as value for attribute "data-id"
 * @param {object} product 
 * @returns {HTMLElement} productCard
 */
const createProductCard = product => {

    const productCard = document.createElement("article");
    productCard.classList.add("cart__item");
    productCard.setAttribute("data-id", product._id);

    return productCard;
};

/**
 * Inject HTML division <div> and append image <img> with image url and alternative text from the object "product" to it
 * @param {Object} product 
 * @returns {HTMLElement} imagePlace
 */
const createProductImg = product => {

    const imagePlace = document.createElement("div");
    imagePlace.classList.add("cart__item__img");

    const image = document.createElement("img");
    image.setAttribute("src", product.imageUrl);
    image.setAttribute("alt", product.altTxt)

    imagePlace.appendChild(image);

    return imagePlace;
};

/**
 * Inject HTML division <div>
 * @returns {HTMLElement} itemContent
 */
const createItemContent = () => {

    const itemContent = document.createElement("div");
    itemContent.classList.add("cart__item__content");

    return itemContent;
};

/**
 * Inject HTML title <h2> and paragraph <p> with product name and product price
 * @param {Object} product 
 * @returns {HTMLElement} titlePricePlace
 */
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

/**
 * Inject HTML division <div>
 * @returns {HTMLElement} contentSettings
 */
const createContentSettings = () => {

    const contentSettings = document.createElement("div");
    contentSettings.classList.add("cart__item__content__settings");

    return contentSettings;
};

/**
 * Inject HTML <div> then append to it <p> and <iput>, and retrieve product form localStorage and set value of <input> to product quantity
 * @param {Integer} rank 
 * @returns {HTMLElement} contentSettingsQuantity
 */
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

/**
 * Inject HTML <div> and append <p> to it
 * @returns {HTMLElement} contentSettingsDelete
 */
const createContentSettingsDelete = () => {

    const contentSettingsDelete = document.createElement("div");
    contentSettingsDelete.classList.add("cart__item__content__settings__delete");

    const deleteItem = document.createElement("p");
    deleteItem.classList.add("deleteItem");
    deleteItem.innerText = "Supprimer";

    contentSettingsDelete.appendChild(deleteItem);

    return contentSettingsDelete;
};

/**
 * Add the quantity of all products in localStorage to get the total quantity of all products in the cart
 * @returns {Integer} totalQuantity
 */
const calculateTotalQuantity = () => {

    let totalQuantity = 0;

    for(let i = 0; i < localStorage.length; i++) {

        const rank = i + 1;
        const productStorage = retrieveProductStorage(rank);

        totalQuantity += parseInt(productStorage.quantity, 10);
    };

    return totalQuantity;
};

/**
 * Inject text between the right HTML tags to display the total quantity of all products
 * @returns {HTMLElement} totalQuantityPlace
 */
const displayTotalQuantity = () => {

    const totalQuantityPlace = document.getElementById("totalQuantity");
    totalQuantityPlace.innerText = calculateTotalQuantity();

    return totalQuantityPlace;
};

/**
 * For each product in localStorage, multiply the quantity by the price (retrieved from the API) and then add that to the total price for all products
 * @returns {Integer}
 */
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

/**
 * Inject text between the right HTML tags to display the total price for all products
 * @returns {HTMLElement} totalPricePlace
 */
const displayTotalPrice = async () => {

    const totalPricePlace = document.getElementById("totalPrice");
    totalPricePlace.innerText = await calculateTotalPrice();

    return totalPricePlace;
};

/**
 * For each product in localStorage that has a quantity different from 0, create every HTML elements needed to display product infos, and then display total quantity and total price
 */
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

/**
*Find a product and its rank in localStorage from known id and quantity of product
* @param {String} id
* @param {Integer | String} quantity
* @return {Array} [{Oject} product, {Interger} rank]
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

/**
 * Replace an object in localStorage by a new object but with the same rank
 * @param {Integer} rank 
 * @param {Object} product 
 */
const replaceProductInStorage = (rank, product) => {

    localStorage.removeItem(`Product${rank}`);
    localStorage.setItem(`Product${rank}`, JSON.stringify(product));
};

/**
 * Add event listener to each quantity input of product, and when it changes, we change the quantity of the product in localStorage, and if the quantity if 0, we remove the product card from the page, and at the end, we calculate again total price and quantity
 */
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

/**
 * Add event listener to each delete button, and when it's clicked, we change the product quantity to 0 in localStorage and remove the product card from the page, and then recalculate total price and quantity
 */
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

/**
 * Send a post request to the API that then returns what we sent as an order and an orderId
 * @param {Array} order 
 * @returns {Json} -object-
 */
const sendOrderData = order => fetch("http://localhost:3000/api/products/order", {
    method: 'POST',
	headers: { 
        "Accept": "application/json", 
        "Content-Type": "application/json"
    },
	body: JSON.stringify(order)
})
.then(res => res.json())
.catch(err => console.log("Erreur sendOrderData", err));


let userFirstName;
let userLastName;
let userAddress;
let userCity;
let userEmail;

/**
 * Test the first name against a regex -same functionment for the next 4 functions-
 * @param {Strings} firstName 
 * @returns {Boolean}
 */
const isFirstNameCorrect = firstName => {

    const regex = /^[A-ZÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ][a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ '-]*$/;

    return regex.test(firstName);
};

//^^^
const isLastNameCorrect = lastName => {

    const regex = /^[A-ZÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ][a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ '-]*$/;

    return regex.test(lastName);
};

//^^^
const isAddressCorrect = address => {

    const regex = /^[0-9]*[a-zA-Z0-9àâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ ,.'-]+$/;

    return regex.test(address);
};

//^^^
const isCityCorrect = city => {

    const regex = /^[A-Z][a-zA-ZàâæçéèêëîïôœùûüÿÀÂÆÇÉÈÊËÎÏÔŒÙÛÜŸ '-]+$/;

    return regex.test(city);
};

//^^^
const isEmailCorrect = email => {

    const regex = /^.+@.+\.[a-z]+$/;

    return regex.test(email);
};

/**
 * Add event listener to the first name field of the form, and test the input against a regex with the help of last functions, change the value of userFirstName when the input is valid and display an error message when the input isn't valid -same functionment for the next 4 functions-
 */
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

//^^^
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

//^^^
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

//^^^
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

//^^^
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

/**
 * Add every event listener with the help of the last 5 functions
 */
const addEventListenerToFormFields = () => {

    verifyIfFirstNameIsCorrect();
    verifyIfLastNameIsCorrect();
    verifyIfAddressIsCorrect();
    verifyIfCityIsCorrect();
    verifyIfEmailIsCorrect();
};

/**
 * Retrieve the values of userFirstName/LastName/Address/City/Email and if they are not undefined or null set them as values in an object
 * @returns {Object}
 */
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

/**
 * Verify if a product Id is already in the list of product Ids
 * @param {String} productId 
 * @param {Array} list 
 * @returns {Boolean}
 */
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

/**
 * For each product in localStorage, if the product Id isn't already in the list and the product quantity is different from 0, add product Id to productList
 * @returns {Array} productList
 */
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

/**
 * Verify if the array productList created with the last function is empty
 * @returns {Boolean}
 */
const isProductListEmpty = () => {

    const productList = createProductList();

    if(productList.length === 0) {

        return true;

    } else {

        return false;
    }
};

/**
 * Add envent listener to order button that, when the form is correct and the product list isn't empty, sends a POST request to the API with the contact object and product list and then redirects the user to the confirmation page with the order Id returned after the POST request set in the URL, or display an alert if not everything is valid
 */
const addEventListenerToOrderButton = () => {

    const orderButton = document.getElementById("order");

    orderButton.addEventListener("click", async (e) => {

        if (verifyIfFormIsCorrect() && !isProductListEmpty()) {

            e.preventDefault();

            const contactUser = verifyIfFormIsCorrect();
            const productList = createProductList();
            const order = {
                contact: contactUser,
                products: productList
            };

            const resultFetch = await sendOrderData(order);
            const orderId = resultFetch.orderId;

            localStorage.clear();
            window.location.href = `../html/confirmation.html?id=${orderId}`;

        } else {

            e.preventDefault();
            alert("Veuillez remplir tous les champs du formulaire correctement et avoir ajouté des produits au panier.");
        };
    });
};


//_______________________________________________________________________________________________________

/**
 * Retrieve the order id from the parameter "id" in the URL and then display it through injecting text between the right HTML tags in the confirmation page
 */
const showOrderId = () => {

    const orderIdPlace = document.getElementById("orderId");
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const orderId = url.searchParams.get("id");

    orderIdPlace.innerText = orderId;
};

/**
 * Verify on which page we are through a regex test and executes the right functions acording to it; create products infos and add eventListeners to quantity inputs, form fields and and order button on the cart page, and display the order id on the confirmation page
 */
const main = async () => {

    const currentUrl = window.location.href;

    if(/cart.html/.test(currentUrl)) {

        await createProductInfo();
        addEventListenerToQuantityInput();
        addEventListenerToDeleteButton();
        addEventListenerToFormFields();
        addEventListenerToOrderButton();

    } else {

        showOrderId();
    };
};

main();