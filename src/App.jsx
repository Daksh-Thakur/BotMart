import { useEffect, useMemo, useState } from 'react';

const featuredProducts = [
  {
    title: 'Autonomous Delivery Rover',
    category: 'Hardware',
    price: '$2,400',
    description: 'Compact rover for small warehouse routing and smart logistics.',
  },
  {
    title: 'AI Vision Kit',
    category: 'Developer Tools',
    price: '$890',
    description: 'Plug-and-play vision system for object recognition and automation.',
  },
  {
    title: 'Smart Drone Starter Pack',
    category: 'Drone Tech',
    price: '$1,150',
    description: 'Ideal for aerial inspection, mapping and content capture.',
  },
];

const services = [
  {
    title: 'Custom Robotics Integration',
    tag: 'Service',
    description: 'Design and deploy automation workflows for shops, labs and startups.',
  },
  {
    title: 'Tech Product Consultation',
    tag: 'Consulting',
    description: 'Get advice on choosing the right hardware, software and deployment stack.',
  },
  {
    title: 'Maintenance & Support',
    tag: 'Support',
    description: 'Keep your systems running with remote monitoring and reliable assistance.',
  },
];

const sellers = [
  {
    name: 'Nova Robotics Collective',
    specialty: 'Warehouse automation systems',
    location: 'Austin, TX',
  },
  {
    name: 'Pixel Forge Labs',
    specialty: 'AI vision and embedded tooling',
    location: 'Seattle, WA',
  },
  {
    name: 'Circuit Harbor',
    specialty: 'Drone kits and robotics support',
    location: 'Denver, CO',
  },
];

const sellerProfiles = [
  {
    name: 'Nova Robotics Collective',
    specialty: 'Warehouse automation systems',
    location: 'Austin, TX',
    offerings: [
      { type: 'Product', name: 'Autonomous Delivery Rover' },
      { type: 'Service', name: 'Custom Robotics Integration' },
      { type: 'Service', name: 'Maintenance & Support' },
    ],
  },
  {
    name: 'Pixel Forge Labs',
    specialty: 'AI vision and embedded tooling',
    location: 'Seattle, WA',
    offerings: [
      { type: 'Product', name: 'AI Vision Kit' },
      { type: 'Service', name: 'Tech Product Consultation' },
    ],
  },
  {
    name: 'Circuit Harbor',
    specialty: 'Drone kits and robotics support',
    location: 'Denver, CO',
    offerings: [
      { type: 'Product', name: 'Smart Drone Starter Pack' },
      { type: 'Service', name: 'Maintenance & Support' },
    ],
  },
];

const searchableItems = [
  { type: 'Product', name: 'Autonomous Delivery Rover', detail: 'Hardware', sectionId: 'product-autonomous-delivery-rover' },
  { type: 'Product', name: 'AI Vision Kit', detail: 'Developer Tools', sectionId: 'product-ai-vision-kit' },
  { type: 'Product', name: 'Smart Drone Starter Pack', detail: 'Drone Tech', sectionId: 'product-smart-drone-starter-pack' },
  { type: 'Service', name: 'Custom Robotics Integration', detail: 'Automation workflows', sectionId: 'service-custom-robotics-integration' },
  { type: 'Service', name: 'Tech Product Consultation', detail: 'Hardware guidance', sectionId: 'service-tech-product-consultation' },
  { type: 'Service', name: 'Maintenance & Support', detail: 'Remote monitoring', sectionId: 'service-maintenance-support' },
  { type: 'Seller', name: 'Nova Robotics Collective', detail: 'Warehouse automation systems', sectionId: 'seller-nova-robotics-collective' },
  { type: 'Seller', name: 'Pixel Forge Labs', detail: 'AI vision and embedded tooling', sectionId: 'seller-pixel-forge-labs' },
  { type: 'Seller', name: 'Circuit Harbor', detail: 'Drone kits and robotics support', sectionId: 'seller-circuit-harbor' },
];

