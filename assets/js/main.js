// ===================================
// MAIN.JS - Core Application Logic
// ===================================

'use strict';

// ========== GLOBAL STATE ==========
const state = {
  currentPage: 'home',
  scrollPosition: 0,
  menuOpen: false,
  theme: localStorage.getItem('theme') || 'dark'
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollEffects();
  initAnimations();
  initTheme();
  loadNavigation();
  initLazyLoading();
});

// ========== NAVBAR FUNCTIONALITY ==========
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      state.menuOpen = !state.menuOpen;
    });
  }

  // Close menu when a link is clicked
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('active');
      state.menuOpen = false;
    });
  });

  // Active link highlighting
  updateActiveNavLink();
}

// ========== THEME TOGGLE FUNCTIONALITY ==========
function initTheme() {
  const themeToggle = document.createElement('button');
  themeToggle.id = 'theme-toggle';
  themeToggle.innerHTML = state.theme === 'dark' ? '☀️' : '🌙';
  themeToggle.style.cssText = `
    background: none;
    border: none;
    color: var(--primary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    margin-left: 1rem;
  `;
  themeToggle.title = 'Toggle theme';

  // Add hover effects
  themeToggle.onmouseover = () => {
    themeToggle.style.transform = 'scale(1.1)';
    themeToggle.style.boxShadow = '0 0 15px var(--primary)';
  };
  themeToggle.onmouseout = () => {
    themeToggle.style.transform = 'scale(1)';
    themeToggle.style.boxShadow = 'none';
  };

  themeToggle.addEventListener('click', toggleTheme);

  // Add to navbar
  const navbarContainer = document.querySelector('.navbar-container');
  if (navbarContainer) {
    navbarContainer.appendChild(themeToggle);
  }

  // Apply initial theme
  applyTheme();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  applyTheme();

  // Update toggle button icon
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = state.theme === 'dark' ? '☀️' : '🌙';
  }
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

function updateActiveNavLink() {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPage.includes(href) && href !== '/') {
      link.classList.add('active');
    } else if (currentPage === '/' && href === '/') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ========== SCROLL EFFECTS ==========
function initScrollEffects() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    state.scrollPosition = window.scrollY;

    // Navbar scroll effect
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Parallax effects
    updateParallaxElements();

    // Trigger animations on scroll
    observeElements();
  });
}

function updateParallaxElements() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  parallaxElements.forEach(element => {
    const speed = element.getAttribute('data-parallax') || 0.5;
    const yPos = -state.scrollPosition * speed;
    element.style.transform = `translateY(${yPos}px)`;
  });
}

// ========== INTERSECTION OBSERVER FOR ANIMATIONS ==========
function observeElements() {
  if (!('IntersectionObserver' in window)) {
    animateElementsOnScroll();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = element.getAttribute('data-delay') || 0;

        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translate(0, 0)';
          element.classList.add('animate-fade');
        }, delay);

        observer.unobserve(element);
      }
    });
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });
}

function animateElementsOnScroll() {
  const elements = document.querySelectorAll('[data-animate]');
  const windowHeight = window.innerHeight;

  elements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - 100) {
      element.classList.add('animate-fade');
    }
  });
}

// ========== ANIMATIONS ==========
function initAnimations() {
  // Stagger animations for grid items
  const gridItems = document.querySelectorAll('.grid > *');
  gridItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add('animate-fade');
  });

  // Floating animations
  const floatingElements = document.querySelectorAll('[data-float]');
  floatingElements.forEach(el => {
    el.classList.add('animate-float');
  });
}

// ========== FORM HANDLING ==========
function initFormHandling() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"]');

  // Disable submit button
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }

  try {
    // Simulate form submission (replace with actual API endpoint)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success message
    showNotification('Message sent successfully!', 'success');
    form.reset();

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = '/contact-success.html';
    }, 2000);
  } catch (error) {
    showNotification('Error sending message. Please try again.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  }
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#00d4ff'};
    color: white;
    border-radius: 0.5rem;
    z-index: 3000;
    animation: slideInUp 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideInUp 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ========== THEME TOGGLE ==========
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    applyTheme(state.theme);
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  applyTheme(state.theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// ========== LAZY LOADING ==========
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
  }
}

// ========== UTILITY FUNCTIONS ==========

// Smooth scroll to element
function smoothScroll(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Copied to clipboard!', 'success');
  });
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========== MODAL FUNCTIONALITY ==========
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
  }
});

// ========== ACCORDION FUNCTIONALITY ==========
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.parentElement;
      const isActive = accordionItem.classList.contains('active');

      // Close all other accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        accordionItem.classList.add('active');
      }
    });
  });
}

// ========== TAB FUNCTIONALITY ==========
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      document.getElementById(tabId)?.classList.add('active');
    });
  });
}

// ========== LOAD NAVIGATION ==========
async function loadNavigation() {
  try {
    // Navigation is typically inline, but this function
    // can be used to dynamically load it if needed
    initAccordion();
    initTabs();
    initFormHandling();
  } catch (error) {
    console.error('Error loading navigation:', error);
  }
}

// ========== EXPORT FOR USE IN OTHER MODULES ==========
window.appUtils = {
  formatDate,
  copyToClipboard,
  debounce,
  throttle,
  openModal,
  closeModal,
  showNotification,
  smoothScroll,
  toggleTheme
};
