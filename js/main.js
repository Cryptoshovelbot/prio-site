/* ============================================
   PRIO — Main JavaScript
   Scroll reveals, FAQ, nav, speed bars
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav scroll effect ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // --- Mobile nav toggle ---
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });
  }

  // --- FAQ Accordions ---
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Stagger children: trigger all children when parent enters view ---
  document.querySelectorAll('.stagger-children').forEach(parent => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          parent.querySelectorAll('.reveal').forEach(child => {
            child.classList.add('in-view');
          });
          observer.unobserve(parent);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(parent);
  });

  // --- Speed bar animation on scroll ---
  const speedBars = document.querySelectorAll('.speed-bar__fill');
  if (speedBars.length) {
    // Store target widths and set to 0
    speedBars.forEach(bar => {
      const computedWidth = bar.style.width || '0%';
      bar.setAttribute('data-target-width', computedWidth);
      bar.style.width = '0%';
    });

    const speedObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate all bars when container is visible
          const container = entry.target;
          container.querySelectorAll('.speed-bar__fill').forEach((bar, i) => {
            setTimeout(() => {
              bar.style.width = bar.getAttribute('data-target-width');
            }, i * 200);
          });
          speedObserver.unobserve(container);
        }
      });
    }, { threshold: 0.3 });

    const speedContainer = document.querySelector('.speed-demo');
    if (speedContainer) speedObserver.observe(speedContainer);
  }

  // --- Smooth anchor scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        if (links) links.classList.remove('active');
      }
    });
  });

});
