// app.js - Main Application Logic for FarslyWeb

// Global State
window.FarslyState = {
  cart: JSON.parse(localStorage.getItem('farsly_cart')) || [],
  favorites: JSON.parse(localStorage.getItem('farsly_favorites')) || [],
  user: JSON.parse(localStorage.getItem('farsly_user')) || null,
  membership: JSON.parse(localStorage.getItem('farsly_membership')) || {
    tier: 'basic',
    points: 0,
    joined: true
  }
};

let currentShoppingTab = 'cart';

window.FarslyBuild = {
  currentStep: 0,
  selections: {
    base: null,
    protein: [],
    toppings: [],
    sauce: null,
    extras: []
  }
};

// Setup scroll observer for sticky header and reveal animations
function initScrollEffects() {
  const header = document.getElementById('site-header');
  const reveals = document.querySelectorAll('.reveal');

  // Sticky header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Reveal animations on scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: stop observing once revealed
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => revealObserver.observe(reveal));

  // Trigger immediately for items already in view
  setTimeout(() => {
    reveals.forEach(reveal => {
      const rect = reveal.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        reveal.classList.add('visible');
      }
    });
  }, 100);
}

// Mobile Menu Toggle
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

// Update UI based on auth state
function updateAuthUI() {
  const authContainer = document.getElementById('nav-auth-container');
  if (!authContainer) return;

  if (window.FarslyState.user) {
    authContainer.innerHTML = `
      <div class="nav-user">
        <button class="nav-user-btn">
          <div class="nav-user-avatar">${window.FarslyState.user.name.charAt(0)}</div>
          <span>${window.FarslyState.user.name.split(' ')[0]}</span>
        </button>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <a href="#/auth" class="btn btn-secondary btn-sm">Log in</a>
      <a href="#/auth" class="btn btn-primary btn-sm">Sign up</a>
    `;
  }
}

// Simple router to handle navigation state visualization
// (Since we are only focusing on the homepage right now, we won't implement a full SPA router)
function updateNavLinks() {
  const hash = window.location.hash || '#/';
  document.querySelectorAll('.nav-link, .mobile-nav-link, .mobile-tab').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === hash) {
      link.classList.add('active');
    }
  });
}

// ---------------------------------------------------------
// SPA VIEW ROUTER
// ---------------------------------------------------------
function renderRoute() {
  const hash = window.location.hash || '#/';

  // Hide all pages first
  const views = document.querySelectorAll('#app-root > .page');

  views.forEach(view => {
    view.classList.remove('active');
    view.style.display = 'none';
  });

  let targetView;

  // =========================
  // HOME
  // =========================
  if (hash === '#/' || hash === '') {
    targetView = document.getElementById('view-home');
  }

  // =========================
  // MENU
  // =========================
  else if (hash === '#/menu') {
    targetView = document.getElementById('view-menu');
  }

  // =========================
  // CART
  // =========================
  else if (hash === '#/cart') {
    targetView = document.getElementById('view-cart');

    if (typeof renderShoppingPage === 'function') {
      renderShoppingPage('cart');
    }
  }

  // =========================
  // FAVORITES
  // =========================
  else if (hash === '#/favorites') {
    targetView = document.getElementById('view-cart');

    if (typeof renderShoppingPage === 'function') {
      renderShoppingPage('favorites');
    }
  }

  // =========================
  // FOOD DETAIL
  // =========================
  else if (hash.startsWith('#/menu/')) {
    targetView = document.getElementById('view-food-detail');

    const itemId = hash.split('/')[2];

    if (itemId && typeof renderFoodDetail === 'function') {
      renderFoodDetail(itemId);
    }
  }

  // =========================
  // BUILD YOUR BOWL
  // =========================
  else if (hash === '#/build') {
    targetView = document.getElementById('view-build');

    if (typeof renderBuildPage === 'function') {
      renderBuildPage();
    }

    if (typeof bindBuildStepButtons === 'function') {
      bindBuildStepButtons();
    }
  }

  // =========================
  // MEMBERSHIP
  // =========================
  else if (hash === '#/membership') {
    targetView = document.getElementById('view-membership');

    if (typeof renderMembershipPage === 'function') {
      renderMembershipPage();
    }

    if (typeof renderMembershipPlans === 'function') {
      renderMembershipPlans();
    }
  }

  // =========================
  // CHECKOUT
  // =========================
  else if (hash === '#/checkout') {
    targetView = document.getElementById('view-checkout');

    if (typeof renderCheckoutPage === 'function') {
      renderCheckoutPage();
    }
  }

  // =========================
  // ORDER CONFIRMATION
  // =========================
  else if (hash === '#/confirmation') {

    targetView =
      document.getElementById('view-order-confirmation');

    if (typeof renderOrderConfirmation === 'function') {
      renderOrderConfirmation();
    }

  }

  // =========================
  // ORDER TRACKING
  // =========================
  else if (hash === '#/track') {

    targetView =
      document.getElementById('view-track');

  }

  // =========================
  // FALLBACK
  // =========================
  else {
    targetView = document.getElementById('view-home');
  }

  // =========================
  // SHOW TARGET PAGE
  // =========================
  if (targetView) {
    targetView.style.display = 'block';

    requestAnimationFrame(() => {
      targetView.classList.add('active');
    });

    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  } else {
    console.warn(`Route "${hash}" has no matching page element.`);
  }

  updateNavLinks();
}
// ---------------------------------------------------------
// MENU — RENDERING & FILTERING
// ---------------------------------------------------------
function initMenu() {
  const menuGrid = document.getElementById('menu-grid');
  const searchInput = document.getElementById('menu-search');
  const searchClear = document.getElementById('menu-search-clear');
  const categoryContainer = document.getElementById('menu-categories');
  const resultCount = document.getElementById('menu-result-count');
  const resultTitle = document.getElementById('menu-result-title');
  const emptyState = document.getElementById('menu-empty');
  const resetButton = document.getElementById('menu-reset');

  if (!menuGrid) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function getFilteredItems() {
    return MENU_ITEMS.filter(item => {
      const matchesCategory =
        activeCategory === 'all' ||
        item.category === activeCategory;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(query)
        ) ||
        item.tags.some(tag =>
          tag.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }

  function renderCards() {
    const items = getFilteredItems();

    menuGrid.innerHTML = '';

    if (resultCount) {
      resultCount.textContent =
        `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
    }

    if (resultTitle) {
      if (searchQuery.trim()) {
        resultTitle.textContent = `Results for "${searchQuery.trim()}"`;
      } else if (activeCategory !== 'all') {
        const category = CATEGORIES.find(
          item => item.id === activeCategory
        );

        resultTitle.textContent =
          category ? category.name : 'Made fresh for you';
      } else {
        resultTitle.textContent = 'Made fresh for you';
      }
    }

    if (!items.length) {
      emptyState.hidden = false;
      menuGrid.style.display = 'none';
      return;
    }

    emptyState.hidden = true;
    menuGrid.style.display = '';

    items.forEach(item => {
      menuGrid.insertAdjacentHTML(
        'beforeend',
        createMenuCard(item)
      );
    });

    if (typeof paintIcons === 'function') {
      paintIcons(menuGrid);
    }

    bindMenuCardEvents();
  }

  function createMenuCard(item) {
    const isFavorite =
      window.FarslyState.favorites.includes(item.id);

    const badge = item.badge
      ? `<span class="menu-card-badge">${item.badge}</span>`
      : item.tags.includes('popular')
        ? `<span class="menu-card-badge">Popular</span>`
        : '';

    const ingredients = item.ingredients
      .slice(0, 4)
      .join(' · ');

    return `
      <article
        class="menu-card"
        data-item-id="${item.id}"
      >

        <div
          class="menu-card-visual"
          style="--item-color: ${item.color};"
        >

        <div class="menu-card-image">
          <img
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
          >
        </div>

          ${badge}

          <button
            type="button"
            class="menu-card-favorite ${isFavorite ? 'active' : ''}"
            data-action="favorite"
            data-item-id="${item.id}"
            aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
          >
            <span class="ico" data-icon="heart"></span>
          </button>

        </div>

        <div class="menu-card-body">

          <div class="menu-card-topline">
            <span class="menu-card-category">
              ${getCategoryName(item.category)}
            </span>

            <span class="menu-card-rating">
              ★ ${item.rating}
            </span>
          </div>

          <h3 class="menu-card-title">
            ${item.name}
          </h3>

          <p class="menu-card-description">
            ${item.description}
          </p>

          <div class="menu-card-ingredients">
            ${ingredients}
          </div>

          <div class="menu-card-nutrition">
            <span>${item.nutrition.cal} cal</span>
            <span>${item.nutrition.protein}g protein</span>
          </div>

          <div class="menu-card-footer">

            <strong class="menu-card-price">
              ${formatPrice(item.price)}
            </strong>

            <button
              type="button"
              class="menu-card-add"
              data-action="add"
              data-item-id="${item.id}"
            >
              Add to bag
              <span class="ico" data-icon="plus"></span>
            </button>

          </div>

        </div>

      </article>
    `;
  }

  function getCategoryName(categoryId) {
    const category = CATEGORIES.find(
      category => category.id === categoryId
    );

    return category ? category.name : categoryId;
  }

  function bindMenuCardEvents() {
    // Favorite button
    menuGrid.querySelectorAll('[data-action="favorite"]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const itemId = button.dataset.itemId;

        toggleFavorite(itemId);

        const isFavorite =
          window.FarslyState.favorites.includes(itemId);

        button.classList.toggle('active', isFavorite);

        button.setAttribute(
          'aria-label',
          isFavorite
            ? 'Remove from favorites'
            : 'Add to favorites'
        );
      });
    });

    // Add to bag button
    menuGrid.querySelectorAll('[data-action="add"]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        const itemId = button.dataset.itemId;

        addMenuItemToCart(itemId);
      });
    });

    // Card click → food detail
    menuGrid.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('click', () => {
        const itemId = card.dataset.itemId;

        window.location.hash = `#/menu/${itemId}`;
      });
    });
  }

  function toggleFavorite(itemId) {
    const favorites = window.FarslyState.favorites;

    const index = favorites.indexOf(itemId);

    if (index === -1) {
      favorites.push(itemId);
    } else {
      favorites.splice(index, 1);
    }

    localStorage.setItem(
      'farsly_favorites',
      JSON.stringify(favorites)
    );
  }

  function addMenuItemToCart(itemId) {
    const item = MENU_ITEMS.find(
      menuItem => menuItem.id === itemId
    );

    if (!item) return;

    const existingItem = window.FarslyState.cart.find(
      cartItem => cartItem.id === itemId
    );

    if (existingItem) {
      existingItem.quantity =
        (existingItem.quantity || 1) + 1;
    } else {
      window.FarslyState.cart.push({
        ...item,
        quantity: 1
      });
    }

    localStorage.setItem(
      'farsly_cart',
      JSON.stringify(window.FarslyState.cart)
    );

    updateCartBadge();

    if (typeof showToast === 'function') {
      showToast(`${item.name} added to your bag`);
    }
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');

    if (!badge) return;

    const totalQuantity =
      window.FarslyState.cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );

    badge.textContent = totalQuantity;
    badge.style.display =
      totalQuantity > 0 ? '' : 'none';
  }

  // Category buttons
  if (categoryContainer) {
    categoryContainer
      .querySelectorAll('.menu-category')
      .forEach(button => {
        button.addEventListener('click', () => {
          activeCategory = button.dataset.category;

          categoryContainer
            .querySelectorAll('.menu-category')
            .forEach(categoryButton => {
              categoryButton.classList.remove('active');
            });

          button.classList.add('active');

          renderCards();
        });
      });
  }

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      renderCards();
    });
  }

  // Clear search
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      renderCards();
      searchInput.focus();
    });
  }

  // Reset
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      activeCategory = 'all';
      searchQuery = '';

      searchInput.value = '';

      categoryContainer
        .querySelectorAll('.menu-category')
        .forEach(button => {
          button.classList.toggle(
            'active',
            button.dataset.category === 'all'
          );
        });

      renderCards();
    });
  }

  updateCartBadge();
  renderCards();
}

