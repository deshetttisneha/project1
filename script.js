/* =====================================
   GREENLEAF PLANT NURSERY
   JavaScript
===================================== */


/* =====================================
   MOBILE MENU
===================================== */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }

});


/* Close mobile menu after clicking a link */

document.querySelectorAll(".nav-links a").forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =====================================
   DARK MODE
===================================== */

const darkModeBtn = document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    const icon = darkModeBtn.querySelector("i");

    if (document.body.classList.contains("dark-mode")) {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

        localStorage.setItem("darkMode", "enabled");

    } else {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

        localStorage.setItem("darkMode", "disabled");

    }

});


/* Remember dark mode */

if (localStorage.getItem("darkMode") === "enabled") {

    document.body.classList.add("dark-mode");

    const icon = darkModeBtn.querySelector("i");

    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");

}


/* =====================================
   PRODUCT SEARCH
===================================== */

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.toLowerCase();

    const products = document.querySelectorAll(".product-card");

    let visibleProducts = 0;

    products.forEach(function (product) {

        const productName =
            product.dataset.name.toLowerCase();

        if (productName.includes(searchValue)) {

            product.style.display = "block";
            visibleProducts++;

        } else {

            product.style.display = "none";

        }

    });

    checkProducts(visibleProducts);

});


/* =====================================
   PRODUCT CATEGORY FILTER
===================================== */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const productCards =
    document.querySelectorAll(".product-card");


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        /* Remove active class */

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        const category =
            button.dataset.category;

        let visibleProducts = 0;


        productCards.forEach(function (product) {

            const productCategory =
                product.dataset.category;

            if (
                category === "all" ||
                productCategory === category
            ) {

                product.style.display = "block";
                visibleProducts++;

            } else {

                product.style.display = "none";

            }

        });


        /* Clear search */

        searchInput.value = "";

        checkProducts(visibleProducts);

    });

});


/* =====================================
   CHECK PRODUCTS
===================================== */

const noProducts =
    document.getElementById("noProducts");

function checkProducts(count) {

    if (count === 0) {

        noProducts.style.display = "block";

    } else {

        noProducts.style.display = "none";

    }

}


/* =====================================
   SHOPPING CART
===================================== */

let cart =
    JSON.parse(localStorage.getItem("greenleafCart")) || [];


const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const openCart =
    document.getElementById("openCart");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");


/* Open cart */

openCart.addEventListener("click", function () {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

});


/* Close cart */

closeCart.addEventListener("click", closeCartSidebar);

cartOverlay.addEventListener("click", closeCartSidebar);


function closeCartSidebar() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

}


/* =====================================
   ADD TO CART
===================================== */

const addCartButtons =
    document.querySelectorAll(".add-cart");


addCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image;


        const existingProduct =
            cart.find(item => item.id === id);


        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({

                id: id,
                name: name,
                price: price,
                image: image,
                quantity: 1

            });

        }


        saveCart();
        displayCart();

        showToast(name + " added to cart!");

    });

});


/* =====================================
   DISPLAY CART
===================================== */

