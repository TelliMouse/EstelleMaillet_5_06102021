const retrieveProduct = (id) => fetch(`http://localhost:3000/api/products/${id}`)
.then(res => res.json())
.catch(err => console.log('Erreur retrieveProduct', err));


const getProductIdFromUrl = async () => {

    //Get the url of the current page
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const id = await url.searchParams.get("id");

    return id;
};


/*const getWhichProductToShow = async (id) => {

    return await retrieveProduct(id);
    
    //Première façon
    let productToShow;
    for(let product of productList) {

        const productId = product._id

        if(productId == id) {

            productToShow = product;
        } else {

            console.log('===');
            console.log(productId, id);
            console.log('===');
        }
    };

    return productToShow;
    
    //Deuxième façon
    let i=0;
    
    while(productList[i]["_id"] != id && i < productList.length) {

        i++;
    };
    
    console.log(productList[i]);
    return productList[i];
} */

const createProductImage = product => {

    const imgPlace = document.querySelector('item__img');

    const productImg = document.createElement('img');
    const imageUrl = product.imageUrl;
    const altTxt = product.altTxt
    productImg.setAttribute('src', `${imageUrl}`);
    productImg.setAttribute('alt', `${altTxt}`);

    imgPlace.appendChild(productImg);

    return imgPlace;
};


const createProductName = product => {

    const productName = product.name;

    const productNamePlace = document.getElementById('title');
    productNamePlace.innerText = productName;

    return productNamePlace;
};


const createProductPrice = product => {

    const productPrice = product.price;

    const productPricePlace = document.getElementById('price');
    productPricePlace.innerText = productPrice;

    return productPricePlace;
};


const createProductDescription = product => {

    const productDescription = product.description;

    const productDescriptionPlace = document.getElementById('description');
    productDescriptionPlace.innerText = productDescription;

    return productDescriptionPlace;
};


const createColorOption = color => {

    const colorSelect = document.getElementById('colors');

    const colorOption = document.createElement('option');
    colorOption.setAttribute('value', `${color}`);
    colorOption.innerText = color;

    colorSelect.appendChild(colorOption);

    return colorSelect;
};


const createProductColors = product => {

    const productColors = product.colors;

    for(let color of productColors) {

        createColorOption(color);
    };
};


const createProductInfo = product => {

    createProductImage(product);
    createProductName(product);
    createProductPrice(product);
    createProductDescription(product);
    createProductColors(product);
};


const main = async () => {

    const productId = await getProductIdFromUrl();
    const product = await retrieveProduct(productId);

    createProductInfo(product);
};


main();