function renderShoppingPage(tab = 'cart') {
  currentShoppingTab = tab;

  const content = document.getElementById('shopping-content');
  const title = document.getElementById('shopping-page-title');
  const description = document.getElementById('shopping-page-description');

  if (!content) return;

  document.querySelectorAll('.shopping-tab').forEach(tabButton => {
    tabButton.classList.toggle(
      'active',
      tabButton.dataset.shoppingTab === tab
    );
  });

  const cartCount = window.FarslyState.cart.length;

  const favoriteCount = window.FarslyState.favorites.length;

  const cartCountElement =
    document.getElementById('cart-tab-count');

  const favoriteCountElement =
    document.getElementById('favorites-tab-count');

  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }

  if (favoriteCountElement) {
    favoriteCountElement.textContent = favoriteCount;
  }


  if (tab === 'favorites') {

    title.textContent = 'Favorites';

    description.textContent =
      'Your favorite Farsly bowls, saved for whenever you crave them.';

    renderFavoritesTab(content);

  } else {

    title.textContent = 'Your Bag';

    description.textContent =
      'Your carefully chosen meals, ready when you are.';

    renderCartTab(content);
  }
}

function renderCartTab(container) {

  const cart = window.FarslyState.cart;

  if (!cart.length) {

    container.innerHTML = `
      <div class="shopping-empty">

        <h2>Your bag is waiting.</h2>

        <p>
          Discover something fresh and delicious from our menu.
        </p>

        <button
          class="shopping-empty-button"
          id="empty-cart-menu-button"
        >
          Explore Menu →
        </button>

      </div>
    `;

    document
      .getElementById('empty-cart-menu-button')
      ?.addEventListener('click', () => {
        window.location.hash = '#/menu';
      });

    return;
  }


  const subtotal = cart.reduce((sum, item) => {

    const quantity = item.quantity || 1;

    return sum + (item.price * quantity);

  }, 0);


  container.innerHTML = `

    <div class="shopping-content-grid">

      <div class="shopping-items">

        ${cart.map((item, index) => `

          <article class="shopping-item">

            <img
              src="${item.image || 'assets/img/hero-bowl.png'}"
              alt="${item.name}"
              class="shopping-item-image"
            >

            <div class="shopping-item-info">

              <span class="shopping-item-category">
                ${item.category || 'Farsly Bowl'}
              </span>

              <h3 class="shopping-item-name">
                ${item.name}
              </h3>

              <p class="shopping-item-description">
                ${item.description || 'Freshly prepared with premium ingredients.'}
              </p>

              <span class="shopping-item-price">
                ${formatPrice(item.price)}
              </span>

              <button
                class="shopping-item-remove"
                data-remove-cart="${index}"
              >
                Remove
              </button>

            </div>

            <div class="shopping-item-controls">

              <button
                class="quantity-button"
                data-quantity-action="decrease"
                data-cart-index="${index}"
              >
                −
              </button>

              <span class="quantity-value">
                ${item.quantity || 1}
              </span>

              <button
                class="quantity-button"
                data-quantity-action="increase"
                data-cart-index="${index}"
              >
                +
              </button>

            </div>

          </article>

        `).join('')}

      </div>


      <aside class="shopping-summary">

        <div class="shopping-summary-label">
          Order Summary
        </div>

        <div class="shopping-summary-row">
          <span>Items</span>
          <span>${cart.length}</span>
        </div>

        <div class="shopping-summary-row">
          <span>Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </div>

        <div class="shopping-summary-total">
          <span>Total</span>
          <strong>${formatPrice(subtotal)}</strong>
        </div>

        <button
          class="shopping-checkout-button"
          id="shopping-checkout-button"
        >
          Continue to Checkout →
        </button>

      </aside>

    </div>
  `;


  bindCartInteractions();
}

function bindCartInteractions() {

  document.querySelectorAll('[data-remove-cart]')
    .forEach(button => {

      button.addEventListener('click', () => {

        const index =
          Number(button.dataset.removeCart);

        window.FarslyState.cart.splice(index, 1);

        localStorage.setItem(
          'farsly_cart',
          JSON.stringify(window.FarslyState.cart)
        );

        renderShoppingPage('cart');

        updateCartBadge?.();
      });

    });


  document.querySelectorAll('[data-quantity-action]')
    .forEach(button => {

      button.addEventListener('click', () => {

        const index =
          Number(button.dataset.cartIndex);

        const action =
          button.dataset.quantityAction;

        const item =
          window.FarslyState.cart[index];

        if (!item) return;

        item.quantity = item.quantity || 1;

        if (action === 'increase') {
          item.quantity++;
        }

        if (action === 'decrease') {
          item.quantity--;

          if (item.quantity <= 0) {
            window.FarslyState.cart.splice(index, 1);
          }
        }

        localStorage.setItem(
          'farsly_cart',
          JSON.stringify(window.FarslyState.cart)
        );

        renderShoppingPage('cart');

        updateCartBadge?.();

      });

    });


  document
    .getElementById('shopping-checkout-button')
    ?.addEventListener('click', () => {

      window.location.hash = '#/checkout';

    });
}

