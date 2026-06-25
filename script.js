const products = [
  {
    id: 1,
    title: 'Autonomous Warehouse Rover',
    seller: 'Bharat Robotics',
    category: 'hardware',
    price: '₹9,95,000',
    highlights: 'Heavy payload, LiDAR navigation, and factory-ready controls for Indian warehouses.',
    tags: ['Logistics', 'Navigation', 'Industrial'],
  },
  {
    id: 2,
    title: 'Custom Vision Inspection Service',
    seller: 'Akash Automations',
    category: 'services',
    price: 'Quote based',
    highlights: 'Machine vision solutions for quality control in manufacturing and food processing.',
    tags: ['Vision', 'AI', 'Quality'],
  },
  {
    id: 3,
    title: 'Mobile Inspection Drone',
    seller: 'Sakhi Systems',
    category: 'hardware',
    price: '₹6,50,000',
    highlights: 'Inspection-ready drone with thermal and 4K imaging for agriculture and infrastructure.',
    tags: ['Drone', 'Field service', 'Sensors'],
  },
  {
    id: 4,
    title: 'Robot Arm Retrofit Package',
    seller: 'Bharat Robotics',
    category: 'custom',
    price: 'Customized quote',
    highlights: 'Retrofit legacy arms with modern PLC controls, safety, and local support.',
    tags: ['Retrofit', 'Controls', 'Safety'],
  },
  {
    id: 5,
    title: 'AI Path Planning Integration',
    seller: 'Akash Automations',
    category: 'ai',
    price: 'Service from ₹2,80,000',
    highlights: 'Route optimization for AGVs, warehouse fleets, and campus mobility.',
    tags: ['AI', 'Optimization', 'Fleet'],
  },
  {
    id: 6,
    title: 'Prototype Assembly & Testing',
    seller: 'Sakhi Systems',
    category: 'services',
    price: 'Quote based',
    highlights: 'End-to-end prototype build with validation cycles for startups and R&D labs.',
    tags: ['Prototype', 'Testing', 'Systems'],
  },
];

const productGrid = document.getElementById('product-grid');
const categoryButtons = document.querySelectorAll('.pill');
const searchInputs = document.querySelectorAll('.market-search-input');
const suggestionLists = document.querySelectorAll('.search-suggestions');
const sellerGrid = document.getElementById('seller-grid');
const sellerProfile = document.getElementById('seller-profile');
const profileTitle = document.getElementById('profile-title');
const profileDescription = document.getElementById('profile-description');
const profileProductGrid = document.getElementById('profile-product-grid');
const closeProfile = document.getElementById('close-profile');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const contactForm = document.getElementById('contact-form');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalProduct = document.getElementById('modal-product');
const modalSeller = document.getElementById('modal-seller');
const sellerForm = document.getElementById('seller-form');

let activeCategory = 'all';
let searchQuery = '';
let currentSuggestionList = null;

const sellers = [
  {
    name: 'Bharat Robotics',
    description: 'Established in Pune, Bharat Robotics builds automation systems and robotic arms for factories across India.',
  },
  {
    name: 'Akash Automations',
    description: 'Akash Automations delivers AI-enabled robotics solutions and vision systems for smart manufacturing.',
  },
  {
    name: 'Sakhi Systems',
    description: 'Sakhi Systems offers drones, agricultural robotics, and tailored build services for Indian enterprises.',
  },
];

function getSuggestionOptions() {
  const options = new Set();
  products.forEach((product) => {
    options.add(product.title);
    options.add(product.seller);
    product.tags.forEach((tag) => options.add(tag));
    options.add(product.category);
  });
  return Array.from(options);
}

function renderSuggestions(query, suggestionContainer) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    suggestionContainer.classList.remove('active');
    suggestionContainer.innerHTML = '';
    return;
  }

  const suggestions = getSuggestionOptions().filter((option) => option.toLowerCase().includes(normalizedQuery));
  if (!suggestions.length) {
    suggestionContainer.classList.remove('active');
    suggestionContainer.innerHTML = '';
    return;
  }

  suggestionContainer.innerHTML = suggestions
    .slice(0, 6)
    .map((option) => `<div class="search-suggestion" role="button" tabindex="0">${option}</div>`)
    .join('');
  suggestionContainer.classList.add('active');
}

