/**
 * Retrieve the product list from the API
 * @return {json} -list of products-
 */
const retrieveProductList = () => fetch('http://localhost:3000/api/products')
.then(res => res.json())
.catch(err => console.log('Erreur retrieveProductList', err));

/**
 * Inject HTML link <a> that directs towards the desired product page
 * @param {object} product 
 * @returns {HTMLElement} productLink
 */
const createProductLink = product => {

    const productLink = document.createElement('a');
    productLink.setAttribute('href', `./product.html?id=${product._id}`);

    return productLink;
};

/**
 * Inject HTML image <img> with source and alternative text from the object product
 * @param {object} product 
 * @returns {HTMLElement} productImage
 */
const createProductImage = product => {

    const productImage = document.createElement('img');
    productImage.setAttribute('src', `${product.imageUrl}`);
    productImage.setAttribute('alt', `${product.altTxt}`);

    return productImage;
};

/**
 * Inject HTML title <h3> with the name of the product
 * @param {object} product 
 * @returns {HTMLElement} productName
 */
const createProductName = product => {

    const productName = document.createElement('h3');
    productName.classList.add("productName");
    productName.innerText = product.name;

    return productName;
};

/**
 * Inject HTML paragraph <p> with product description
 * @param {object} product 
 * @returns {HTMLElement} productDescription
 */
const createProductDescription = product => {

    const productDescription = document.createElement('p');
    productDescription.classList.add("productDescription");
    productDescription.innerText = product.description;

    return productDescription;
};

/**
 * Create every HTML elements needed for displaying each product card by using last functions and append them to the right place in the DOM
 * @param {object} product 
 * @returns {HTMLElement} productPlace
 */
const createProductCard = product => {

    const productPlace = document.getElementById('items');

    const productLink = createProductLink(product);

    const productBody = document.createElement('article');

    const productImage = createProductImage(product);
    const productName = createProductName(product);
    const productDescription = createProductDescription(product);

    productPlace.appendChild(productLink);
    productLink.appendChild(productBody);
    productBody.appendChild(productImage);
    productBody.appendChild(productName);
    productBody.appendChild(productDescription);

    return productPlace;
};

/**
 * Main function of the page that executes the creation and displaying of product card for each product in the product list
 */
const main = async () => {
    const productList = await retrieveProductList();

    for(let product of productList) {
        createProductCard(product);
    };
};

main();