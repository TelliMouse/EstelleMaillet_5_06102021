/**
 * Retrieve the object from the API with the product ID
 * @param {String} id 
 * @returns {Json} -object "product"-
 */
const retrieveProduct = (id) => fetch(`http://localhost:3000/api/products/${id}`)
.then(res => res.json())
.catch(err => console.log('Erreur retrieveProduct', err));

/**
 * Retrieve the product ID from the parameter "id" from the url
 * @returns {String} id
 */
const getProductIdFromUrl = async () => {

    //Get the url of the current page
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const id = await url.searchParams.get("id");

    return id;
};

/**
 * Inject HTML image <img> and append it to the right element
 * @param {Object} product 
 * @returns {HTMLElement} imgPlace
 */
const createProductImage = product => {

    const imgPlace = document.querySelector(".item__img");

    const productImg = document.createElement("img");
    const imageUrl = product.imageUrl;
    const altTxt = product.altTxt
    productImg.setAttribute('src', `${imageUrl}`);
    productImg.setAttribute('alt', `${altTxt}`);

    imgPlace.appendChild(productImg);

    return imgPlace;
};

/**
 * Inject text between the right HTML tags to display the product name
 * @param {Object} product 
 * @returns {HTMLElement} productNamePlace
 */
const createProductName = product => {

    const productName = product.name;

    const productNamePlace = document.getElementById('title');
    productNamePlace.innerText = productName;

    return productNamePlace;
};

/**
 * Inject text between the right HTML tags to display the product price
 * @param {Object} product 
 * @returns {HTMLElement} productPricePlace
 */
const createProductPrice = product => {

    const productPrice = product.price;

    const productPricePlace = document.getElementById('price');
    productPricePlace.innerText = productPrice;

    return productPricePlace;
};

/**
 * Inject text between the right HTML tags to display the product description
 * @param {Object} product 
 * @returns {HTMLElement} productDescriptionPlace
 */
const createProductDescription = product => {

    const productDescription = product.description;

    const productDescriptionPlace = document.getElementById('description');
    productDescriptionPlace.innerText = productDescription;

    return productDescriptionPlace;
};

/**
 * Inject HTML option <option> and append it to the right HTML element
 * @param {String} color 
 * @returns {HTMLElement} colorSelect
 */
const createColorOption = color => {

    const colorSelect = document.getElementById('colors');

    const colorOption = document.createElement('option');
    colorOption.setAttribute('value', `${color}`);
    colorOption.innerText = color;

    colorSelect.appendChild(colorOption);

    return colorSelect;
};

/**
 * Inject a new color option in the DOM for each color in the array colors of the product
 * @param {Object} product 
 */
const createProductColors = product => {

    const productColors = product.colors;

    for(let color of productColors) {

        createColorOption(color);
    };
};

/**
 * Create each HTML element needed to display all product infos
 * @param {Object} product 
 */
const createProductInfo = product => {

    createProductImage(product);
    createProductName(product);
    createProductPrice(product);
    createProductDescription(product);
    createProductColors(product);
};


//_____________________________________________


let productColor;
let productQuantity = "1";

/**
 * Retrieve product list from localStorage
 * @returns {Json} -array-
 */
const getProductListStorage = () => {

    return JSON.parse(localStorage.getItem('ProductList'));
};

/**
 * Create an object that contains the informations needed to be sent to localStorage when a product is added to the cart
 * @returns {Object} currentProduct
 */
const getCurrentProduct = async () => {

    let currentProduct = {

        id: await getProductIdFromUrl(),
        color: productColor,
        quantity: productQuantity
    };

    return currentProduct;
};

/**
 * Verify if every part of the object to be sent to localStorage has a value and if the quantity is diffrent from 0
 * @returns {Boolean}
 */
const isTheProductComplete = async () => {

    const product = await getCurrentProduct();

    if(product.id && product.color && product.quantity && product.quantity != 0) {

        return true;

    } else {

        return false;
    };
};

