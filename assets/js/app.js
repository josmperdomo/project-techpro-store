/**
 * TechPRO Store - High-Tech Audiophile Experience Controller
 * Author: Jose Manuel Perdomo
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initColorSwitcher();
  initSoundDemo();
  initCart();
  initModelModal();
  initNewsletter();
  initBackToTop();
});

/**
 * 1. Sticky Header & Mobile Drawer
 */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.getElementById('menuToggle');
  const navDrawer = document.getElementById('navDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navDrawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('active');
      toggleBtn.classList.toggle('active');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/**
 * 2. Color Switcher for Hero Showcase
 */
function initColorSwitcher() {
  const colorDots = document.querySelectorAll('.color-dot');
  const heroImg = document.getElementById('heroProductImg');
  const colorName = document.getElementById('heroColorName');

  const colorData = {
    obsidian: {
      name: 'Titanium Black Edition',
      src: 'assets/img/techpro-x.jpg'
    },
    platinum: {
      name: 'Arctic Silver Frost',
      src: 'assets/img/techpro-y.jpg'
    },
    cobalt: {
      name: 'Cyber Cobalt Edition',
      src: 'assets/img/techpro-z.jpg'
    }
  };

  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const colorKey = dot.getAttribute('data-color');
      const data = colorData[colorKey];

      if (data && heroImg) {
        heroImg.style.opacity = '0';
        heroImg.style.transform = 'scale(0.96)';

        setTimeout(() => {
          heroImg.src = data.src;
          if (colorName) colorName.textContent = data.name;
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });
}

/**
 * 3. Interactive Sound Equalizer Simulation
 */
function initSoundDemo() {
  const presetBtns = document.querySelectorAll('.preset-btn');
  const ancToggle = document.getElementById('ancToggle');
  const ancStatus = document.getElementById('ancStatus');
  const eqBars = document.querySelectorAll('.eq-bar');
  const soundWave = document.querySelector('.sound-wave-canvas');

  const presets = {
    flat: [40, 50, 45, 55, 50, 48, 52, 45, 50, 40],
    bass: [90, 85, 80, 65, 45, 40, 50, 60, 55, 45],
    vocal: [35, 45, 55, 75, 90, 85, 70, 55, 45, 40],
    spatial: [70, 60, 50, 80, 95, 90, 85, 75, 80, 70]
  };

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const presetKey = btn.getAttribute('data-preset') || 'flat';
      const heights = presets[presetKey] || presets.flat;

      eqBars.forEach((bar, index) => {
        const height = heights[index] || 50;
        bar.style.height = `${height}%`;
      });

      showToast(`Perfil Acústico Activado: ${btn.textContent.trim()}`);
    });
  });

  if (ancToggle) {
    ancToggle.addEventListener('change', () => {
      const isEnabled = ancToggle.checked;
      if (ancStatus) {
        ancStatus.textContent = isEnabled ? 'Cancelación Híbrida -42dB Activa' : 'Modo Transparencia Ambiente';
        ancStatus.style.color = isEnabled ? 'var(--primary-violet)' : 'var(--text-muted)';
      }
      showToast(isEnabled ? 'ANC Activado: Cancelación de Ruido -42dB' : 'Modo Transparencia: Conciencia Auditiva');
    });
  }
}

/**
 * 4. Interactive Cart Drawer & Order Flow
 */
let cartItems = [];

function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  cartBtn?.addEventListener('click', openCart);
  closeCartBtn?.addEventListener('click', closeCart);

  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);

  // Buy buttons
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price') || '0');
      const img = btn.getAttribute('data-img');

      addToCart({ id, name, price, img });
      openCart();
    });
  });

  checkoutBtn?.addEventListener('click', () => {
    if (cartItems.length === 0) {
      showToast('Tu carrito está vacío. Añade unos audífonos TechPRO.');
      return;
    }
    closeCart();
    showToast('¡Simulación de Pedido! Gracias por elegir TechPRO Studio.');
    cartItems = [];
    updateCartUI();
  });
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  drawer?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  drawer?.classList.remove('active');
  document.body.style.overflow = '';
}

function addToCart(item) {
  const existing = cartItems.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ ...item, quantity: 1 });
  }
  updateCartUI();
  showToast(`¡Añadido al carrito: ${item.name}!`);
}

function updateCartUI() {
  const container = document.getElementById('cartList');
  const countBadge = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (countBadge) {
    countBadge.textContent = totalCount;
    countBadge.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

  if (!container) return;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Tu carrito está actualmente vacío.</p>
        <span>Descubre los audífonos TechPRO con sonido de estudio.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.img}" alt="${item.name}" />
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="cart-item-price">$${item.price} USD</span>
        <div class="cart-item-qty">
          <button onclick="changeQty('${item.id}', -1)" aria-label="Disminuir">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.id}', 1)" aria-label="Aumentar">+</button>
        </div>
      </div>
      <button class="cart-remove-btn" onclick="removeFromCart('${item.id}')" aria-label="Eliminar item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `).join('');
}

window.changeQty = function(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cartItems = cartItems.filter(i => i.id !== id);
  }
  updateCartUI();
};

window.removeFromCart = function(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  updateCartUI();
  showToast('Producto eliminado del carrito.');
};

/**
 * 5. Model Specs Modal
 */
