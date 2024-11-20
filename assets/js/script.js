
const books = [
    { id: 1, title: "Famous Five", author: "Enid Byton", price: 29.99, image: "/Famous Five.jpg" },
    { id: 2, title: "To kill a mocking bird", author: "Herper Lee", price: 19.99, image: "/To kill a mocking bird.jpeg" },
    { id: 3, title: "the sound for the hours", author: "Karen Crampbell", price: 34.99, image: "/Historical+Fiction+The+Sound+of+the+Hours+by+Karen+Campbell.jpg" },
    { id: 4, title: "The Hobbit", author: "J.R.R K Tolkein", price: 39.99, image: "/R.jpeg"},
      {id:5, tittle:"The Outsider",author:"Stephen King" ,price: 49.99, image:"/The Outsider.jpeg"
     }
    
];


function renderBooks() {
    const bookList = document.getElementById("book-list");
    books.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        bookDiv.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
            <p>₹${book.price.toFixed(2)}</p>
            <button onclick="addToCart(${book.id})">Add to Cart</button>
        `;
        bookList.appendChild(bookDiv);
    });
}


let cart = JSON.parse(localStorage.getItem("cart")) || [];


function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    const cartItem = cart.find(item => item.id === bookId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}


function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    cart.forEach(item => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");
        cartItemDiv.innerHTML = `
            <h3>${item.title}</h3>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItemDiv);
    });
}


function removeFromCart(bookId) {
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you for your purchase!");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

renderBooks();
renderCart();
function saveOrdersToExcel() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Prepare data for Excel
    const orders = cart.map(item => ({
        Title: item.title,
        Author: item.author,
        Quantity: item.quantity,
        Price: `₹${item.price.toFixed(2)}`,
        Total: `₹${(item.price * item.quantity).toFixed(2)}`
    }));

    // Add headers
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Save file
    const date = new Date().toISOString().slice(0, 10); // e.g., "2024-11-20"
    XLSX.writeFile(workbook, `Bookstore_Orders_${date}.xlsx`);
}