function renderFavoritesTab(container) {

  const favoriteIds = window.FarslyState.favorites;

  const favorites = MENU_ITEMS.filter(item =>
    favoriteIds.includes(item.id)
  );


  if (!favorites.length) {

    container.innerHTML = `
      <div class="shopping-empty">

        <h2>Nothing saved yet.</h2>

        <p>
          Tap the heart on any Farsly bowl to keep it here for later.
        </p>

        <button
          class="shopping-empty-button"
          id="empty-favorites-menu-button"
        >
          Discover Bowls →
        </button>

      </div>
    `;

    document
      .getElementById('empty-favorites-menu-button')
      ?.addEventListener('click', () => {
        window.location.hash = '#/menu';
      });

    return;
  }


  container.innerHTML = `

    <div class="favorite-grid">

      ${favorites.map(item => `

        <article class="favorite-card">

          <img
            src="${item.image}"
            alt="${item.name}"
            class="favorite-card-image"
          >

          <div class="favorite-card-body">

            <h3>
              ${item.name}
            </h3>

            <p>
              ${item.description || 'Fresh, premium ingredients.'}
            </p>

            <div class="favorite-card-footer">

              <span class="favorite-card-price">
                ${formatPrice(item.price)}
              </span>

              <button
                class="favorite-add-button"
                data-favorite-add="${item.id}"
              >
                Add to Bag
              </button>

            </div>

          </div>

        </article>

      `).join('')}

    </div>
  `;


  document
    .querySelectorAll('[data-favorite-add]')
    .forEach(button => {

      button.addEventListener('click', () => {

        const itemId = button.dataset.favoriteAdd;

        const item = MENU_ITEMS.find(
          menuItem => menuItem.id === itemId
        );

        if (!item) return;

        const existing =
          window.FarslyState.cart.find(
            cartItem => cartItem.id === item.id
          );

        if (existing) {
          existing.quantity =
            (existing.quantity || 1) + 1;
        } else {
          window.FarslyState.cart.push({
            ...item,
            quantity: 1
          });
        }

        localStorage.setItem(
          'farsly_cart',
          JSON.stringify(window.FarslyState.cart)
        );

        showToast(
          'Added to your bag',
          `${item.name} is ready for checkout.`
        );

        updateCartBadge?.();

      });

    });
}

function initShoppingNav() {

  const navActions = document.querySelectorAll('.nav-action');

  navActions.forEach(button => {

    const label = button.getAttribute('aria-label');

    if (label === 'Favorites') {
      button.addEventListener('click', () => {
        window.location.hash = '#/favorites';
      });
    }

    if (label === 'Cart') {
      button.addEventListener('click', () => {
        window.location.hash = '#/cart';
      });
    }

  });

}

function initShoppingTabs() {

  document
    .querySelectorAll('.shopping-tab')
    .forEach(button => {

      button.addEventListener('click', () => {

        const tab =
          button.dataset.shoppingTab;

        renderShoppingPage(tab);

      });

    });
}

// ---------------------------------------------------------
// FOOD DETAIL PAGE
// ---------------------------------------------------------
function renderFoodDetail(itemId) {
  const container = document.getElementById('food-detail-content');

  if (!container) return;

  const item = MENU_ITEMS.find(menuItem => menuItem.id === itemId);

  if (!item) {
    container.innerHTML = `
      <div class="food-detail-not-found">
        <h2>Dish not found</h2>
        <p>We couldn't find the dish you're looking for.</p>
        <a href="#/menu" class="btn btn-primary">
          Back to Menu
        </a>
      </div>
    `;
    return;
  }

  const isFavorite =
    window.FarslyState.favorites.includes(item.id);

  const ingredients = item.ingredients
    .map(ingredient => `<span>${ingredient}</span>`)
    .join('');

  container.innerHTML = `
    <section class="food-detail">

      <div class="container">

        <!-- Back -->
        <a href="#/menu" class="food-detail-back">
          ← Back to Menu
        </a>

        <div class="food-detail-layout">

          <!-- IMAGE -->
          <div class="food-detail-visual">

            <div
              class="food-detail-image"
              style="--item-color: ${item.color};"
            >
              <img
                src="${item.image}"
                alt="${item.name}"
              >
            </div>

            ${item.badge
      ? `<span class="food-detail-badge">${item.badge}</span>`
      : item.tags.includes('popular')
        ? `<span class="food-detail-badge">Popular</span>`
        : ''
    }

          </div>

          <!-- INFORMATION -->
          <div class="food-detail-info">

            <div class="food-detail-category">
              ${getFoodCategoryName(item.category)}
            </div>

            <div class="food-detail-title-row">

              <h1>${item.name}</h1>

              <button
                type="button"
                class="food-detail-favorite ${isFavorite ? 'active' : ''}"
                id="food-detail-favorite"
                aria-label="${isFavorite
      ? 'Remove from favorites'
      : 'Add to favorites'
    }"
              >
                <span class="ico" data-icon="heart"></span>
              </button>

            </div>

            <div class="food-detail-rating">
              <span class="rating-stars">★</span>
              <strong>${item.rating}</strong>
              <span>(${item.reviews} reviews)</span>
            </div>

            <p class="food-detail-description">
              ${item.description}
            </p>

            <!-- Nutrition -->
            <div class="food-detail-nutrition">

              <div>
                <strong>${item.nutrition.cal}</strong>
                <span>Calories</span>
              </div>

              <div>
                <strong>${item.nutrition.protein}g</strong>
                <span>Protein</span>
              </div>

              <div>
                <strong>${item.nutrition.carbs}g</strong>
                <span>Carbs</span>
              </div>

              <div>
                <strong>${item.nutrition.fat}g</strong>
                <span>Fat</span>
              </div>

            </div>

            <!-- Ingredients -->
            <div class="food-detail-section">

              <div class="food-detail-section-label">
                What's inside
              </div>

              <div class="food-detail-ingredients">
                ${ingredients}
              </div>

            </div>

            <!-- Purchase -->
            <div class="food-detail-purchase">

              <div class="food-detail-price">
                ${formatPrice(item.price)}
              </div>

              <button
                type="button"
                class="btn btn-primary btn-lg"
                id="food-detail-add"
              >
                Add to Bag
                <span class="ico" data-icon="plus"></span>
              </button>

            </div>

            <!-- Customize -->
            <a
              href="#/build"
              class="food-detail-customize"
            >
              Customize this bowl
              <span>→</span>
            </a>

          </div>

        </div>

      </div>

    </section>
  `;

  if (typeof paintIcons === 'function') {
    paintIcons(container);
  }

  // Favorite
  const favoriteButton =
    document.getElementById('food-detail-favorite');

  if (favoriteButton) {
    favoriteButton.addEventListener('click', () => {

      const favorites =
        window.FarslyState.favorites;

      const index =
        favorites.indexOf(item.id);

      if (index === -1) {
        favorites.push(item.id);
      } else {
        favorites.splice(index, 1);
      }

      localStorage.setItem(
        'farsly_favorites',
        JSON.stringify(favorites)
      );

      const active =
        favorites.includes(item.id);

      favoriteButton.classList.toggle(
        'active',
        active
      );

      favoriteButton.setAttribute(
        'aria-label',
        active
          ? 'Remove from favorites'
          : 'Add to favorites'
      );

      if (typeof showToast === 'function') {
        showToast(
          active
            ? `${item.name} added to favorites`
            : `${item.name} removed from favorites`
        );
      }
    });
  }

  // Add to bag
  const addButton =
    document.getElementById('food-detail-add');

  if (addButton) {
    addButton.addEventListener('click', () => {

      const cart =
        window.FarslyState.cart;

      const existingItem =
        cart.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity =
          (existingItem.quantity || 1) + 1;
      } else {
        cart.push({
          ...item,
          quantity: 1
        });
      }

      localStorage.setItem(
        'farsly_cart',
        JSON.stringify(cart)
      );

      updateGlobalCartBadge();

      if (typeof showToast === 'function') {
        showToast(`${item.name} added to your bag`);
      }
    });
  }
}

