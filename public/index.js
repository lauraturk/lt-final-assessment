const renderItems = (inventoryItems) => {
  const itemsToPrint = inventoryItems.map((item) => {
    return `<div class="item-card" data-id="${item.id}"
              data-title="${item.item_title}"
              data-price="${item.item_price}">
            <h4>${item.item_title}</h4>
            <img src=${item.item_image}>
            <p>${item.item_description}</p>
            <p>$${item.item_price}</p>
            <button class="addBtn">add to cart</button>
            </div>`
});
return itemsToPrint
};

const renderOrderHistory = (orders) => {
  $("#order-history").empty();

  const historyToPrint = orders.map((order) => {
    const cleanDate = order.order_date.slice(0,10);
    return `<li>$${order.order_total} on ${cleanDate}</li>`
  });
  return historyToPrint
};

const clearCart = () => {
  $("#cart-list").empty();
  localStorage.removeItem("Cart");
  setCartDetails();
};

const retrieveItems = () => {
  fetch('/api/v1/inventory', {
    method: 'GET'
  })
  .then(data => data.json())
  .then(itemData => {
    $("#inventory-holder").append(renderItems(itemData));
  })
  .catch(error => console.log(error));
};

const retrieveOrders = () => {
  fetch('/api/v1/orders', {
    method: 'GET'
  })
  .then(data => data.json())
  .then(orderData => {
    $("#order-history").append(renderOrderHistory(orderData));
  })
}

const orderItems = (body) => {
  fetch('/api/v1/orders', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
  .then(data => data.json())
  .then(orderData => {
    clearCart();
    retrieveOrders();
  });
}

const setCartDetails = () => {
  const cart = JSON.parse(localStorage.getItem("Cart"))

  if (!cart) {
    $('.cart-total').text(`$0.00`);

    $('.cart-number').text(0);
  } else {
    const cartNumber = cart.length

    const cartTotal = cart.reduce((sum, value) => {
      return sum + parseInt(value.price);
    }, 0)

    $('.cart-total').text(`$${cartTotal}.00`);

    $('.cart-number').text(cartNumber);
  }
}

const addToCart = (selectedItem) => {
  if(!localStorage.length){
    const myCart = JSON.stringify([selectedItem]);
    localStorage.setItem("Cart", myCart);
  } else {
    const currentCart = localStorage.getItem("Cart");
    const parsedCart = JSON.parse(currentCart);

    parsedCart.push((selectedItem));

    localStorage.setItem("Cart", JSON.stringify(parsedCart));
  }
 setCartDetails();
};

const showBox = (box) => {
  $(`#${box}`).children().not('.cart-number, svg').toggleClass("show")
};

const showOrder = () => {
  retrieveOrders();
};

const showCart = () => {
  $("#cart-list").empty();

  const listItems = JSON.parse(localStorage.getItem("Cart"));

  if(listItems) {
    const printList = listItems.map((item) => {
      return `<li>${item.title} @ ${item.price}</li>`
    })

    $("#cart-list").append(printList);
  }
};

$('#inventory-holder').on('click', '.item-card', function(e){
  addToCart(e.currentTarget.dataset);
});

$('#order-toggle').on('click', (e) => {
  showBox(e.currentTarget.id);
  showOrder()
});

$('#cart-toggle').on('click', (e) =>  {
  showBox(e.currentTarget.id);
  showCart()
});

$('#buy-btn').on('click', () => {
  const cart = JSON.parse(localStorage.getItem("Cart"))

  const cartTotal = cart.reduce((sum, value) => {
    return sum + parseInt(value.price);
  }, 0)

  orderItems({order_total: cartTotal})
});

$(document).ready(() => {
  if(localStorage.length > 0){
    setCartDetails();
  }
  return retrieveItems();
});
