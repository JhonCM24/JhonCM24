const products = [
  {
    id: 1,
    name: "Serum Vitamina C",
    description: "Ilumina y unifica el tono con activos antioxidantes.",
    price: 78000,
    category: "Serums",
    skinType: "Todo tipo",
    featured: true,
  },
  {
    id: 2,
    name: "Crema de Rosas",
    description: "Nutrición profunda con extracto de rosas y karité.",
    price: 92000,
    category: "Hidratantes",
    skinType: "Seca",
    featured: true,
  },
  {
    id: 3,
    name: "Gel Calmante Aloe",
    description: "Reduce rojeces y refresca pieles sensibles.",
    price: 65000,
    category: "Hidratantes",
    skinType: "Sensible",
    featured: false,
  },
  {
    id: 4,
    name: "Mascarilla Detox Arcilla",
    description: "Limpieza profunda y control de brillo.",
    price: 54000,
    category: "Mascarillas",
    skinType: "Grasa",
    featured: false,
  },
  {
    id: 5,
    name: "Aceite Facial Nocturno",
    description: "Repara la barrera cutánea con omegas esenciales.",
    price: 88000,
    category: "Aceites",
    skinType: "Mixta",
    featured: true,
  },
  {
    id: 6,
    name: "Bruma Hidratante",
    description: "Reaplica hidratación durante el día.",
    price: 45000,
    category: "Brumas",
    skinType: "Todo tipo",
    featured: false,
  },
];

const formatPrice = (value) =>
  value.toLocaleString("es-CO", { style: "currency", currency: "COP" });

const state = {
  search: "",
  category: "Todos",
  sort: "featured",
  skinType: "Todos",
  cart: new Map(),
};

const productGrid = document.getElementById("productGrid");
const categorySelect = document.getElementById("category");
const skinTypeSelect = document.getElementById("skinType");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const cart = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const subtotal = document.getElementById("subtotal");
const formNote = document.getElementById("formNote");

const uniqueOptions = (items, key) =>
  ["Todos", ...new Set(items.map((item) => item[key]))];

const renderSelect = (select, options) => {
  select.innerHTML = options
    .map((option) => `<option value="${option}">${option}</option>`)
    .join("");
};

const getFilteredProducts = () => {
  let filtered = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(state.search.toLowerCase());
    const matchesCategory =
      state.category === "Todos" || product.category === state.category;
    const matchesSkin =
      state.skinType === "Todos" || product.skinType === state.skinType;
    return matchesSearch && matchesCategory && matchesSkin;
  });

  if (state.sort === "price-asc") {
    filtered = filtered.sort((a, b) => a.price - b.price);
  }

  if (state.sort === "price-desc") {
    filtered = filtered.sort((a, b) => b.price - a.price);
  }

  if (state.sort === "featured") {
    filtered = filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return filtered;
};

const renderProducts = () => {
  const filtered = getFilteredProducts();
  if (filtered.length === 0) {
    productGrid.innerHTML =
      '<p class="muted">No encontramos productos con esos filtros.</p>';
    return;
  }

  productGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card">
        <div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="product-meta">
          <span class="badge">${product.category}</span>
          <span class="badge">${product.skinType}</span>
        </div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-actions">
          <button class="ghost" data-action="details" data-id="${product.id}">Ver detalles</button>
          <button class="primary" data-action="add" data-id="${product.id}">Agregar</button>
        </div>
      </article>
    `
    )
    .join("");
};

const openCart = () => {
  cart.classList.add("open");
  overlay.classList.add("show");
};

const closeCart = () => {
  cart.classList.remove("open");
  overlay.classList.remove("show");
};

const updateCartSummary = () => {
  let total = 0;
  let count = 0;

  cartItems.innerHTML = "";

  state.cart.forEach((quantity, id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    total += product.price * quantity;
    count += quantity;

    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <h4>${product.name}</h4>
      <span>${formatPrice(product.price)}</span>
      <div class="cart-item-controls">
        <button data-action="decrease" data-id="${id}">-</button>
        <strong>${quantity}</strong>
        <button data-action="increase" data-id="${id}">+</button>
        <button data-action="remove" data-id="${id}">Eliminar</button>
      </div>
    `;
    cartItems.appendChild(item);
  });

  subtotal.textContent = formatPrice(total);
  cartCount.textContent = count;
};

const addToCart = (id) => {
  const current = state.cart.get(id) ?? 0;
  state.cart.set(id, current + 1);
  updateCartSummary();
  openCart();
};

const updateQuantity = (id, delta) => {
  const current = state.cart.get(id) ?? 0;
  const next = current + delta;
  if (next <= 0) {
    state.cart.delete(id);
  } else {
    state.cart.set(id, next);
  }
  updateCartSummary();
};

const removeFromCart = (id) => {
  state.cart.delete(id);
  updateCartSummary();
};

const showDetails = (id) => {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  alert(
    `${product.name}\n\n${product.description}\n\nIdeal para: ${product.skinType}`
  );
};

const handleProductAction = (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "add") addToCart(id);
  if (action === "details") showDetails(id);
};

const handleCartAction = (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") updateQuantity(id, 1);
  if (action === "decrease") updateQuantity(id, -1);
  if (action === "remove") removeFromCart(id);
};

categorySelect.addEventListener("change", (event) => {
  state.category = event.target.value;
  renderProducts();
});

skinTypeSelect.addEventListener("change", (event) => {
  state.skinType = event.target.value;
  renderProducts();
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

productGrid.addEventListener("click", handleProductAction);
cartItems.addEventListener("click", handleCartAction);

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("scrollProducts").addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("openConsultation").addEventListener("click", () => {
  document.getElementById("consultationForm").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("kitButton").addEventListener("click", () => {
  addToCart(1);
  addToCart(2);
  addToCart(4);
});

const consultationForm = document.getElementById("consultationForm");
consultationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = consultationForm.name.value.trim();
  formNote.textContent = `Gracias ${name || "por escribirnos"}. En breve te contactamos.`;
  consultationForm.reset();
});

const init = () => {
  renderSelect(categorySelect, uniqueOptions(products, "category"));
  renderSelect(skinTypeSelect, uniqueOptions(products, "skinType"));
  renderProducts();
  updateCartSummary();
};

init();