function renderMembershipPage() {
  const page = document.getElementById('view-membership');

  if (!page) {
    console.warn('Membership page not found.');
    return;
  }

  const currentTier =
    window.FarslyState.membership?.tier || 'basic';

  const currentMembership =
    MEMBERSHIP[currentTier] || MEMBERSHIP.basic;

  const points =
    window.FarslyState.membership?.points || 0;

  const membershipContent = page.querySelector('.membership-content');

  if (!membershipContent) {
    console.warn('Membership content container not found.');
    return;
  }

  membershipContent.innerHTML = `
    <div class="membership-hero-content">

      <div class="membership-eyebrow">
        FARSLY CLUB
      </div>

      <h1>
        Eat well.<br>
        <span>Get rewarded.</span>
      </h1>

      <p>
        Every order brings you closer to better rewards,
        exclusive experiences, and more reasons to eat well.
      </p>

    </div>

    <div class="membership-card-preview">
      <div class="membership-card-top">
        <span>FARSLY</span>
        <span>CLUB</span>
      </div>

      <div class="membership-card-middle">
        <span class="membership-card-label">
          MEMBERSHIP
        </span>

        <strong>
          ${currentMembership.name.toUpperCase()}
        </strong>
      </div>

      <div class="membership-card-bottom">
        <span>
          ${points.toLocaleString('id-ID')} POINTS
        </span>

        <span>
          ${currentMembership.discount}% OFF
        </span>
      </div>
    </div>
  `;
}

function renderMembershipPlans() {
  const container = document.getElementById('membership-plans');

  if (!container) {
    console.warn('Membership plans container not found.');
    return;
  }

  const currentTier =
    window.FarslyState.membership?.tier || 'basic';

  container.innerHTML = Object.values(MEMBERSHIP)
    .map(plan => {

      const isCurrent = plan.id === currentTier;

      return `
        <article
          class="membership-plan-card
          ${plan.popular ? 'is-popular' : ''}
          ${isCurrent ? 'is-current' : ''}"
          data-tier="${plan.id}"
        >

          ${plan.popular ? `
            <div class="membership-popular-badge">
              MOST POPULAR
            </div>
          ` : ''}

          <div class="membership-plan-header">

            <span class="membership-plan-name">
              ${plan.name}
            </span>

            <div class="membership-plan-price">
              ${plan.price === 0
          ? 'Free'
          : `Rp ${plan.price.toLocaleString('id-ID')}`
        }

              ${plan.price > 0
          ? `<span>${plan.period}</span>`
          : ''
        }
            </div>

            <p class="membership-plan-description">
              ${plan.description}
            </p>

            <p class="membership-plan-details">
              ${plan.details}
            </p>

          </div>

          <div class="membership-plan-benefits">

            <h4>What's included</h4>

            <ul>
              ${plan.benefits
          .map(benefit => `
                  <li>
                    <span class="benefit-check">✓</span>
                    <span>${benefit}</span>
                  </li>
                `)
          .join('')}
            </ul>

          </div>

          <button
            class="membership-plan-button"
            data-membership-action="${plan.id}"
            ${isCurrent ? 'disabled' : ''}
          >
            ${isCurrent ? 'Current Plan' : plan.button}
          </button>

        </article>
      `;
    })
    .join('');

  bindMembershipPlanButtons();
}

function bindMembershipPlanButtons() {
  const buttons = document.querySelectorAll(
    '[data-membership-action]'
  );

  buttons.forEach(button => {
    button.addEventListener('click', () => {

      const tier = button.dataset.membershipAction;

      if (!MEMBERSHIP[tier]) {
        return;
      }

      upgradeMembership(tier);
    });
  });
}

// ================================================================
// BUILD YOUR BOWL — CUSTOMIZER
// ================================================================

const BUILD_STEP_KEYS = [
  'base',
  'protein',
  'toppings',
  'sauce',
  'extras'
];

function renderBuildPage() {

  const main = document.getElementById('build-main');
  const optionsContainer = document.getElementById('build-options');

  if (!main || !optionsContainer) return;

  const currentStep = window.FarslyBuild.currentStep;


  // =========================================================
  // REVIEW
  // =========================================================

  if (currentStep === 5) {
    renderBuildReview(main);

    // Update final bowl image/state
    updateBuildBowlVisual();
    updateBuildStepUI();

    // Hide old builder UI
    const optionsArea = document.querySelector('.build-options-area');
    const bowlStage = document.querySelector('.build-bowl-stage');
    const buildSummary = document.querySelector('.build-summary');
    const buildNavigation = document.querySelector('.build-navigation');

    if (optionsArea) {
      optionsArea.style.display = 'none';
    }

    if (bowlStage) {
      bowlStage.style.display = 'none';
    }

    if (buildSummary) {
      buildSummary.style.display = 'none';
    }

    if (buildNavigation) {
      buildNavigation.style.display = 'none';
    }

    return;
  }


  const key = BUILD_STEP_KEYS[currentStep];
  const step = BOWL_STEPS[key];

  if (!step) return;


  // Update title
  const title = document.getElementById('build-options-title');

  if (title) {
    title.textContent = step.title;
  }


  // =========================================================
  // RENDER CARDS
  // =========================================================

  optionsContainer.innerHTML = step.options.map(option => {

    const selection = window.FarslyBuild.selections[key];

    let isSelected = false;

    if (Array.isArray(selection)) {

      isSelected = selection.some(
        item => item.id === option.id
      );

    } else {

      isSelected =
        selection?.id === option.id;

    }


    return `
      <button
        type="button"
        class="build-option-card ${isSelected ? 'selected' : ''}"
        data-option-id="${option.id}"
        data-step-key="${key}"
      >

        <div class="build-option-image-wrap">

          <img
            src="${option.image || 'assets/img/build/placeholder.png'}"
            alt="${option.name}"
            class="build-option-image"
            onerror="this.src='assets/img/build/placeholder.png'"
          />

        </div>

        <div class="build-option-card-body">

          <span class="build-option-name">
            ${option.name}
          </span>

          <span class="build-option-description">
            ${option.description}
          </span>

          <span class="build-option-price">
            ${option.price > 0
        ? `+ ${formatPrice(option.price)}`
        : 'Included'
      }
          </span>

        </div>

        <span class="build-option-check">
          ✓
        </span>

      </button>
    `;

  }).join('');

  bindBuildOptions(key);
  bindBuildOptionArrows();
  updateBuildBowlVisual();
  updateBuildStepUI();
  updateBuildSummary();
}


// ---------------------------------------------------------------
// OPTION SELECTION
// ---------------------------------------------------------------

function bindBuildOptions(key) {
  const optionsContainer = document.getElementById('build-options');

  if (!optionsContainer) return;

  optionsContainer
    .querySelectorAll('.build-option-card')
    .forEach(card => {

      card.addEventListener('click', () => {

        const optionId = card.dataset.optionId;
        const step = BOWL_STEPS[key];

        if (!step) return;

        const option = step.options.find(
          item => item.id === optionId
        );

        if (!option) return;


        // =====================================================
        // MULTIPLE SELECTION
        // Protein / Toppings / Extras
        // =====================================================

        if (
          key === 'protein' ||
          key === 'toppings' ||
          key === 'extras'
        ) {

          const current =
            window.FarslyBuild.selections[key];


          const existingIndex =
            current.findIndex(
              item => item.id === option.id
            );


          // Remove if already selected
          if (existingIndex >= 0) {

            current.splice(existingIndex, 1);

          }

          // Add new selection
          else {

            // Protein maximum = 2
            if (
              key === 'protein' &&
              current.length >= 2
            ) {

              showBuildMessage(
                'You can choose up to 2 proteins.'
              );

              return;
            }

            current.push(option);
          }

        }


        // =====================================================
        // SINGLE SELECTION
        // Base / Sauce
        // =====================================================

        else {

          window.FarslyBuild.selections[key] = option;

        }

        // Update bowl image immediately
        updateBuildBowlVisual();

        // Re-render cards and summary
        renderBuildPage();

      });

    });
}


