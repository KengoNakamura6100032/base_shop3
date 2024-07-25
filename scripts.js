document.addEventListener('DOMContentLoaded', function () {
    // カート機能
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartCount() {
        var itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        var cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.innerText = itemCount;
        }
    }

    updateCartCount(); // どのページでもカートのカウントを更新

    if (document.querySelector('.product-list')) {
        // ホームページの処理
        var addToCartBtns = document.querySelectorAll('.addToCartBtn');

        addToCartBtns.forEach(function (btn) {
            btn.onclick = function () {
                var product = btn.getAttribute('data-product');
                var price = parseInt(btn.getAttribute('data-price'));
                var item = cart.find(item => item.product === product);
                if (item) {
                    item.quantity++;
                } else {
                    cart.push({ product: product, price: price, quantity: 1 });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('カートに追加しました');
                updateCartCount();
            }
        });
    }

    if (document.querySelector('.cart-items')) {
        // カートページの処理
        var cartItemsContainer = document.querySelector('.cart-items');
        var cartTotalAmount = document.getElementById('cart-total-amount');
        var checkoutBtn = document.getElementById('checkoutBtn');

        function updateCart() {
            cartItemsContainer.innerHTML = '';
            var totalAmount = 0;
            cart.forEach(function (item) {
                var cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <h3>${item.product}</h3>
                    <p>価格: ¥${item.price}</p>
                    <p>数量: 
                        <input type="number" value="${item.quantity}" min="1" data-product="${item.product}" class="quantityInput">
                    </p>
                    <p>小計: ¥${item.price * item.quantity}</p>
                `;
                cartItemsContainer.appendChild(cartItem);
                totalAmount += item.price * item.quantity;
            });
            cartTotalAmount.innerText = `¥${totalAmount}`;
        }

        updateCart();

        cartItemsContainer.addEventListener('change', function (e) {
            if (e.target.classList.contains('quantityInput')) {
                var product = e.target.getAttribute('data-product');
                var quantity = parseInt(e.target.value);
                var item = cart.find(item => item.product === product);
                if (item) {
                    item.quantity = quantity;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        });

        checkoutBtn.onclick = function () {
            alert('お買い上げありがとうございます！');
            // ここで購入手続きの処理を実装
            cart = [];
            localStorage.removeItem('cart'); // ローカルストレージからカートを削除
            updateCart(); // カート表示を更新
            updateCartCount(); 
        }
    }
});