function displayCart() {

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-basket-shopping"></i>

                <h3>Your cart is empty</h3>

                <p>Add some beautiful plants!</p>

            </div>

        `;

    } else {

        cartItems.innerHTML = "";


        cart.forEach(function (item) {

            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";


            cartItem.innerHTML = `

                <img src="${item.image}"
                     alt="${item.name}">

                <div class="cart-item-info">

                    <h4>${item.name}</h4>

                    <strong>₹${item.price}</strong>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity('${item.id}', -1)">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            onclick="changeQuantity('${item.id}', 1)">
                            +
                        </button>

                        <button
                            class="remove-item"
                            onclick="removeItem('${item.id}')">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </div>

            `;


            cartItems.appendChild(cartItem);

        });

    }


    updateCartTotal();

}


/* =====================================
   CHANGE QUANTITY
===================================== */

function changeQuantity(id, change) {

    const product =
        cart.find(item => item.id === id);


    if (!product) {
        return;
    }


    product.quantity += change;


    if (product.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== id);

    }


    saveCart();
    displayCart();

}


/* =====================================
   REMOVE ITEM
===================================== */

function removeItem(id) {

    cart =
        cart.filter(item => item.id !== id);

    saveCart();
    displayCart();

    showToast("Item removed from cart.");

}


/* =====================================
   UPDATE CART TOTAL
===================================== */

function updateCartTotal() {

    let total = 0;
    let count = 0;


    cart.forEach(function (item) {

        total += item.price * item.quantity;

        count += item.quantity;

    });


    cartTotal.textContent =
        "₹" + total;


    cartCount.textContent =
        count;

}


/* =====================================
   SAVE CART
===================================== */

function saveCart() {

    localStorage.setItem(
        "greenleafCart",
        JSON.stringify(cart)
    );

}


/* Display cart when page loads */

displayCart();


/* =====================================
   TOAST MESSAGE
===================================== */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


let toastTimer;


function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);

}


/* =====================================
   REVIEW SLIDER
===================================== */

const reviews = [

    {
        text:
            "The plants were fresh and beautifully packed. I really loved the quality and delivery service.",

        name: "Priya Sharma",

        location: "Hyderabad",

        initial: "P"

    },

    {
        text:
            "GreenLeaf helped me choose the perfect indoor plants for my room. The service was excellent!",

        name: "Rahul Kumar",

        location: "Secunderabad",

        initial: "R"

    },

    {
        text:
            "Amazing collection of plants at reasonable prices. I will definitely shop here again.",

        name: "Ananya Reddy",

        location: "Hyderabad",

        initial: "A"

    }

];


let currentReview = 0;


const reviewText =
    document.getElementById("reviewText");

const reviewName =
    document.getElementById("reviewName");

const reviewLocation =
    document.getElementById("reviewLocation");

const userAvatar =
    document.getElementById("userAvatar");

const dots =
    document.querySelectorAll(".dot");


function showReview(index) {

    const review =
        reviews[index];


    reviewText.textContent =
        review.text;

    reviewName.textContent =
        review.name;

    reviewLocation.textContent =
        review.location;

    userAvatar.textContent =
        review.initial;


    dots.forEach(function (dot, i) {

        dot.classList.toggle(
            "active",
            i === index
        );

    });

}


document.getElementById("nextReview")
    .addEventListener("click", function () {

        currentReview++;

        if (currentReview >= reviews.length) {
            currentReview = 0;
        }

        showReview(currentReview);

    });


document.getElementById("previousReview")
    .addEventListener("click", function () {

        currentReview--;

        if (currentReview < 0) {
            currentReview = reviews.length - 1;
        }

        showReview(currentReview);

    });


/* =====================================
   SERVICE BOOKING
===================================== */

const serviceButtons =
    document.querySelectorAll(".service-btn");


serviceButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const service =
            button.dataset.service;


        document.getElementById("message").value =
            "I would like to book the " +
            service +
            ".";


        document.getElementById("contact")
            .scrollIntoView({
                behavior: "smooth"
            });


        showToast(
            "Please fill the contact form."
        );

    });

});


/* =====================================
   CONTACT FORM VALIDATION
===================================== */

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const message =
        document.getElementById("message").value.trim();


    const nameError =
        document.getElementById("nameError");

    const emailError =
        document.getElementById("emailError");

    const phoneError =
        document.getElementById("phoneError");

    const messageError =
        document.getElementById("messageError");


    /* Clear errors */

    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    messageError.textContent = "";


    let valid = true;


    /* Name validation */

    if (name === "") {

        nameError.textContent =
            "Please enter your name.";

        valid = false;

    }


    /* Email validation */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (email === "") {

        emailError.textContent =
            "Please enter your email.";

        valid = false;

    } else if (!emailPattern.test(email)) {

        emailError.textContent =
            "Please enter a valid email.";

        valid = false;

    }


    /* Phone validation */

    const phonePattern =
        /^[0-9]{10}$/;


    if (phone === "") {

        phoneError.textContent =
            "Please enter your phone number.";

        valid = false;

    } else if (!phonePattern.test(phone)) {

        phoneError.textContent =
            "Phone number must contain 10 digits.";

        valid = false;

    }


    /* Message validation */

    if (message === "") {

        messageError.textContent =
            "Please enter your message.";

        valid = false;

    }


    /* Successful submission */

    if (valid) {

        showToast(
            "Thank you! Your message has been sent."
        );


        contactForm.reset();

    }

});


/* =====================================
   CHECKOUT
===================================== */

const checkoutBtn =
    document.getElementById("checkoutBtn");


checkoutBtn.addEventListener("click", function () {

    if (cart.length === 0) {

        showToast("Your cart is empty!");

        return;

    }


    showToast(
        "Order placed successfully! 🌱"
    );


    cart = [];

    saveCart();

    displayCart();

});


/* =====================================
   NAVBAR ACTIVE SECTION
===================================== */

window.addEventListener("scroll", function () {

    const sections =
        document.querySelectorAll("section[id]");

    const scrollPosition =
        window.scrollY + 100;


    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        const sectionId =
            section.getAttribute("id");


        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            document
                .querySelectorAll(".nav-links a")
                .forEach(function (link) {

                    link.classList.remove("active");

                });


            const activeLink =
                document.querySelector(
                    `.nav-links a[href="#${sectionId}"]`
                );


            if (activeLink) {

                activeLink.classList.add("active");

            }

        }

    });

});