function renderProducts() {
  productGrid.innerHTML = '';
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
    const queryMatch =
      !normalizedQuery ||
      [product.title, product.seller, product.highlights, ...product.tags].join(' ').toLowerCase().includes(normalizedQuery);
    return categoryMatch && queryMatch;
  });

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="empty-state">No listings match that category yet.</p>';
    return;
  }

  visibleProducts.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="meta">
        <span>${product.seller}</span>
        <span class="price">${product.price}</span>
      </div>
      <h3>${product.title}</h3>
      <p>${product.highlights}</p>
      <div class="tags">${product.tags.map((tag) => `<span class="tag-pill">${tag}</span>`).join('')}</div>
      <button class="btn btn-secondary" type="button" data-product="${product.title}" data-seller="${product.seller}">Contact seller</button>
    `;
    productGrid.appendChild(card);
  });
}

function renderSellerProfile(sellerName) {
  const seller = sellers.find((item) => item.name === sellerName) || { name: sellerName, description: 'Seller profile details are not available.' };
  profileTitle.textContent = seller.name;
  profileDescription.textContent = seller.description;

  const sellerProducts = products.filter((product) => product.seller === sellerName);
  profileProductGrid.innerHTML = '';

  if (!sellerProducts.length) {
    profileProductGrid.innerHTML = '<p class="empty-state">No products or services are listed for this seller yet.</p>';
  } else {
    sellerProducts.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="meta">
          <span>${product.seller}</span>
          <span class="price">${product.price}</span>
        </div>
        <h3>${product.title}</h3>
        <p>${product.highlights}</p>
        <div class="tags">${product.tags.map((tag) => `<span class="tag-pill">${tag}</span>`).join('')}</div>
        <button class="btn btn-secondary" type="button" data-product="${product.title}" data-seller="${product.seller}">Contact seller</button>
      `;
      profileProductGrid.appendChild(card);
    });
  }

  sellerProfile.classList.remove('hidden');
  sellerProfile.scrollIntoView({ behavior: 'smooth' });
}

function setActiveCategory(button) {
  categoryButtons.forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
}

function openModal(productTitle, sellerName) {
  modal.classList.remove('hidden');
  modalSubtitle.textContent = `Send a message to ${sellerName} about ${productTitle}.`;
  modalProduct.value = productTitle;
  modalSeller.value = sellerName;
}

function closeModal() {
  modal.classList.add('hidden');
  contactForm.reset();
}

productGrid.addEventListener('click', (event) => {
  const target = event.target;
  if (target.matches('button[data-product]')) {
    const productTitle = target.dataset.product;
    const sellerName = target.dataset.seller;
    openModal(productTitle, sellerName);
  }
});

sellerGrid.addEventListener('click', (event) => {
  const card = event.target.closest('article[data-seller-profile]');
  if (card) {
    renderSellerProfile(card.dataset.sellerProfile);
  }
});

closeProfile.addEventListener('click', () => {
  sellerProfile.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    setActiveCategory(button);
    activeCategory = category;
    renderProducts();
  });
});

searchInputs.forEach((input) => {
  const suggestionContainer = input.parentElement.querySelector('.search-suggestions');

  input.addEventListener('input', (event) => {
    searchQuery = event.target.value;
    searchInputs.forEach((control) => {
      if (control !== event.target) {
        control.value = searchQuery;
      }
    });
    renderProducts();
    renderSuggestions(searchQuery, suggestionContainer);
  });

  input.addEventListener('focus', (event) => {
    searchQuery = event.target.value;
    currentSuggestionList = suggestionContainer;
    renderSuggestions(searchQuery, suggestionContainer);
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      suggestionContainer.classList.remove('active');
    }, 150);
  });
});

suggestionLists.forEach((container) => {
  container.addEventListener('click', (event) => {
    const suggestion = event.target.closest('.search-suggestion');
    if (!suggestion) return;

    searchQuery = suggestion.textContent;
    searchInputs.forEach((control) => {
      control.value = searchQuery;
    });
    renderProducts();
    container.classList.remove('active');
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const buyerName = document.getElementById('buyer-name').value.trim();
  const buyerEmail = document.getElementById('buyer-email').value.trim();
  const buyerMessage = document.getElementById('buyer-message').value.trim();
  const product = modalProduct.value;
  const seller = modalSeller.value;

  if (!buyerName || !buyerEmail || !buyerMessage) {
    return;
  }

  alert(`Message sent to ${seller} for ${product}!\n\nBuyer: ${buyerName}\nEmail: ${buyerEmail}\n\n${buyerMessage}`);
  closeModal();
});

sellerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('seller-name').value.trim();
  const email = document.getElementById('seller-email').value.trim();
  const offer = document.getElementById('seller-offer').value.trim();

  if (!name || !email || !offer) {
    return;
  }

  alert(`Thanks, ${name}!\nYour seller information has been submitted. A marketplace manager will follow up soon.`);
  sellerForm.reset();
});

renderProducts();
