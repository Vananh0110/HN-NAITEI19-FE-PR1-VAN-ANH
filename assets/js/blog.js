var currentPage = 1;
var itemsPerPage = 4;

var products = document.querySelectorAll(".blog__item");

var totalPages = Math.ceil(products.length / itemsPerPage);

var pageNumbers = document.getElementById("page-numbers");

for (var i = 1; i <= totalPages; i++) {
    var pageNumber = document.createElement("button");
    pageNumber.textContent = i;
    pageNumber.classList.add("page-number");
    pageNumbers.appendChild(pageNumber);

    pageNumber.addEventListener("click", function () {
        currentPage = parseInt(this.textContent);
        updateProductDisplay(currentPage, itemsPerPage);
    });
}

document.getElementById("previous-blog-button").addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        updateProductDisplay(currentPage, itemsPerPage);
    }
});

document.getElementById("next-blog-button").addEventListener("click", function () {
    if (currentPage < totalPages) {
        currentPage++;
        updateProductDisplay(currentPage, itemsPerPage);
    }
});

function updateProductDisplay(currentPage, itemsPerPage) {
    for (var i = 0; i < products.length; i++) {
        if (i >= (currentPage - 1) * itemsPerPage && i < currentPage * itemsPerPage) {
            products[i].style.display = "block";
        } else {
            products[i].style.display = "none";
        }
    }

    var pageButtons = document.querySelectorAll(".page-number"); 
    for (var i = 0; i < pageButtons.length; i++) {
        pageButtons[i].classList.remove("active-page-btn");
    }

    pageButtons[currentPage - 1].classList.add("active-page-btn");
}

updateProductDisplay(currentPage, itemsPerPage);


function ToPayPage() {
    window.location.href = "pay.html";
}

function ToCartPage() {
    window.location.href = "cart.html";
}


function goBackToHomePage() {
    window.location.href = "index.html";
}

function goToRegisterPage() {
    window.location.href = "register.html";
}


document.addEventListener("DOMContentLoaded", function () {
    const cartDropdown = document.querySelector('.cart-dropdown__content');
    const cartList = cartDropdown.querySelector('.cart-dropdown__list');
    const totalPay = document.querySelector('.cart-dropdown__total-money');

    function calculateTotal(cartData) {
        let total = 0;
        cartData.forEach((cartItem) => {
            total += cartItem.quantity * cartItem.productPrice;
        });

        total = total + 0.1*total;

        totalPay.textContent = total.toLocaleString('vi-VN') + ' Đ';
    
    }

    function displayCartItems(cartData) {
        cartList.innerHTML = '';

        cartData.forEach((cartItem, index) => {
            const cartItemElement = document.createElement('li');
            cartItemElement.innerHTML = `
                <div class="cart-dropdown__item">
                    <div class="cart-item__img">
                        <img src="${cartItem.productPicture}" alt="">
                    </div>
                    <div class="cart-item__content">
                        <div class="cart-item__name">
                            ${cartItem.productName}
                        </div>
                        <div class="cart-item__total">
                            <span class="cart-item__quantity">${cartItem.quantity} x </span>
                            <span class="cart-item__price">${cartItem.productPrice} Đ</span>
                        </div>
                    </div>
                    <div class="cart-item__button">
                        <button type="button">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            `;

            cartList.appendChild(cartItemElement);
        });

        calculateTotal(cartData);
    }

    function fetchCartItems() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/carts', true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const cartData = JSON.parse(xhr.responseText);
                displayCartItems(cartData);
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                console.error('Lỗi khi gọi API giỏ hàng');
            }
        };

        xhr.send();
    }

    fetchCartItems();

    const cartDropdownToggle = cartDropdown.querySelector('.cart-dropdown__toggle');
    cartDropdownToggle.addEventListener('click', function () {
        cartList.classList.toggle('show'); 
    });
});