// ---------------------------------------------------------------
// STEP NAVIGATION
// ---------------------------------------------------------------

function bindBuildOptionArrows() {

  const prevBtn = document.getElementById('build-prev');
  const nextBtn = document.getElementById('build-next');

  if (prevBtn) {
    prevBtn.onclick = () => {
      scrollBuildOptions(-1);
    };
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      scrollBuildOptions(1);
    };
  }

}
function bindBuildStepButtons() {

  const nextButton = document.getElementById('build-next-btn');
  const backButton = document.getElementById('build-back-btn');

  if (nextButton) {
    nextButton.onclick = () => {

      const step = window.FarslyBuild.currentStep;

      // Don't allow moving forward without required selections
      if (step < 5 && !isBuildStepComplete(step)) {
        showBuildMessage('Please make a selection first.');
        return;
      }

      if (step < 5) {
        window.FarslyBuild.currentStep++;
        renderBuildPage();
      }
    };
  }

  if (backButton) {
    backButton.onclick = () => {

      if (window.FarslyBuild.currentStep > 0) {
        window.FarslyBuild.currentStep--;
        renderBuildPage();
      }
    };
  }

  // Step sidebar buttons
  document.querySelectorAll('#build-steps [data-step]').forEach(button => {

    button.onclick = () => {

      const targetStep = Number(button.dataset.step);
      const currentStep = window.FarslyBuild.currentStep;

      // Prevent jumping too far ahead
      if (targetStep > currentStep) {

        for (let i = 0; i < targetStep; i++) {
          if (!isBuildStepComplete(i)) {
            showBuildMessage('Complete the previous step first.');
            return;
          }
        }
      }

      window.FarslyBuild.currentStep = targetStep;
      renderBuildPage();
    };
  });
}


// ---------------------------------------------------------------
// STEP VALIDATION
// ---------------------------------------------------------------

function isBuildStepComplete(stepIndex) {

  const key = BUILD_STEP_KEYS[stepIndex];

  if (!key) return true;

  const selection = window.FarslyBuild.selections[key];

  if (Array.isArray(selection)) {
    return selection.length > 0;
  }

  return selection !== null;
}


// ---------------------------------------------------------------
// STEP UI
// ---------------------------------------------------------------

function updateBuildStepUI() {

  const currentStep = window.FarslyBuild.currentStep;

  document.querySelectorAll('#build-steps [data-step]').forEach(button => {

    const step = Number(button.dataset.step);

    button.classList.toggle(
      'active',
      step === currentStep
    );

    button.classList.toggle(
      'completed',
      step < currentStep
    );
  });

  const backButton = document.getElementById('build-back-btn');
  const nextButton = document.getElementById('build-next-btn');

  if (backButton) {
    backButton.disabled = currentStep === 0;
  }

  if (nextButton) {

    if (currentStep === 5) {
      nextButton.style.display = 'none';
    } else {
      nextButton.style.display = '';
      nextButton.textContent =
        currentStep === 4 ? 'Review Bowl' : 'Next';
    }
  }
}


// ---------------------------------------------------------------
// LIVE SUMMARY
// ---------------------------------------------------------------

function updateBuildSummary() {
  const list = document.getElementById('build-summary-list');
  const countEl = document.getElementById('build-summary-count');
  const caloriesEl = document.getElementById('build-calories');
  const proteinEl = document.getElementById('build-protein');
  const totalEl = document.getElementById('build-total');
  const checkoutBtn = document.getElementById('build-checkout-btn');

  if (!list) return;

  const selections = window.FarslyBuild.selections;
  const selectedItems = [];

  // BASE
  if (selections.base) {
    const option = BOWL_STEPS.base.options.find(
      item => item.id === selections.base.id
    );

    if (option) {
      selectedItems.push({
        option,
        type: 'Base'
      });
    }
  }

  // PROTEIN
  if (Array.isArray(selections.protein)) {
    selections.protein.forEach(selected => {
      const option = BOWL_STEPS.protein.options.find(
        item => item.id === selected.id
      );

      if (option) {
        selectedItems.push({
          option,
          type: 'Protein'
        });
      }
    });
  }

  // TOPPINGS
  if (Array.isArray(selections.toppings)) {
    selections.toppings.forEach(selected => {
      const option = BOWL_STEPS.toppings.options.find(
        item => item.id === selected.id
      );

      if (option) {
        selectedItems.push({
          option,
          type: 'Topping'
        });
      }
    });
  }

  // SAUCE
  if (selections.sauce) {
    const option = BOWL_STEPS.sauce.options.find(
      item => item.id === selections.sauce.id
    );

    if (option) {
      selectedItems.push({
        option,
        type: 'Sauce'
      });
    }
  }

  // EXTRAS
  if (Array.isArray(selections.extras)) {
    selections.extras.forEach(selected => {
      const option = BOWL_STEPS.extras.options.find(
        item => item.id === selected.id
      );

      if (option) {
        selectedItems.push({
          option,
          type: 'Extra'
        });
      }
    });
  }

  // EMPTY STATE
  if (selectedItems.length === 0) {
    list.innerHTML = `
      <div class="build-receipt-empty">
        Your selections will appear here.
      </div>
    `;

    if (countEl) countEl.textContent = '0 items';
    if (caloriesEl) caloriesEl.textContent = '0 kcal';
    if (proteinEl) proteinEl.textContent = '0g';
    if (totalEl) totalEl.textContent = 'Rp 0';

    if (checkoutBtn) {
      checkoutBtn.disabled = true;
    }

    return;
  }

  // CALCULATE TOTALS
  let total = 0;
  let calories = 0;
  let protein = 0;

  selectedItems.forEach(({ option }) => {
    total += Number(option.price) || 0;
    calories += Number(option.cal) || 0;
    protein += Number(option.protein) || 0;
  });

  // RENDER RECEIPT
  list.innerHTML = selectedItems.map(({ option, type }) => {

    const image = option.image || 'assets/img/hero-bowl.png';

    return `
      <div class="build-receipt-item">

        <div class="build-receipt-item-image">
          <img
            src="${image}"
            alt="${option.name}"
            onerror="this.onerror=null; this.src='assets/img/hero-bowl.png';"
          >
        </div>

        <div class="build-receipt-item-info">
          <span class="build-receipt-item-name">
            ${option.name}
          </span>

          <span class="build-receipt-item-type">
            ${type}
          </span>
        </div>

        <span class="build-receipt-item-price">
          ${option.price > 0 ? `+ ${formatPrice(option.price)}` : 'Included'}
        </span>

      </div>
    `;
  }).join('');

  // UPDATE STATS
  if (countEl) {
    countEl.textContent =
      `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'
      }`;
  }

  if (caloriesEl) {
    caloriesEl.textContent = `${calories} kcal`;
  }

  if (proteinEl) {
    proteinEl.textContent = `${protein}g`;
  }

  if (totalEl) {
    totalEl.textContent = formatPrice(total);
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
  }
}

// ---------------------------------------------------------------
// BOWL VISUAL
// ---------------------------------------------------------------

function updateBuildBowlVisual() {
  const bowlImage = document.getElementById('build-bowl-image');
  const selection = document.getElementById('build-bowl-selection');

  if (!bowlImage || !selection) return;

  const data = window.FarslyBuild.selections;

  // --------------------------------------------------
  // Determine the latest completed stage
  // --------------------------------------------------

  let completedStage = 0;

  if (data.base) {
    completedStage = 1;
  }

  if (Array.isArray(data.protein) && data.protein.length > 0) {
    completedStage = 2;
  }

  if (Array.isArray(data.toppings) && data.toppings.length > 0) {
    completedStage = 3;
  }

  if (data.sauce) {
    completedStage = 4;
  }

  if (Array.isArray(data.extras) && data.extras.length > 0) {
    completedStage = 5;
  }

  // Review step = final bowl
  if (window.FarslyBuild.currentStep === 5) {
    completedStage = 6;
  }

  // --------------------------------------------------
  // Pre-made bowl images
  // --------------------------------------------------

  const bowlImages = {
    0: 'assets/img/bowl-empty.png',
    1: 'assets/img/bowl-base.png',
    2: 'assets/img/bowl-protein.png',
    3: 'assets/img/bowl-toppings.png',
    4: 'assets/img/bowl-sauce.png',
    5: 'assets/img/bowl-extras.png',
    6: 'assets/img/bowl-final.png'
  };

  // Set the correct image
  bowlImage.src = bowlImages[completedStage];

  // Always keep the proper alt text
  bowlImage.alt = 'Your Custom Bowl';

  // --------------------------------------------------
  // Text below the bowl
  // --------------------------------------------------

  if (completedStage === 0) {
    selection.innerHTML = `
      <span>Your Custom Bowl</span>
    `;
  } else if (completedStage === 6) {
    selection.innerHTML = `
      <span>Your Final Bowl</span>
    `;
  } else {
    selection.innerHTML = `
      <span>Your Custom Bowl</span>
    `;
  }
}
// ---------------------------------------------------------------
// REVIEW
// ---------------------------------------------------------------