function App() {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const searchValue = query.toLowerCase().trim();

    return searchableItems.filter((item) => (
      item.name.toLowerCase().includes(searchValue) ||
      item.type.toLowerCase().includes(searchValue) ||
      item.detail.toLowerCase().includes(searchValue)
    )).slice(0, 6);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowSuggestions(false);
    document.getElementById(item.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSellerSelect = (sellerName) => {
    setSelectedSeller(sellerName);
    window.setTimeout(() => {
      document.getElementById('seller-profile-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const selectedSellerProfile = useMemo(() => {
    if (!selectedSeller) {
      return null;
    }

    return sellerProfiles.find((seller) => seller.name === selectedSeller) || null;
  }, [selectedSeller]);

  const orderedOfferings = useMemo(() => {
    if (!selectedSellerProfile) {
      return [];
    }

    return [...selectedSellerProfile.offerings].sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedSellerProfile]);

  const handleKeyDown = (event) => {
    if (!filteredItems.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % filteredItems.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + filteredItems.length) % filteredItems.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selectedItem = filteredItems[activeIndex] || filteredItems[0];
      if (selectedItem) {
        handleSelect(selectedItem);
      }
    }
  };
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold text-accent" href="#">BotMart</a>
          <div className="ms-auto d-flex align-items-center gap-3 w-100 justify-content-end">
            <div className="search-wrapper flex-grow-1 mx-3">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search products, services or sellers"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
              onKeyDown={handleKeyDown}
              aria-label="Search products, services or sellers"
            />
            {showSuggestions && filteredItems.length > 0 && (
              <div className="search-dropdown">
                {filteredItems.map((item, index) => (
                  <button
                    key={`${item.sectionId}-${item.name}`}
                    type="button"
                    className={`search-item ${index === activeIndex ? 'active' : ''}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(item)}
                  >
                    <span className="fw-semibold">{item.name}</span>
                    <span className="small d-block">{item.type} · {item.detail}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navMenu">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link" href="#discover">Discover</a></li>
                <li className="nav-item"><a className="nav-link" href="#services">Services</a></li>
                <li className="nav-item"><a className="nav-link" href="#sellers">Sellers</a></li>
                <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero-section py-5">
          <div className="container py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <span className="eyebrow">Robotics • AI • Automation</span>
                <h1 className="display-4 fw-bold mb-3">A marketplace built for the next wave of tech creators.</h1>
                <p className="lead mb-4">
                  BotMart connects buyers with independent sellers offering robotics gear, smart devices, automation solutions and expert services.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <a href="#discover" className="btn btn-accent btn-lg">Explore Marketplace</a>
                  <a href="#contact" className="btn btn-outline-light btn-lg">List Your Offer</a>
                </div>
                <div className="d-flex flex-wrap gap-4 mt-4">
                  <div><strong>1.2k+</strong> verified sellers</div>
                  <div><strong>24/7</strong> buyer inquiries</div>
                  <div><strong>95%</strong> satisfaction rate</div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="hero-card p-4 rounded-4 shadow">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 mb-0">Trending today</h3>
                    <span className="badge rounded-pill bg-accent text-dark">Live</span>
                  </div>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3"><strong>AI-powered inspection bots</strong><div className="small">Fast deployment for modern warehouses</div></li>
                    <li className="mb-3"><strong>Embedded automation kits</strong><div className="small">Perfect for labs, education and prototyping</div></li>
                    <li><strong>Remote robotics support</strong><div className="small">Flexible help for maintenance and setup</div></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="discover" className="container py-5">
          <div className="section-heading mb-4">
            <span className="eyebrow">Featured Products</span>
            <h2 className="h2 fw-bold mt-2">Built for builders, founders and curious buyers.</h2>
          </div>
          <div className="row g-4">
            {featuredProducts.map((item) => {
              const cardId = `product-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              return (
                <div className="col-md-6 col-lg-4" key={item.title}>
                  <a href={`#${cardId}`} className="card-link" onClick={() => document.getElementById(cardId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                    <div id={cardId} className="card h-100 border-0 card-surface">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-dark-subtle text-light">{item.category}</span>
                          <span className="fw-bold text-accent">{item.price}</span>
                        </div>
                        <h3 className="h5 fw-semibold">{item.title}</h3>
                        <p className="mb-0">{item.description}</p>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section id="services" className="container py-5">
          <div className="section-heading mb-4">
            <span className="eyebrow">Services</span>
            <h2 className="h2 fw-bold mt-2">Trusted by sellers who want more than a listing.</h2>
          </div>
          <div className="row g-4">
            {services.map((service) => {
              const cardId = `service-${service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              return (
                <div className="col-md-6 col-lg-4" key={service.title}>
                  <a href={`#${cardId}`} className="card-link" onClick={() => document.getElementById(cardId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                    <div id={cardId} className="card h-100 border-0 card-surface">
                      <div className="card-body p-4">
                        <span className="badge rounded-pill bg-accent text-dark mb-3">{service.tag}</span>
                        <h3 className="h5 fw-semibold">{service.title}</h3>
                        <p className="mb-0">{service.description}</p>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="eyebrow">For Sellers</span>
              <h2 className="h2 fw-bold mt-2">Turn interest into qualified leads through BotMart.</h2>
              <p>
                Showcase robotics products, technical services, and custom solutions while buyers discover your work directly on the platform.
              </p>
              <ul>
                <li>Simple seller profiles with portfolio highlights</li>
                <li>Direct messaging and inquiry forms for buyers</li>
                <li>Visibility across categories like hardware, AI tools and automation</li>
              </ul>
            </div>
            <div className="col-lg-5">
              <div className="join-card p-4 rounded-4 shadow">
                <h3 className="h4 fw-semibold">Ready to launch?</h3>
                <p>Create your storefront and start connecting with buyers today.</p>
                <a href="#contact" className="btn btn-accent">Become a Seller</a>
              </div>
            </div>
          </div>
        </section>

        <section id="sellers" className="container py-5">
          <div className="section-heading mb-4">
            <span className="eyebrow">Featured Sellers</span>
            <h2 className="h2 fw-bold mt-2">Profiles worth discovering.</h2>
          </div>
          <div className="row g-4">
            {sellers.map((seller) => {
              const cardId = `seller-${seller.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
              return (
                <div className="col-md-6 col-lg-4" key={seller.name}>
                  <a href="#seller-profile-section" className="card-link" onClick={() => handleSellerSelect(seller.name)}>
                    <div id={cardId} className="card h-100 border-0 card-surface">
                      <div className="card-body p-4">
                        <h3 className="h5 fw-semibold">{seller.name}</h3>
                        <p className="mb-2">{seller.specialty}</p>
                        <p className="mb-0 small">{seller.location}</p>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {selectedSellerProfile && (
          <section id="seller-profile-section" className="container py-5">
            <div className="seller-profile-card p-5 rounded-4 shadow">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                <div>
                  <span className="eyebrow">Seller Profile</span>
                  <h2 className="h2 fw-bold mt-2">{selectedSellerProfile.name}</h2>
                  <p className="mb-1">{selectedSellerProfile.specialty}</p>
                  <p className="mb-0 small">{selectedSellerProfile.location}</p>
                </div>
                <a href="#sellers" className="btn btn-outline-light">Back to sellers</a>
              </div>
              <div className="mt-4">
                <h3 className="h5 fw-semibold mb-3">Offerings</h3>
                <div className="row g-3">
                  {orderedOfferings.map((offering) => (
                    <div className="col-md-6" key={`${offering.type}-${offering.name}`}>
                      <div className="p-3 rounded-3 border border-light border-opacity-10">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">{offering.name}</span>
                          <span className="badge rounded-pill bg-accent text-dark">{offering.type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="contact" className="container py-5">
          <div className="contact-panel p-5 rounded-4 shadow">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span className="eyebrow">Start the conversation</span>
                <h2 className="h2 fw-bold mt-2">Let’s build your next tech opportunity.</h2>
                <p className="mb-0">Reach out to discuss products, services or collaboration opportunities.</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <a href="mailto:hello@botmart.dev" className="btn btn-accent btn-lg">Contact Us</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-4 text-center">
        <div className="container">© 2026 BotMart. Robotics and tech commerce, reimagined.</div>
      </footer>
    </div>
  );
}

export default App;
