console.log('====================================');
console.log("Connected");
console.log('====================================');

const tabs = document.querySelectorAll('.tab');
const productWrapper = document.querySelector('.product-wrapper');

// Fetch product data
fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
  .then(response => response.json())
  .then(data => {
    renderProducts(data.categories.find(cat => cat.category_name === "Men").category_products);
})
  .catch(error => {
    console.error('Error fetching products:', error);
  });

function renderProducts(products) {
  productWrapper.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    let productContent = `
      <img src="${product.image}" alt="${product.title}">`;

    if (product.badge_text) {
      productContent += `<span class="product-badge">${product.badge_text}</span>`;
    }

    let productTitle = product.title;

    // Check if title length is greater than 9 characters
    if (productTitle.length > 10) {
      productTitle = productTitle.substring(0, 9) + "..";
    }

    productContent += `
    <div class="product-main-heading">
        <span class="product-title">${productTitle}</span>
        <span class="product-title-dot"> ⚫ </span>
        <span class="vendor">${product.vendor}</span>
    </div>
      
      <div class="product-details">`;

    if (product.compare_at_price) {
      const discount = calculateDiscount(product.price, product.compare_at_price);
      productContent += `
        <span class="price">₹${product.price}</span>
        <span class="compare-at-price">₹${product.compare_at_price}</span>`;
      if (discount > 0) {
        productContent += `<span class="discount">${discount}% Off</span>`;
      }
    } else {
      productContent += `<span class="price">₹${product.price}</span>`;
    }

    productContent += `
      </div>
      <button class="product-button">Add to Cart</button>`;

    productCard.innerHTML = productContent;
    productWrapper.appendChild(productCard);
  });
}

function calculateDiscount(price, compareAtPrice) {
  const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
  return Math.floor(discount); // Round to two decimal places
}

tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    const category = this.dataset.category;
    filterProducts(category);
  });
});

function filterProducts(category) {
  // Filter products based on category and re-render
  fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
    .then(response => response.json())
    .then(data => {
      const filteredProducts = data.categories.find(cat => cat.category_name === category).category_products;
      renderProducts(filteredProducts);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
}