function renderBuildReview(container) {
  const data = window.FarslyBuild.selections;

  const base = data.base;
  const protein = Array.isArray(data.protein) ? data.protein : [];
  const toppings = Array.isArray(data.toppings) ? data.toppings : [];
  const sauce = data.sauce;
  const extras = Array.isArray(data.extras) ? data.extras : [];

  const allItems = [
    ...(base ? [base] : []),
    ...protein,
    ...toppings,
    ...(sauce ? [sauce] : [])
  ];

  const total = allItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const calories = allItems.reduce(
    (sum, item) => sum + (item.cal || 0),
    0
  );

  const proteinGrams = allItems.reduce(
    (sum, item) => sum + (item.protein || 0),
    0
  );

  const ingredientGroup = (label, items) => {
    if (!items || items.length === 0) return '';

    return `
      <div class="review-ingredient-group">
        <span class="review-ingredient-label">${label}</span>
        <div class="review-ingredient-list">
          ${items.map(item => `
            <div class="review-ingredient">
              <span>${item.name}</span>
              ${item.price ? `<span>+${formatPrice(item.price)}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="review-layout">

      <!-- LEFT : FINAL BOWL -->
      <div class="review-bowl-column">

        <div class="review-bowl-eyebrow">
          YOUR CREATION
        </div>

        <h2 class="review-bowl-title">
          Your perfect bowl.
        </h2>

        <p class="review-bowl-description">
          Fresh ingredients, exactly the way you like it.
        </p>

        <div class="review-bowl-visual">
          <div class="review-bowl-glow"></div>

          <img
            src="assets/img/bowl-final.png"
            alt="Your final custom bowl"
            class="review-bowl-image"
          >
        </div>

      </div>


      <!-- RIGHT : ORDER SUMMARY -->
      <div class="review-details">

        <div class="review-details-header">
          <div>
            <span class="review-details-eyebrow">
              FINAL REVIEW
            </span>

            <h3>
              Your Custom Bowl
            </h3>
          </div>

          <span class="review-item-count">
            ${allItems.length} items
          </span>
        </div>


        <!-- INGREDIENTS -->
        <div class="review-ingredients">

          ${ingredientGroup('BASE', base ? [base] : [])}

          ${ingredientGroup('PROTEIN', protein)}

          ${ingredientGroup('TOPPINGS', toppings)}

          ${ingredientGroup('SAUCE', sauce ? [sauce] : [])}

        </div>


        <!-- NUTRITION -->
        <div class="review-nutrition">

          <div>
            <span>Calories</span>
            <strong>${calories}</strong>
            <small>kcal</small>
          </div>

          <div>
            <span>Protein</span>
            <strong>${proteinGrams}g</strong>
          </div>

        </div>


        <!-- TOTAL -->
        <div class="review-total">

          <div>
            <span>Total</span>
            <small>Freshly prepared for you</small>
          </div>

          <strong>
            ${formatPrice(total)}
          </strong>

        </div>


        <!-- CTA -->
        <button
          class="review-add-button"
          id="review-add-to-bag"
        >
          Add to Bag
          <span>→</span>
        </button>

      </div>

    </div>
  `;

  const addButton = document.getElementById('review-add-to-bag');

  if (addButton) {
    addButton.addEventListener('click', () => {
      addCustomBowlToCart();
    });
  }
}
// ---------------------------------------------------------------
// ADD CUSTOM BOWL TO CART
// ---------------------------------------------------------------

function addCustomBowlToCart() {

  const selections = window.FarslyBuild.selections;

  // =========================================================
  // COLLECT INGREDIENT NAMES
  // =========================================================

  const ingredients = [];

  // Base
  if (selections.base) {
    ingredients.push(selections.base.name);
  }

  // Protein — maximum 2
  if (Array.isArray(selections.protein)) {
    selections.protein.forEach(item => {
      ingredients.push(item.name);
    });
  }

  // Toppings
  if (Array.isArray(selections.toppings)) {
    selections.toppings.forEach(item => {
      ingredients.push(item.name);
    });
  }

  // Sauce
  if (selections.sauce) {
    ingredients.push(selections.sauce.name);
  }

  // Extras
  if (Array.isArray(selections.extras)) {
    selections.extras.forEach(item => {
      ingredients.push(item.name);
    });
  }


  // =========================================================
  // COLLECT ALL SELECTED ITEMS
  // =========================================================

  const allItems = [
    selections.base,
    ...selections.protein,
    ...selections.toppings,
    selections.sauce,
    ...selections.extras
  ].filter(Boolean);


  // =========================================================
  // CALCULATE TOTALS
  // =========================================================

  const total = allItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  const calories = allItems.reduce(
    (sum, item) => sum + (item.cal || 0),
    0
  );

  const protein = allItems.reduce(
    (sum, item) => sum + (item.protein || 0),
    0
  );


  // =========================================================
  // CREATE CUSTOM BOWL
  // =========================================================

  const customBowl = {
    id: `custom-bowl-${Date.now()}`,
    name: 'Your Custom Bowl',
    category: 'custom',

    price: total,

    image: 'assets/img/bowl-base.png',

    description: ingredients.join(', '),

    ingredients,

    nutrition: {
      cal: calories,
      protein: protein,
      carbs: 0,
      fat: 0
    },

    quantity: 1,

    custom: true
  };


  // =========================================================
  // ADD TO CART
  // =========================================================

  window.FarslyState.cart.push(customBowl);

  localStorage.setItem(
    'farsly_cart',
    JSON.stringify(window.FarslyState.cart)
  );


  // Update cart badge
  updateGlobalCartBadge();


  // Go back to menu
  window.location.hash = '#/menu';
}

// ================================================================
// CHECKOUT
// ================================================================

const DELIVERY_FEE = 15000;


// ---------------------------------------------------------------
// GET CART
// ---------------------------------------------------------------

function getCheckoutCart() {
  return window.FarslyState.cart || [];
}


// ---------------------------------------------------------------
// CALCULATE CART TOTALS
// ---------------------------------------------------------------

function calculateCheckoutTotals() {

  const cart = getCheckoutCart();

  const subtotal = cart.reduce((total, item) => {
    return total + (
      Number(item.price || 0) *
      Number(item.quantity || 1)
    );
  }, 0);

  const delivery =
    cart.length > 0 ? DELIVERY_FEE : 0;

  const total =
    subtotal + delivery;

  return {
    subtotal,
    delivery,
    total
  };
}


// ---------------------------------------------------------------
// RENDER CHECKOUT
// ---------------------------------------------------------------

function playOrderSuccessSound() {
  const sound = document.getElementById('success-sound');

  if (!sound) {
    console.warn('Order success sound element not found.');
    return;
  }

  sound.currentTime = 0;

  sound.play().catch(error => {
    console.warn('Could not play order success sound:', error);
  });
}

function playSuccessSound() {
  const sound = document.getElementById('success-sound');

  if (!sound) {
    console.error('success-sound element not found');
    return;
  }

  sound.currentTime = 0;

  sound.play()
    .then(() => {
      console.log('Success sound played');
    })
    .catch(error => {
      console.error('Success sound failed:', error);
    });
}

function renderCheckoutPage() {

  const itemsContainer =
    document.getElementById('checkout-items');

  if (!itemsContainer) return;

  const cart =
    getCheckoutCart();

  const totals =
    calculateCheckoutTotals();


  // =============================================================
  // EMPTY CART
  // =============================================================

  if (cart.length === 0) {

    itemsContainer.innerHTML = `
      <div class="checkout-empty">

        <div class="checkout-empty-icon">
          🥗
        </div>

        <h3>Your bag is empty</h3>

        <p>
          Add something delicious from our menu first.
        </p>

        <a
          href="#/menu"
          class="btn btn-primary"
        >
          Explore Menu
        </a>

      </div>
    `;

    updateCheckoutPrices({
      subtotal: 0,
      delivery: 0,
      total: 0
    });

    return;
  }


  // =============================================================
  // RENDER ITEMS
  // =============================================================

  itemsContainer.innerHTML =
    cart.map(item => {

      const quantity =
        Number(item.quantity || 1);

      const itemTotal =
        Number(item.price || 0) * quantity;

      const image =
        item.image ||
        'assets/img/hero-bowl.png';


      return `
        <div
          class="checkout-item"
          data-cart-id="${item.id}"
        >

          <div class="checkout-item-image">

            <img
              src="${image}"
              alt="${item.name}"
              onerror="
                this.onerror=null;
                this.src='assets/img/hero-bowl.png';
              "
            >

          </div>


          <div class="checkout-item-info">

            <div class="checkout-item-name-row">

              <h3>
                ${item.name}
              </h3>

              <strong>
                ${formatPrice(itemTotal)}
              </strong>

            </div>


            ${item.custom
          ? `
                  <span class="checkout-item-badge">
                    CUSTOM BOWL
                  </span>
                `
          : `
                  <span class="checkout-item-category">
                    ${item.category || 'Farsly'}
                  </span>
                `
        }


            ${item.ingredients &&
          item.ingredients.length
          ? `
                  <p class="checkout-item-ingredients">
                    ${item.ingredients.join(' · ')}
                  </p>
                `
          : ''
        }


            <div class="checkout-item-bottom">

              <span>
                Qty ${quantity}
              </span>

              <span>
                ${formatPrice(item.price)} each
              </span>

            </div>

          </div>

        </div>
      `;

    }).join('');


  // =============================================================
  // UPDATE TOTALS
  // =============================================================

  updateCheckoutPrices(totals);


  // =============================================================
  // ITEM COUNT
  // =============================================================

  const countEl =
    document.getElementById('checkout-item-count');

  if (countEl) {

    const count =
      cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 1),
        0
      );

    countEl.textContent =
      `${count} ${count === 1 ? 'item' : 'items'}`;
  }


  // =============================================================
  // PAYMENT
  // =============================================================

  initCheckoutPayment();


  // =============================================================
  // FORM
  // =============================================================

  initCheckoutForm();
}


