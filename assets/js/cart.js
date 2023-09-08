function ToProductPage() {
    window.location.href = "product.html";
}

function ToPayPage() {
    window.location.href = "pay.html";
}

function ToCartPage() {
    window.location.href = "cart.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const cartTable = document.querySelector('.cart__table table');
    const cartTableBody = cartTable.querySelector('tbody');
    const moneyTotal = document.querySelector('.money__total');
    const moneyVat = document.querySelector('.money__vat');
    const moneyPay = document.querySelector('.money__pay');

    function calculateTotal(cartData) {
        let total = 0;
        cartData.forEach((cartItem) => {
            if(cartItem.status == "cart"){
                total += cartItem.quantity * cartItem.productPrice;
            }
        });

        const vat = total * 0.1;
        const pay = total + vat;

        moneyTotal.textContent = total.toLocaleString('vi-VN') + ' Đ';
        moneyVat.textContent = vat.toLocaleString('vi-VN') + ' Đ';
        moneyPay.textContent = pay.toLocaleString('vi-VN') + ' Đ';
    }

    function displayCartItems(cartData) {
        cartTableBody.innerHTML = '';

        cartData.forEach((cartItem, index) => {
            if(cartItem.status === "cart") {
                const newRow = document.createElement('tr');
            const totalMoney = cartItem.quantity * cartItem.productPrice;
            newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <img src="${cartItem.productPicture}" alt="">
                </td>
                <td>${cartItem.productName}</td>
                <td class="row-price">${cartItem.productPrice.toLocaleString('vi-VN')} Đ</td>
                <td>
                    <input type="number" class="row-quantity" value="${cartItem.quantity}" min="1" data-cart-id="${cartItem.id}">
                </td>
                <td class="row-total">${totalMoney.toLocaleString('vi-VN')} Đ</td>
                <td>
                    <button type="button" class="row-delete" data-cart-id="${cartItem.id}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            `;

            cartTableBody.appendChild(newRow);
            }
        });

        calculateTotal(cartData);

        const deleteButtons = document.querySelectorAll('.row-delete');
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener('click', function () {
                const cartId = this.getAttribute('data-cart-id');
                deleteCartItem(cartId);
            });
        });

        const quantityInputs = document.querySelectorAll('.row-quantity');
        quantityInputs.forEach((quantityInput) => {
            quantityInput.addEventListener('input', function () {
                const cartId = this.getAttribute('data-cart-id');
                const newQuantity = parseInt(this.value, 10);
                updateCartItemQuantity(cartId, newQuantity);
            });
        });
    }

    function deleteCartItem(cartId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:3000/carts/${cartId}`, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 204) {
                    fetchCartItems();
                } else {
                    console.error('Lỗi khi xóa mục trong giỏ hàng' + xhr.status);
                }
            }
        };

        xhr.send();
    }

    function updateCartItemQuantity(cartId, newQuantity) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://localhost:3000/carts/${cartId}`, true);
    
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const cartItem = JSON.parse(xhr.responseText);
                    cartItem.quantity = newQuantity;

                    const putXHR = new XMLHttpRequest();
                    putXHR.open('PUT', `http://localhost:3000/carts/${cartId}`, true);
                    putXHR.setRequestHeader('Content-Type', 'application/json');
    
                    putXHR.onreadystatechange = function () {
                        if (putXHR.readyState === 4) {
                            if (putXHR.status === 200) {
                                fetchCartItems(); 
                            } else {
                                console.error('Lỗi khi cập nhật số lượng trong giỏ hàng' + putXHR.status);
                            }
                        }
                    };
    
                    putXHR.send(JSON.stringify(cartItem)); 
                } else {
                    console.error('Lỗi khi lấy thông tin sản phẩm trong giỏ hàng' + xhr.status);
                }
            }
        };
    
        xhr.send();
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
})


document.addEventListener("DOMContentLoaded", function () {
    const cartDropdown = document.querySelector('.cart-dropdown__content');
    const cartList = cartDropdown.querySelector('.cart-dropdown__list');
    const totalPay = document.querySelector('.cart-dropdown__total-money');

    function calculateTotal(cartData) {
        let total = 0;
        cartData.forEach((cartItem) => {
            if(cartItem.status=="cart")
            {
                total += cartItem.quantity * cartItem.productPrice;
            }
        });

        total = total + 0.1*total;

        totalPay.textContent = total.toLocaleString('vi-VN') + ' Đ';
    
    }

    function displayCartItems(cartData) {
        cartList.innerHTML = '';
        let cartItemCount = 0;
        cartData.forEach((cartItem, index) => {
            if(cartItem.status == "cart"){
                const cartItemElement = document.createElement('li');
                cartItemCount++;
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
                        <button type="button" class="delete-btn" data-cart-id="${cartItem.id}">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            `;

            cartList.appendChild(cartItemElement);
            }
        });

        updateCartItemCount(cartItemCount);

        calculateTotal(cartData);
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener('click', function() {
                const cartId = this.getAttribute('data-cart-id');
                deleteCartItem(cartId);
            })
        })
    }

    function deleteCartItem(cartId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:3000/carts/${cartId}`, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 204) {
                    fetchCartItems();
                } else {
                    console.error('Lỗi khi xóa mục trong giỏ hàng' + xhr.status);
                }
            }
        };

        xhr.send();
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

    function updateCartItemCount(count) {
        cartItemCount = count;
        const cartItemCountElement = document.getElementById("cart-item-product");
        cartItemCountElement.textContent = count;
    }

    fetchCartItems();

    const cartDropdownToggle = cartDropdown.querySelector('.cart-dropdown__toggle');
    cartDropdownToggle.addEventListener('click', function () {
        cartList.classList.toggle('show'); 
    });
});



