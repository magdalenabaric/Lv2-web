"use strict";

// const - constant (immutable)
// let - variable (mutable)
// require() - import
// console.log() - print

const readline = require('readline');
const process = require('process');

let walletAmount = 100;
let shoppingCart = [];


// (Almost all) JavaScript types:
// - number (const a = 1;)
// - string (const a = 'abc';)
// - boolean (const a = true;)
// - object (const a = { name: 'abc', age: 1 };)
// - array (const a = [1, 2, 3];)

let items = [
    {
        name: 'banana',
        price: 20,
        amount: 10,
    },
    {
        name: 'apple',
        price: 10,
        amount: 5,
    },
    {
        name: 'strawberry',
        price: 25,
        amount: 6,

    },
    {
        name: 'lemon',
        price: 40,
        amount: 3,

    },

];

function addToCart(itemName, itemAmount) {
    const index = items.findIndex((item) => item.name === itemName);
    const item = items[index];


    if (!item) {
        console.log('Item is not found!');
        return;

    }
    if (itemAmount > item.amount) {
        console.log(`Not enough ${item.name} in stock.`);
        return;
    }
    if ((item.price * itemAmount) > walletAmount) {
        console.log('Not enough money');
        return;
    }

    item.amount -= itemAmount;

    const cartIndex = shoppingCart.findIndex(cartItem => cartItem.name === itemName);
    if (cartIndex !== -1) {
        shoppingCart[cartIndex].amount += itemAmount;
    } else {
        shoppingCart.push({ name: item.name, price: item.price, amount: itemAmount });
    }

    walletAmount -= (item.price * itemAmount);
    console.log(`Added ${itemAmount} ${item.name}(s) to cart. Each costs ${item.price}e.`);
}

function buy() {
    if (shoppingCart.length === 0) {
        console.log('Shopping cart is empty.');
        return;
    }

    shoppingCart.forEach(cartItem => {
        console.log(`Bought ${cartItem.amount} ${cartItem.name}(s) for ${cartItem.price * cartItem.amount}e.`);
    });

    shoppingCart = [];
}

function removeFromCart(itemName, itemAmount) {
    const index = shoppingCart.findIndex(item => item.name === itemName);
    itemAmount = parseInt(itemAmount);

    if (index !== -1) {
        const cartItem = shoppingCart[index];

        if (itemAmount >= cartItem.amount) {
            shoppingCart.splice(index, 1);
            walletAmount += cartItem.price * cartItem.amount;
            const storeIndex = items.findIndex(item => item.name === cartItem.name);
            items[storeIndex].amount += cartItem.amount;

        } else {
            cartItem.amount -= itemAmount;
            walletAmount += cartItem.price * itemAmount;
            const storeIndex = items.findIndex(item => item.name === cartItem.name);
            items[storeIndex].amount += itemAmount;

        }

        console.log(`${itemAmount} ${itemName}(s) removed from cart.`);

    } else {
        console.log(`"${itemName}" not found in cart.`);
    }

}



function showCart() {
    console.log("Items in cart:");

    if (shoppingCart.length === 0) {
        console.log("Your cart is empty");

    } else {
        shoppingCart.forEach(item => {
            console.log(`${item.name} (${item.amount}  ${item.price}e each`);
        });

        console.log(`Total: ${calculateTotal()}e`);
    }
}

function calculateTotal() {
    let total = 0;

    shoppingCart.forEach(item => {
        total += item.price * item.amount;

    });

    return total;

}

function showWalletAmount() {
    console.log(`Wallet amount: ${walletAmount}e`);
}

function removeAll() {
    shoppingCart.forEach(item => {
        const storeIndex = items.findIndex(storeItem => storeItem.name === item.name);
        if (storeIndex !== -1) {
            items[storeIndex].amount += item.amount;
        }


        walletAmount += item.price * item.amount;
    });
    shoppingCart = [];

    console.log(`Your cart is empty.`);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function showAll() {
    items.forEach(item => {
        console.log(`${item.name} ${item.price}e (amount: ${item.amount})`);
    }
    )
}

function sortItems(order) {
    if (order === 'asc') {
        items.sort((a, b) => a.price - b.price);
    } else if (order === 'desc') {
        items.sort((a, b) => b.price - a.price);
    } else {
        console.log('Invalid sort order.[asc/desc]');
        return;
    }
    console.log(`Items sorted in ${order} order (by price).`);
    showAll();
}

function help() {
    console.log(`COMMANDS:`)
    console.log(`buy        -   buy                             -   buy items in cart`);
    console.log(`remove     -   remove [itemName] [amount]      -   remove item from cart`);
    console.log(`cart       -   cart                            -   show items in cart`);
    console.log(`all        -   all                             -   show all items in store`);
    console.log(`wallet     -   wallet                          -   show available wallet amount`);
    console.log(`clear      -   clear                           -   remove all items from cart`);
    console.log(`add        -   add [itemName] [amount]         -   add item to cart`);
    console.log(`sort       -   sort [asc/desc]                 -   sort items in chosen order`)
    console.log(`help       -   help                            -   show available commands`);
}

console.log("Fruit Store");
rl.prompt();

// (argument) => { body } - arrow function
// higher-order function, equivalent of delegate in C#
// rl.on('line', (line) => { ... }) registers a function to 
// get called when the user enters a line
rl.on('line', (line) => {
    const split = line.split(' ');
    const command = split[0];
    const args = split.slice(1);
    console.log(`Command: ${command}`);
    console.log(`Args: ${args}`);

    switch (command) {
        case 'buy':
            buy();
            break;
        case 'remove':
            removeFromCart(args[0], args[1]);
            break;
        case 'cart':
            showCart();
            break;
        case 'all':
            showAll();
            break;
        case 'wallet':
            showWalletAmount();
            break;
        case 'clear':
            removeAll();
            break;
        case 'add':
            addToCart(args[0], args[1]);
            break;
        case 'help':
            help();
            break;
        case 'sort':
            sortItems(args[0]);
            break;
        default:
            console.log(`Unknown command: ${command}`);
    }

    rl.prompt();
}).on('close', () => {
    console.log('Exit');
    process.exit(0);
});