// ---------------------------------------------------------------
// UPDATE CHECKOUT PRICES
// ---------------------------------------------------------------

function updateCheckoutPrices(totals) {

  const subtotal =
    document.getElementById('checkout-subtotal');

  const delivery =
    document.getElementById('checkout-delivery');

  const total =
    document.getElementById('checkout-total');


  if (subtotal) {
    subtotal.textContent =
      formatPrice(totals.subtotal);
  }

  if (delivery) {
    delivery.textContent =
      formatPrice(totals.delivery);
  }

  if (total) {
    total.textContent =
      formatPrice(totals.total);
  }
}

// ================================================================
// PAYMENT METHOD
// ================================================================

function initCheckoutPayment() {

  const paymentContainer =
    document.getElementById('payment-methods');

  if (!paymentContainer) return;


  const options =
    paymentContainer.querySelectorAll(
      '.payment-option'
    );


  options.forEach(option => {

    option.onclick = () => {

      options.forEach(item => {
        item.classList.remove('selected');
      });

      option.classList.add('selected');

      const payment =
        option.dataset.payment;

      window.FarslyCheckoutPayment =
        payment;


      // Update simulated payment information
      renderPaymentExtra(payment);
    };

  });


  // Default
  const selected =
    paymentContainer.querySelector(
      '.payment-option.selected'
    );

  if (selected) {

    window.FarslyCheckoutPayment =
      selected.dataset.payment;

    renderPaymentExtra(
      selected.dataset.payment
    );
  }
}


// ---------------------------------------------------------------
// PAYMENT EXTRA
// ---------------------------------------------------------------

function renderPaymentExtra(payment) {

  const container =
    document.getElementById('payment-extra');

  if (!container) return;


  if (payment === 'qris') {

    container.innerHTML = `
      <div class="payment-info-box">

        <span>QRIS payment</span>

        <p>
          A QR code will be shown after you place
          your order.
        </p>

      </div>
    `;

  }

  else if (payment === 'ewallet') {

    container.innerHTML = `
      <div class="payment-info-box">

        <span>E-Wallet</span>

        <p>
          You will be redirected to a simulated
          e-wallet payment screen.
        </p>

      </div>
    `;

  }

  else if (payment === 'card') {

    container.innerHTML = `
      <div class="payment-info-box">

        <span>Card payment</span>

        <p>
          Your card payment will be securely
          simulated for this demo.
        </p>

      </div>
    `;

  }

  else if (payment === 'cod') {

    container.innerHTML = `
      <div class="payment-info-box">

        <span>Cash on Delivery</span>

        <p>
          Pay in cash when your Farsly order arrives.
        </p>

      </div>
    `;

  }
}

// ================================================================
// CHECKOUT FORM
// ================================================================

function initCheckoutForm() {

  const placeOrderButton =
    document.getElementById(
      'checkout-place-order'
    );

  if (placeOrderButton) {

    placeOrderButton.onclick =
      handlePlaceOrder;

  }


  const backButton =
    document.getElementById(
      'checkout-back-btn'
    );

  if (backButton) {

    backButton.onclick = () => {
      window.history.back();
    };

  }
}


// ================================================================
// VALIDATE CHECKOUT
// ================================================================

function validateCheckout() {

  let valid = true;


  const name =
    document.getElementById(
      'checkout-name'
    );

  const phone =
    document.getElementById(
      'checkout-phone'
    );

  const address =
    document.getElementById(
      'checkout-address'
    );

  const terms =
    document.getElementById(
      'checkout-terms-checkbox'
    );


  // Clear errors
  document.querySelectorAll(
    '.checkout-error'
  ).forEach(error => {
    error.textContent = '';
  });


  if (!name || !name.value.trim()) {

    showCheckoutError(
      'checkout-name-error',
      'Please enter your name.'
    );

    valid = false;
  }


  if (!phone || !phone.value.trim()) {

    showCheckoutError(
      'checkout-phone-error',
      'Please enter your phone number.'
    );

    valid = false;
  }


  if (!address || !address.value.trim()) {

    showCheckoutError(
      'checkout-address-error',
      'Please enter your delivery address.'
    );

    valid = false;
  }


  if (!terms || !terms.checked) {

    showCheckoutError(
      'checkout-terms-error',
      'Please accept the terms and conditions.'
    );

    valid = false;
  }


  return valid;
}


// ---------------------------------------------------------------
// ERROR
// ---------------------------------------------------------------

function showCheckoutError(
  elementId,
  message
) {

  const element =
    document.getElementById(elementId);

  if (element) {
    element.textContent = message;
  }
}


// ================================================================
// PLACE ORDER
// ================================================================

function handlePlaceOrder() {
  const cart = getCheckoutCart();

  if (!cart || cart.length === 0) {
    showCheckoutError('Your bag is empty.');
    return;
  }

  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const address = document.getElementById('checkout-address')?.value.trim();
  const terms = document.getElementById('checkout-terms-checkbox')?.checked;

  if (!name || !phone || !address) {
    showCheckoutError('Please complete your contact and delivery information.');
    return;
  }

  if (!terms) {
    showCheckoutError('Please agree to the terms before placing your order.');
    return;
  }

  const selectedPayment =
    document.querySelector('input[name="payment"]:checked')?.value;

  if (!selectedPayment) {
    showCheckoutError('Please select a payment method.');
    return;
  }

  const totals = calculateCheckoutTotals(cart);

  const order = {
    id: `FRS-${Date.now().toString().slice(-6)}`,

    customer: {
      name,
      phone,
      address,
      notes:
        document.getElementById('checkout-notes')?.value.trim() || ''
    },

    payment: selectedPayment,

    delivery:
      document.querySelector('input[name="delivery"]:checked')?.value ||
      'standard',

    items: cart,

    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    total: totals.total,

    createdAt: new Date().toISOString(),

    status: 'confirmed'
  };

  /* Save order for confirmation + tracking */
  localStorage.setItem(
    'farsly_last_order',
    JSON.stringify(order)
  );

  /* -------------------------------------------------------
     PROCESSING STATE
     ------------------------------------------------------- */

  const button = document.getElementById('checkout-place-order');

  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Processing...';
  }

  /* Prevent double submission */
  document.body.classList.add('checkout-processing');

  /* -------------------------------------------------------
     DUMMY FRONTEND PROCESSING
     ------------------------------------------------------- */

  playSuccessSound();
  
  setTimeout(() => {

    // Play success sound

    // Clear cart
    window.FarslyState.cart = [];
    localStorage.setItem(
      'farsly_cart',
      JSON.stringify([])
    );

    // Go to confirmation
    window.location.hash = '#/confirmation';

  }, 1200);
}

