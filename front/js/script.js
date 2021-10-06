const retrieveProductList = () => fetch('http://localhost:3000/api/products')
.then(res => res.json())
.catch(err => console.log('Erreur retrieveProductList', err));


const createProductLink = product => {

    const productLink = document.createElement('a');
    productLink.setAttribute('href', `./product.html?id=${product._id}`);

    return productLink;
};


const createProductImage = product => {

    const productImage = document.createElement('img');
    productImage.setAttribute('src', `${product.imageUrl}`);
    productImage.setAttribute('alt', `${product.altTxt}`);

    return productImage;
};


const createProductName = product => {

    const productName = document.createElement('h3');
    productName.classList.add("productName");
    productName.innerText = product.name;

    return productName;
};


const createProductDescription = product => {

    const productDescription = document.createElement('p');
    productDescription.classList.add("productDescription");
    productDescription.innerText = product.description;

    return productDescription;
};


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


const main = async () => {
    const productList = await retrieveProductList();

    for(let product of productList) {
        createProductCard(product);
    };
};

main();