/**
 * If the current product (id and color) is already in localStorage, we find its rank
 * @param {Object} product 
 * @returns {Integer} i
 */
const findTheIndexOfTheProductInStorage = product => {

    if(localStorage.length !== 0){

        const productList = getProductListStorage();

        for( let i = 0; i < productList.length; i++){

        const productInStorage = productList[i];

            if(product.id == productInStorage.id && product.color == productInStorage.color) {
            
                return i;
            };
        };
    };
};

/**
 * Find if the current object is in the cart/localStorage and if it is, return its index
 * @param {Object} product 
 * @returns {Integer | Boolean} index | false
 */
const isTheProductAlreadyInTheCartAndWhatIsTheIndex = product => {

    if(localStorage.length !== 0) {

        const index = findTheIndexOfTheProductInStorage(product);

        return index;

    } else {

        return false;
    };
};

/**
 * Add two numbers that are written as a string
 * @param {String} string1 
 * @param {String} string2 
 * @returns {Integer}
 */
const addNumbersFromString = (string1, string2) => {

    return parseInt(string1, 10) + parseInt(string2, 10);
};

/**
 * Replace ProductList in localStorage by a modified ProductList
 * @param {Object} newList 
 */
const changeProductListInStorage = (newList) => {

    localStorage.removeItem('ProductList');
    localStorage.setItem('ProductList', JSON.stringify(newList));
};

/**
 * Find the current product in localStorage, retrieve product from localStorage, add quantity from object in storage and quantity from current product, set this new quantity as quantity of the product, and replace the old product by the product with the new quantity in localStorage
 * @param {object} product 
 */
const increaseQuantityOfProductInCart = product => {

    if(localStorage.length !== 0){

        const productList = getProductListStorage();
        const productIndex = isTheProductAlreadyInTheCartAndWhatIsTheIndex(product);
        const productInStorage = productList[productIndex];
        const newQuantity = addNumbersFromString(productInStorage.quantity, productQuantity);

        productInStorage.quantity = newQuantity;

        changeProductListInStorage(productList);
    };
};

/**
 * Add a new item in localStorage
 * @param {Object} product 
 */
const addNewProductToCart = product => {

    if(localStorage.length === 0){

        const productList = [product];
        const productListLinea = JSON.stringify(productList);

        localStorage.setItem('ProductList', productListLinea);

    } else {

        const productList = getProductListStorage();
    
        productList.push(product);

        changeProductListInStorage(productList);
    };    
};

/**
 * When you add the product in the cart, if the product is complete and already in the cart, we increase the quantity of the product in the cart, if it's complete and not in the cart, we add it, and if it's not complete, we don't add anything and send an alert
 */
const putProductInCart = async () => {

    const product = await getCurrentProduct();

    if(await isTheProductComplete()) {

        if(isTheProductAlreadyInTheCartAndWhatIsTheIndex(product) >= 0 && localStorage.length !== 0) {

            increaseQuantityOfProductInCart(product);
            alert('Produit ajouté au panier.');

        } else {

            addNewProductToCart(product);
            alert('Produit ajouté au panier.');
        };
    } else {

        alert('Veuillez choisir une quantité et une couleur.');
    };
};

/**
 * Main function that finds the product from the id in URL, then creates and displays product infos, then adds event listeners to color and quantity selections that change the color and quantity of the current product, and finally adds an eventlistener to the button that executes the last function to the click
 */
const main = async () => {

    const productId = await getProductIdFromUrl();
    const product = await retrieveProduct(productId);

    createProductInfo(product);
    
    const colorSelect = document.getElementById('colors');
    const quantitySelect = document.getElementById('quantity');
    const button = document.getElementById('addToCart');

    colorSelect.addEventListener('change', function(e) {

        productColor = e.target.value;
    });
    quantitySelect.addEventListener('input', function(e) {

        productQuantity = e.target.value;
    });
    button.addEventListener("click", putProductInCart);
};


main();