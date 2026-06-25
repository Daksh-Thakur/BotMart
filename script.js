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

const profileModal = document.getElementById('profile-modal');
const profileButton = document.getElementById('profile-button');
const profilePreview = document.getElementById('profile-preview');
const userProfileForm = document.getElementById('profile-form');
const profileCancelButton = document.getElementById('profile-cancel-button');
const profileSummary = document.getElementById('profile-summary');
const editProfileButton = document.getElementById('edit-profile-button');
const logoutButton = document.getElementById('logout-button');
const profileAvatar = document.getElementById('profile-avatar');
const profileDisplayName = document.getElementById('profile-display-name');
const profileDisplayRole = document.getElementById('profile-display-role');
const profileDisplayEmail = document.getElementById('profile-display-email');
const profileDisplayCompany = document.getElementById('profile-display-company');
const profileDisplayBio = document.getElementById('profile-display-bio');
const profileNameInput = document.getElementById('profile-name');
const profileEmailInput = document.getElementById('profile-email');
const profileCompanyInput = document.getElementById('profile-company');
const profileRoleInput = document.getElementById('profile-role');
const profileBioInput = document.getElementById('profile-bio');
const profileModalClose = document.getElementById('profile-modal-close');

let activeCategory = 'all';
let searchQuery = '';
let lastSearchQuery = '';
let currentSuggestionList = null;
let suggestionOptions = [];
let activeSuggestionIndex = -1;
let userProfile = null;

const sellers = [
  {
    name: 'Bharat Robotics',
    description: 'Established in Pune, Bharat Robotics builds automation systems and robotic arms for factories across India.',
    logo: 'BR',
  },
  {
    name: 'Akash Automations',
    description: 'Akash Automations delivers AI-enabled robotics solutions and vision systems for smart manufacturing.',
    logo: 'AA',
  },
  {
    name: 'Sakhi Systems',
    description: 'Sakhi Systems offers drones, agricultural robotics, and tailored build services for Indian enterprises.',
    logo: 'SS',
  },
];

function getSellerInfo(sellerName) {
  const seller = sellers.find((item) => item.name === sellerName);
  if (seller) return seller;
  return {
    name: sellerName,
    description: 'Seller profile details are not available.',
    logo: sellerName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  };
}

function getSellerLabelHTML(sellerName) {
  const { logo } = getSellerInfo(sellerName);
  return `
    <span class="seller-badge">
      <span class="seller-badge-logo">${logo}</span>
      <span>${sellerName}</span>
    </span>
  `;
}

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

function scrollToMarketplace() {
  const marketSection = document.getElementById('market');
  if (marketSection) {
    marketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function getProductRelevance(product, query) {
  if (!query) return 0;

  const title = product.title.toLowerCase();
  const seller = product.seller.toLowerCase();
  const category = product.category.toLowerCase();
  const highlights = product.highlights.toLowerCase();
  const tags = product.tags.map((tag) => tag.toLowerCase());
  let score = 0;

  if (title.startsWith(query)) score += 40;
  else if (title.includes(query)) score += 25;

  if (seller.includes(query)) score += 18;
  if (category.includes(query)) score += 12;
  if (highlights.includes(query)) score += 8;
  tags.forEach((tag) => {
    if (tag.includes(query)) score += 10;
  });

  return score;
}

function renderSuggestions(query, suggestionContainer) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    suggestionOptions = [];
    activeSuggestionIndex = -1;
    suggestionContainer.classList.remove('active');
    suggestionContainer.innerHTML = '';
    return;
  }

  const suggestions = getSuggestionOptions().filter((option) => option.toLowerCase().includes(normalizedQuery));
  if (!suggestions.length) {
    suggestionOptions = [];
    activeSuggestionIndex = -1;
    suggestionContainer.classList.remove('active');
    suggestionContainer.innerHTML = '';
    return;
  }

  suggestionOptions = suggestions.slice(0, 6);
  activeSuggestionIndex = -1;
  suggestionContainer.innerHTML = suggestionOptions
    .map((option) => `<div class="search-suggestion" role="button" tabindex="0">${option}</div>`)
    .join('');
  suggestionContainer.classList.add('active');
}

function updateSuggestionHighlight(suggestionContainer) {
  const children = Array.from(suggestionContainer.children);
  children.forEach((child, index) => {
    child.classList.toggle('highlighted', index === activeSuggestionIndex);
  });
}

function selectSuggestion(index, suggestionContainer) {
  if (index < 0 || index >= suggestionOptions.length) return;
  const selected = suggestionOptions[index];
  searchQuery = selected;
  searchInputs.forEach((control) => {
    control.value = selected;
  });
  renderProducts();
  suggestionContainer.classList.remove('active');
  suggestionOptions = [];
  activeSuggestionIndex = -1;
}

function renderProducts() {
  productGrid.innerHTML = '';
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const queryTerms = normalizedQuery ? normalizedQuery.split(/\s+/) : [];
  const visibleProducts = products
    .map((product) => {
      const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
      const queryString = [product.title, product.seller, product.highlights, ...product.tags, product.category]
        .join(' ')
        .toLowerCase();
      const queryMatch =
        !normalizedQuery ||
        queryTerms.some((term) => queryString.includes(term));
      const score = queryMatch ? getProductRelevance(product, normalizedQuery) : 0;
      return { product, categoryMatch, queryMatch, score };
    })
    .filter((item) => item.categoryMatch && item.queryMatch)
    .sort((a, b) => b.score - a.score || a.product.id - b.product.id)
    .map((item) => item.product);

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="empty-state">No listings match that category yet.</p>';
    return;
  }

  visibleProducts.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="meta">
        ${getSellerLabelHTML(product.seller)}
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
  const seller = getSellerInfo(sellerName);
  profileTitle.textContent = seller.name;
  profileDescription.textContent = seller.description;
  document.getElementById('profile-seller-logo').textContent = seller.logo;

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
          ${getSellerLabelHTML(product.seller)}
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
    const searchTerm = button.dataset.search;

    setActiveCategory(button);

    if (category) {
      activeCategory = category;
      searchQuery = '';
      searchInputs.forEach((control) => {
        control.value = '';
      });
    } else if (searchTerm) {
      activeCategory = 'all';
      searchQuery = searchTerm;
      searchInputs.forEach((control) => {
        control.value = searchQuery;
      });
    }

    renderProducts();
  });
});

