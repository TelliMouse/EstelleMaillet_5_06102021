const mockedUser = {
    firstName : "Telli",
    lastName: "Mouse",
    address: "102 rue Wonderland",
    city: "Oz",
    email: "machin@machin.com"
}

const mockedProductList = () => {

    let productList = [];

    for(i = 0; i < localStorage.length; i++) {

        const rank = i + 1;
        const product = JSON.parse(localStorage.getItem(`Product${rank}`));

        console.log(`product is: ${product}`);

        productList.push(product.id);

        console.log(`product list : ${productList}`);
    };

    return productList;
};

const productList = mockedProductList();

const sendMockedData = () => fetch("http://localhost:3000/api/order", {
    method: 'POST',
	headers: { 
'Accept': 'application/json', 
'Content-Type': 'application/json' 
},
	body: {
        contact: mockedUser,
        products: productList
    }
})
.then(res => localStorage.setItem("resultFetch", JSON.stringify(res.json())));

sendMockedData();