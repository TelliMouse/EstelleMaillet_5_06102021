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


//_____________________________________________


let productColor;
let productQuantity;


const getCurrentProduct = async () => {

    let currentProduct = {

        id: await getProductIdFromUrl(),
        color: productColor,
        quantity: productQuantity
    };

    return currentProduct;
};


const isTheProductComplete = async () => {

    const product = await getCurrentProduct();

    if(product.id && product.color && product.quantity !== 0) {

        return true;

    } else {

        return false;
    };
};


const findTheRankOfTheProductInStorage = product => {

    for( let i = 0; i < localStorage.length; i++){

        const productRank = i + 1;
        const productInStorage = localStorage.getItem(`Product${productRank}`);
        const productInStorageJson = JSON.parse(productInStorage);

        if(product.id == productInStorageJson.id && product.color == productInStorageJson.color) {
            
            return productRank;
        };
    };
};


const isTheProductAlreadyInTheCartAndWhatIsTheRank = product => {

    if(localStorage.length !== 0) {

        const index = findTheRankOfTheProductInStorage(product);

        return index;

    } else {

        return false;
    };
};


const getProductJsonFromStorage = rank => {

    return JSON.parse(localStorage.getItem(`Product${rank}`));
};


const addNumbersFromString = (string1, string2) => {

    return parseInt(string1, 10) + parseInt(string2, 10);
};


const replaceObjectFromStorage = (rank, newObject) => {

    localStorage.removeItem(`Product${rank}`);
    localStorage.setItem(`Product${rank}`, JSON.stringify(newObject));
};


const increaseQuantityOfProductInCart = product => {

    const productRank = isTheProductAlreadyInTheCartAndWhatIsTheRank(product);
    const productInStorage = getProductJsonFromStorage(productRank);
    const newQuantity = addNumbersFromString(productInStorage.quantity, productQuantity);

    productInStorage.quantity = newQuantity;

    replaceObjectFromStorage(productRank, productInStorage);
};


const addNewProductToCart = product => {

    const productRank = localStorage.length + 1;
    const productLinea = JSON.stringify(product);

    localStorage.setItem(`Product${productRank}`, productLinea);
};


const putProductInCart = async () => {

    const product = await getCurrentProduct();

    if(await isTheProductComplete()) {

        if(isTheProductAlreadyInTheCartAndWhatIsTheRank(product)) {

            increaseQuantityOfProductInCart(product);

        } else {

            addNewProductToCart(product);
        };
    } else {

        alert('Please choose a color and a quantity.');
    };
};


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