function renderOrderConfirmation() {

  const page = document.getElementById('view-order-confirmation');

  if (!page) return;

  const order = JSON.parse(
    localStorage.getItem('farsly_last_order')
  );

  if (!order) {
    page.innerHTML = `
      <section class="confirmation-section">
        <div class="confirmation-container">

          <span class="confirmation-eyebrow">
            FARSLY
          </span>

          <h1>Order not found</h1>

          <p>
            We couldn't find your latest order.
          </p>

          <button
            class="confirmation-primary-btn"
            onclick="window.location.hash='#/menu'"
          >
            Explore Menu
          </button>

        </div>
      </section>
    `;

    return;
  }

  const items = Array.isArray(order.items)
    ? order.items
    : [];

  const itemCount = items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const itemsHTML = items.map(item => {

    const quantity = item.quantity || 1;

    const image =
      item.image ||
      'assets/img/hero-bowl.png';

    const price =
      typeof item.price === 'number'
        ? formatPrice(item.price * quantity)
        : '';

    return `
      <div class="confirmation-item">

        <div class="confirmation-item-image">
          <img
            src="${image}"
            alt="${item.name || 'Farsly bowl'}"
          >
        </div>

        <div class="confirmation-item-info">

          <h3>
            ${item.name || 'Farsly Bowl'}
          </h3>

          <p>
            ${quantity} × ${formatPrice(item.price || 0)}
          </p>

        </div>

        <strong>
          ${price}
        </strong>

      </div>
    `;

  }).join('');

  page.innerHTML = `
    <section class="confirmation-section">

      <div class="confirmation-container">

        <!-- SUCCESS -->

        <div class="confirmation-success">

          <div class="confirmation-check">
            ✓
          </div>

          <span class="confirmation-eyebrow">
            ORDER CONFIRMED
          </span>

          <h1>
            Your bowl is<br>
            on its way.
          </h1>

          <p>
            Thanks, ${order.customer.name}.
            We've received your order and are getting it ready fresh for you.
          </p>

          <div class="confirmation-order-id">
            ORDER ${order.id}
          </div>

        </div>


        <!-- ORDER CONTENT -->

        <div class="confirmation-layout">

          <div class="confirmation-order">

            <div class="confirmation-section-heading">

              <span>
                YOUR ORDER
              </span>

              <small>
                ${itemCount} item${itemCount === 1 ? '' : 's'}
              </small>

            </div>

            <div class="confirmation-items">
              ${itemsHTML}
            </div>

          </div>


          <!-- SUMMARY -->

          <aside class="confirmation-summary">

            <span class="confirmation-summary-eyebrow">
              FARSLY
            </span>

            <h2>
              Order details
            </h2>

            <div class="confirmation-detail">

              <span>Delivery</span>

              <strong>
                ${order.delivery === 'express'
      ? 'Express'
      : 'Standard'
    }
              </strong>

            </div>

            <div class="confirmation-detail">

              <span>Payment</span>

              <strong>
                ${order.payment === 'qris'
      ? 'QRIS'
      : order.payment === 'ewallet'
        ? 'E-Wallet'
        : order.payment === 'card'
          ? 'Card'
          : 'Cash on Delivery'
    }
              </strong>

            </div>

            <div class="confirmation-detail">

              <span>Delivery to</span>

              <strong>
                ${order.customer.address}
              </strong>

            </div>

            <div class="confirmation-total">

              <span>Total</span>

              <strong>
                ${formatPrice(order.total)}
              </strong>

            </div>

            <button
              class="confirmation-primary-btn"
              onclick="window.location.hash='#/track'"
            >
              Track My Order
            </button>

            <button
              class="confirmation-secondary-btn"
              onclick="window.location.hash='#/menu'"
            >
              Continue Shopping
            </button>

          </aside>

        </div>

      </div>

    </section>
  `;

  /* -------------------------------------------------------
     QR CODE
     ------------------------------------------------------- */

  const qrContainer =
    document.getElementById('order-qr');

  if (
    qrContainer &&
    typeof QRCode !== 'undefined'
  ) {

    qrContainer.innerHTML = '';

    const trackUrl =
      `${window.location.origin}` +
      `${window.location.pathname}` +
      `#/track`;

    new QRCode(qrContainer, {
      text: trackUrl,
      width: 140,
      height: 140
    });

  }

}

// ---------------------------------------------------------------
// MESSAGE
// ---------------------------------------------------------------

function showBuildMessage(message) {

  // Use existing toast if your project has one
  if (typeof showToast === 'function') {
    showToast(message);
    return;
  }

  console.log(message);
}


if (typeof paintIcons === 'function') {
  paintIcons(document.getElementById(
    'view-order-confirmation'
  ));
}


// Category helper for Food Detail
function getFoodCategoryName(categoryId) {
  const category = CATEGORIES.find(
    category => category.id === categoryId
  );

  return category ? category.name : categoryId;
}


// Global cart badge update
function updateGlobalCartBadge() {
  const badge =
    document.getElementById('cart-badge');

  if (!badge) return;

  const totalQuantity =
    window.FarslyState.cart.reduce(
      (total, item) =>
        total + (item.quantity || 1),
      0
    );

  badge.textContent = totalQuantity;

  badge.style.display =
    totalQuantity > 0 ? '' : 'none';
}

// Bowl Showcase on Homepage (Informational/Animated)
function initBowlShowcase() {
  const orbits = document.querySelectorAll('.ingredient-orbit');
  if (orbits.length === 0) return;

  let currentIndex = 0;

  // Initially set styles
  orbits.forEach((orbit, index) => {
    if (index === 0) {
      orbit.classList.add('active');
      orbit.style.opacity = '1';
      orbit.style.transform = 'scale(1)';
    } else {
      orbit.classList.remove('active');
      orbit.style.opacity = '0';
      orbit.style.transform = 'scale(0.85)';
    }
  });

  // Rotate every 3 seconds
  setInterval(() => {
    orbits[currentIndex].classList.remove('active');
    orbits[currentIndex].style.opacity = '0';
    orbits[currentIndex].style.transform = 'scale(0.85)';

    currentIndex = (currentIndex + 1) % orbits.length;

    orbits[currentIndex].classList.add('active');
    orbits[currentIndex].style.opacity = '1';
    orbits[currentIndex].style.transform = 'scale(1)';
  }, 3000);
}

// Hero Bowl Carousel
function initHeroCarousel() {
  const carousel = document.getElementById('hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const pagination = document.getElementById('hero-pagination');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    if (pagination) {
      pagination.textContent =
        `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Pause autoplay while hovering over the carousel
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoplayTimer);
  });

  carousel.addEventListener('mouseleave', () => {
    resetAutoplay();
  });

  showSlide(0);
  startAutoplay();
}

function scrollBuildOptions(direction) {

  const track =
    document.getElementById('build-options');

  if (!track) return;

  const card =
    track.querySelector('.build-option-card');

  if (!card) return;

  const gap = 24;

  const distance =
    card.getBoundingClientRect().width + gap;

  track.scrollBy({
    left: direction * distance,
    behavior: 'smooth'
  });

}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // 1. Paint icons
  if (typeof paintIcons === 'function') {
    paintIcons(document.body);
  }

  // 2. Initialize UI effects
  initScrollEffects();
  initMobileMenu();

  // 3. Setup showcase features
  initBowlShowcase();
  initHeroCarousel();

  // 4. Setup Auth
  updateAuthUI();

  // 5. Setup Nav
  renderRoute();
  initMenu();
  window.addEventListener('hashchange', renderRoute);
});