const modelDetails = {
  x: {
    title: 'TechPRO X Compact Wireless',
    tagline: 'Movilidad urbana sin comprometer la pureza acústica',
    price: '$249 USD',
    driver: 'Drivers de Grafeno de 35mm',
    response: '10Hz – 32.000Hz (Hi-Res Audio Certified)',
    anc: 'Cancelación Activa Digital de Ruido (-32dB)',
    battery: '35 horas de reproducción continua (Carga rápida Qi)',
    codecs: 'AAC, SBC, Qualcomm aptX Adaptive',
    weight: '198g ultraligero con diadema de titanio',
    img: 'assets/img/techpro-x.jpg',
    features: [
      'Diafragma de grafeno balanceado por micro-ingeniería',
      'Modo Gaming de ultra baja latencia (38ms)',
      'Conexión multipunto Bluetooth 5.3 (2 dispositivos)',
      'Resistencia a salpicaduras y sudoración IPX5'
    ]
  },
  y: {
    title: 'TechPRO Y Studio ANC Over-Ear',
    tagline: 'El estándar de referencia para mezcla y producción en movimiento',
    price: '$379 USD',
    driver: 'Transductores de Berilio Acústico de 40mm',
    response: '5Hz – 42.000Hz (Calibración Plana de Estudio)',
    anc: 'Cancelación de Ruido Híbrida Adaptativa (-42dB)',
    battery: '45 horas de autonomía (15 min carga = 8 horas)',
    codecs: 'Sony LDAC 990kbps, aptX HD, AAC, SBC',
    weight: '245g con almohadillas Memory Foam de cuero proteico',
    img: 'assets/img/techpro-y.jpg',
    features: [
      'Almohadillas magnéticas intercambiables con memoria de forma',
      'Matriz de 6 micrófonos beamforming para llamadas cristalinas',
      'Sensor de proximidad: Pausa y reproducción automática',
      'Cable desmontable balanceado de 3.5mm libre de oxígeno'
    ]
  },
  z: {
    title: 'TechPRO Z Audiophile Master Flagship',
    tagline: 'La cúspide del sonido espacial audiófilo con escenario tridimensional',
    price: '$499 USD',
    driver: 'Drivers Magnéticos Planares Isodinámicos de 50mm',
    response: '3Hz – 48.000Hz (Certificación Hi-Res Wireless & MQA)',
    anc: 'ANC Cuádruple con Procesador Dual DSP de 32-bit',
    battery: '55 horas de reproducción (Carga USB-C PD ultrarrápida)',
    codecs: 'LDAC Lossless, aptX Lossless, LHDC 5.0, AAC',
    weight: '270g con chasis de aluminio aeroespacial y fibra de carbono',
    img: 'assets/img/techpro-z.jpg',
    features: [
      'Tecnología Planar Magnetic para distorsión armónica < 0.05%',
      'Audio Espacial Tridimensional con seguimiento dinámico de cabeza',
      'Amplificador y DAC integrado de alta resolución Sabre ESS',
      'Estuche rígido de viaje en aluminio cepillado incluido'
    ]
  }
};

function initModelModal() {
  const modal = document.getElementById('specModal');
  const closeBtn = document.getElementById('closeSpecModal');
  const modalOverlay = modal?.querySelector('.modal-overlay');

  document.querySelectorAll('.btn-spec-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modelKey = btn.getAttribute('data-model');
      openSpecModal(modelKey);
    });
  });

  closeBtn?.addEventListener('click', closeSpecModal);
  modalOverlay?.addEventListener('click', closeSpecModal);
}

function openSpecModal(key) {
  const data = modelDetails[key];
  const modal = document.getElementById('specModal');
  if (!data || !modal) return;

  document.getElementById('modalModelTitle').textContent = data.title;
  document.getElementById('modalModelTagline').textContent = data.tagline;
  document.getElementById('modalModelPrice').textContent = data.price;
  document.getElementById('modalModelImg').src = data.img;
  document.getElementById('modalSpecDriver').textContent = data.driver;
  document.getElementById('modalSpecResponse').textContent = data.response;
  document.getElementById('modalSpecANC').textContent = data.anc;
  document.getElementById('modalSpecBattery').textContent = data.battery;
  document.getElementById('modalSpecCodecs').textContent = data.codecs;
  document.getElementById('modalSpecWeight').textContent = data.weight;

  const featuresList = document.getElementById('modalModelFeatures');
  if (featuresList) {
    featuresList.innerHTML = data.features.map(f => `
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${f}</span>
      </li>
    `).join('');
  }

  const modalBuyBtn = document.getElementById('modalBuyBtn');
  if (modalBuyBtn) {
    modalBuyBtn.onclick = () => {
      closeSpecModal();
      addToCart({
        id: `techpro-${key}`,
        name: data.title,
        price: parseFloat(data.price.replace(/[^0-9.]/g, '')),
        img: data.img
      });
      openCart();
    };
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSpecModal() {
  const modal = document.getElementById('specModal');
  modal?.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * 6. Newsletter Subscription Form
 */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      showToast('¡Bienvenido al Club TechPRO! Te enviamos un cupón de 15% OFF.');
      form.reset();
    }
  });
}

/**
 * 7. Back To Top
 */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn?.classList.add('visible');
    } else {
      btn?.classList.remove('visible');
    }
  });

  btn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Toast Notification Helper
 */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <div class="toast-content">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
      <span>${message}</span>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add('visible'), 50);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}
