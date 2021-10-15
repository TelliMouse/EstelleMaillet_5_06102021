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

    console.log("début createProductInfo");

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


/*regex prénom: /^[A-Z][a-zA-Z '-]* / 
régex nom: /^[A-Z][a-zA-Z '-]* /
regex adresse: /^[0-9]*[a-zA-Z0-9 ,.'-]+/
regex ville: /^[A-Z][a-zA-Z '-]* /
regex email: /^.+@.+\..+/  */


/* const isFirstNameCorrect = firstName => {

    const regex = /^[A-Z][a-zA-Z '-] *  /;

    if(regex.test(firstName)) {

        return true;

    } else {

        return false;
    };
};


const isLastNameCorrect = lastName => {

    const regex = /^[A-Z][a-zA-Z '-]*  /;

    if(regex.test(lastName)) {

        return true;

    } else {

        return false;
    };
};


const isAddressCorrect = address => {

    const regex = /^[0-9]*[a-zA-Z0-9 ,.'-]+/;

    if(regex.test(address)) {

        return true;

    } else {

        return false;
    };
};


const isCityCorrect = city => {

    const regex = /^[A-Z][a-zA-Z '-]*  /;

    if(regex.test(city)) {

        return true;

    } else {

        return false;
    };
};


const isEmailCorrect = email => {

    const regex = /^.+@.+\..+/;

    if(regex.test(email)) {

        return true;

    } else {

        return false;
    };
};


const verifyIfFirstNameIsCorrect = () => {

    const firstNamePlace = document.getElementById("firstName");

    firstNamePlace.addEventListener("change", function(e) {

        const firstName = e.target.value;
        const errorMessageFirstNamePlace = document.getElementById("firstNameErrorMsg");

        if(isFirstNameCorrect(firstName)) {

            errorMessageFirstNamePlace.innerText = "";
            return firstName;

        } else {

            errorMessageFirstNamePlace.innerText = "Entrez un prénom commançant par une majuscule et ne comprenant ni accents ni caractères spéciaux";
            return false;
        };
    });
};


const verifyIfLastNameIsCorrect = () => {

    const lastNamePlace = document.getElementById("lastName");

    lastNamePlace.addEventListener("change", function(e) {

        const lastName = e.target.value;
        const errorMessageLastNamePlace = document.getElementById("lastNameErrorMsg");

        if(isLastNameCorrect(lastName)) {

            errorMessageLastNamePlace.innerText = "";
            return lastName;

        } else {

            errorMessageLastNamePlace.innerText = "Entrez un nom commançant par une majuscule et ne comprenant ni accents ni caractères spéciaux";
            return false;
        };
    });
};


const verifyIfAddressIsCorrect = () => {

    const addressPlace = document.getElementById("address");

    addressPlace.addEventListener("change", function(e) {

        const address = e.target.value;
        const errorMessageAddressPlace = document.getElementById("addressErrorMsg");

        if(isAddressCorrect(address)) {

            errorMessageAddressPlace.innerText = "";
            return address;

        } else {

            errorMessageAddressPlace.innerText = "Entrez une adresse ne comprenant ni accents ni caractères spéciaux";
            return false;
        };
    });
};


const verifyIfCityIsCorrect = () => {

    const cityPlace = document.getElementById("city");

    cityPlace.addEventListener("change", function(e) {

        const city = e.target.value;
        const errorMessageCityPlace = document.getElementById("cityErrorMsg");

        if(isCityCorrect(city)) {

            errorMessageCityPlace.innerText = "";
            return city;

        } else {

            errorMessageCityPlace.innerText = "Entrez le nom d'une ville commançant par une majuscule et ne comprenant ni accents ni caractères spéciaux";
            return false;
        };
    });
};


const verifyIfEmailIsCorrect = () => {

    const emailPlace = document.getElementById("email");

    emailPlace.addEventListener("change", function(e) {

        const email = e.target.value;
        const errorMessageEmailPlace = document.getElementById("emailErrorMsg");

        if(isEmailCorrect(email)) {

            errorMessageEmailPlace.innerText = "";
            return email;

        } else {

            errorMessageEmailPlace.innerText = "Entrez une adresse email valide";
            return false;
        }
    });
};


const verifyIfFormIsCorrect = () => {

    const firstName = verifyIfFirstNameIsCorrect();
    const lastName = verifyIfLastNameIsCorrect();
    const address = verifyIfAddressIsCorrect();
    const city = verifyIfCityIsCorrect();
    const email = verifyIfEmailIsCorrect();

    if(firstName && lastName && address && city && email) {

        return {
            firstName : firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        };
    };
};


const addEventListenerToOrderButton = () => {

    if(verifyIfFormIsCorrect()) {

        //POST

    } else {

        alert("Veuillez remplir tous les champs du formulaire correctement");
    }
} */


const main = async () => {

    console.log("début main");
    await createProductInfo();
    addEventListenerToQuantityInput();
    addEventListenerToDeleteButton();
};

main();