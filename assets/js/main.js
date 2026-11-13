/**
 * Digital Pixellar — High-Performance Agency Runtime
 * Pure vanilla JavaScript, zero dependencies, lightweight & fast.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Elevation
  const header = document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Drawer Navigation
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const close = document.querySelector('.mobile-drawer-close');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (close) close.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggle.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // 3. Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// 4. Interactive Contact Form Submission Handler
window.handleContactSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const successCard = document.getElementById('contactSuccess');
  
  if (form && successCard) {
    const nameInput = form.querySelector('input[type="text"]');
    const clientName = nameInput && nameInput.value.trim() ? nameInput.value.trim().split(' ')[0] : 'Partner';
    
    // Inject personalized greeting into success card if available
    const greetElem = successCard.querySelector('.contact-client-name');
    if (greetElem) greetElem.textContent = clientName;

    form.style.display = 'none';
    successCard.classList.add('active');
    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

window.resetContactForm = function() {
  const form = document.getElementById('contactForm');
  const successCard = document.getElementById('contactSuccess');
  if (form && successCard) {
    form.reset();
    form.style.display = 'block';
    successCard.classList.remove('active');
  }
};