searchInputs.forEach((input) => {
  const suggestionContainer = input.parentElement.querySelector('.search-suggestions');

  input.addEventListener('input', (event) => {
    const value = event.target.value;
    searchQuery = value;
    searchInputs.forEach((control) => {
      if (control !== event.target) {
        control.value = value;
      }
    });
    renderProducts();
    renderSuggestions(value, suggestionContainer);
  });

  input.addEventListener('keydown', (event) => {
    if (!suggestionOptions.length) {
      if (event.key === 'Enter') {
        event.preventDefault();
        scrollToMarketplace();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, suggestionOptions.length - 1);
      updateSuggestionHighlight(suggestionContainer);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
      updateSuggestionHighlight(suggestionContainer);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (activeSuggestionIndex >= 0) {
        selectSuggestion(activeSuggestionIndex, suggestionContainer);
      }
      scrollToMarketplace();
    }
  });

  input.addEventListener('focus', (event) => {
    const value = event.target.value;
    searchQuery = value;
    currentSuggestionList = suggestionContainer;
    renderSuggestions(value, suggestionContainer);
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      suggestionContainer.classList.remove('active');
      activeSuggestionIndex = -1;
      suggestionOptions = [];
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
    scrollToMarketplace();
    container.classList.remove('active');
  });
});

function saveUserProfile(profile) {
  userProfile = profile;
  localStorage.setItem('botmartUserProfile', JSON.stringify(profile));
  updateProfileDisplay();
}

function loadUserProfile() {
  const saved = localStorage.getItem('botmartUserProfile');
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function updateProfileDisplay() {
  const headerAvatar = document.getElementById('profile-header-avatar');
  const headerName = document.getElementById('profile-header-name');
  const profilePreview = document.getElementById('profile-preview');

  if (!userProfile) {
    profileSummary.classList.add('hidden');
    userProfileForm.classList.remove('hidden');
    profileButton.textContent = 'Login / Profile';
    if (profilePreview) profilePreview.classList.add('hidden');
    return;
  }

  profileSummary.classList.remove('hidden');
  userProfileForm.classList.add('hidden');
  const initials = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U';
  profileAvatar.textContent = initials;
  profileDisplayName.textContent = userProfile.name || 'User Name';
  profileDisplayRole.textContent = userProfile.role || 'Buyer';
  profileDisplayEmail.textContent = userProfile.email;
  profileDisplayCompany.textContent = userProfile.company || 'N/A';
  profileDisplayBio.textContent = userProfile.bio || 'No profile description added yet.';
  profileButton.textContent = userProfile.name ? `Hi, ${userProfile.name.split(' ')[0]}` : 'Profile';

  if (profilePreview) {
    profilePreview.classList.remove('hidden');
  }
  if (headerAvatar) {
    headerAvatar.textContent = initials;
  }
  if (headerName) {
    headerName.textContent = `Hi, ${userProfile.name.split(' ')[0]}`;
  }
}

function openProfileModal() {
  profileModal.classList.remove('hidden');
  updateProfileDisplay();
}

function closeProfileModal() {
  profileModal.classList.add('hidden');
}

profileButton.addEventListener('click', () => {
  if (profileModal.classList.contains('hidden')) {
    openProfileModal();
  } else {
    closeProfileModal();
  }
});

if (profilePreview) {
  profilePreview.addEventListener('click', () => {
    openProfileModal();
  });
}

if (profileModalClose) {
  profileModalClose.addEventListener('click', closeProfileModal);
}

profileModal.addEventListener('click', (event) => {
  if (event.target === profileModal) {
    closeProfileModal();
  }
});

userProfileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = {
    name: profileNameInput.value.trim(),
    email: profileEmailInput.value.trim(),
    company: profileCompanyInput.value.trim(),
    role: profileRoleInput.value.trim(),
    bio: profileBioInput.value.trim(),
  };
  saveUserProfile(profile);
});

profileCancelButton.addEventListener('click', () => {
  closeProfileModal();
});

editProfileButton.addEventListener('click', () => {
  userProfileForm.classList.remove('hidden');
  profileSummary.classList.add('hidden');
  if (userProfile) {
    profileNameInput.value = userProfile.name || '';
    profileEmailInput.value = userProfile.email || '';
    profileCompanyInput.value = userProfile.company || '';
    profileRoleInput.value = userProfile.role || '';
    profileBioInput.value = userProfile.bio || '';
  }
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('botmartUserProfile');
  userProfile = null;
  profileNameInput.value = '';
  profileEmailInput.value = '';
  profileCompanyInput.value = '';
  profileRoleInput.value = '';
  profileBioInput.value = '';
  updateProfileDisplay();
  profileButton.textContent = 'Login / Profile';
});

userProfile = loadUserProfile();
if (userProfile) {
  updateProfileDisplay();
}

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
