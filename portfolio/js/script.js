/**
 * ==========================================================================
 * NISHAMA AL-SAYDALA - PORTFOLIO INTERACTIVITY SCRIPT
 * Vanilla JavaScript (Zero Dependencies)
 * Features:
 *  - Dark/Light Theme Switching with LocalStorage Persistence
 *  - Header Scroll State & Scroll Progress Bar
 *  - Mobile Navigation Drawer Toggle & Escape/Outside Click Handling
 *  - IntersectionObserver Scroll Reveal Animations
 *  - Active Nav Link Tracking on Scroll
 *  - Dynamic Statistics Count-Up Animation
 *  - Accessible Contact Form Client-Side Validation & Feedback
 *  - Dynamic Footer Copyright Year
 * ==========================================================================
 */

(function () {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. THEME TOGGLE (DARK MODE AS DEFAULT)
  // ------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'nishama_portfolio_theme';
  const rootElement = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default is dark mode per requirements
    return 'dark';
  }

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // ------------------------------------------------------------------------
  // 2. HEADER SCROLL EFFECT & TOP SCROLL PROGRESS BAR
  // ------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  function handleScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = Math.min(100, Math.max(0, progressPercent)) + '%';
    }

    if (siteHeader) {
      if (scrollTop > 24) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScrollProgress, { passive: true });
  // Call once on load to set initial state
  handleScrollProgress();

  // ------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // ------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileNavMenu || !mobileMenuBtn) return;
    mobileNavMenu.removeAttribute('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileMenuBtn.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileNavMenu || !mobileMenuBtn) return;
    mobileNavMenu.setAttribute('hidden', '');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    if (!mobileMenuBtn) return;
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close when a link inside mobile drawer is clicked
  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenuBtn && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
      mobileMenuBtn.focus();
    }
  });

  // Close when clicking outside header/menu on mobile
  document.addEventListener('click', function (e) {
    if (!mobileNavMenu || !mobileMenuBtn) return;
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded && !siteHeader.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK ON SCROLL (INTERSECTION OBSERVER)
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140; // Offset for header

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Default to hero if near top
    if (window.scrollY < 200) {
      currentSectionId = 'hero';
    }

    desktopNavLinks.forEach(function (link) {
      link.classList.remove('is-active');
      const href = link.getAttribute('href');
      if (href === '#' + currentSectionId) {
        link.classList.add('is-active');
      }
    });

    mobileNavLinks.forEach(function (link) {
      link.classList.remove('is-active');
      const href = link.getAttribute('href');
      if (href === '#' + currentSectionId) {
        link.classList.add('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // ------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(function (el) {
      el.classList.add('is-revealed');
    });
  }

  // ------------------------------------------------------------------------
  // 6. ANIMATED STATISTICS COUNTER (IMPACT SECTION)
  // ------------------------------------------------------------------------
  const statYears = document.getElementById('statYears');
  const statMembers = document.getElementById('statMembers');
  let statsAnimated = false;

  function animateCount(element, start, end, duration, prefix = '', suffix = '') {
    if (!element) return;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(start + (end - start) * easeProgress);

      element.textContent = prefix + currentVal + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = prefix + end + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const impactSection = document.getElementById('impact');
  if (impactSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateCount(statYears, 0, 20, 1600, '', '+');
            animateCount(statMembers, 0, 36, 1600, '~', '');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    statsObserver.observe(impactSection);
  }

  // ------------------------------------------------------------------------
  // 7. CLIENT-SIDE CONTACT FORM VALIDATION & FEEDBACK
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  // Error spans
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function clearError(input, errorElement) {
    if (input) input.classList.remove('is-invalid');
    if (errorElement) errorElement.classList.remove('is-visible');
  }

  function showError(input, errorElement) {
    if (input) input.classList.add('is-invalid');
    if (errorElement) errorElement.classList.add('is-visible');
  }

  // Live input clean-up
  if (nameInput) nameInput.addEventListener('input', () => clearError(nameInput, nameError));
  if (emailInput) emailInput.addEventListener('input', () => clearError(emailInput, emailError));
  if (subjectInput) subjectInput.addEventListener('input', () => clearError(subjectInput, subjectError));
  if (messageInput) messageInput.addEventListener('input', () => clearError(messageInput, messageError));

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, nameError);
        isValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        showError(emailInput, emailError);
        isValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        showError(subjectInput, subjectError);
        isValid = false;
      } else {
        clearError(subjectInput, subjectError);
      }

      // Validate Message (min 10 chars)
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        showError(messageInput, messageError);
        isValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (!isValid) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback is-error';
          formFeedback.textContent = 'Please correct the highlighted fields above.';
          formFeedback.removeAttribute('hidden');
        }
        return;
      }

      // Simulate sending state
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';

        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = originalText;

          if (formFeedback) {
            formFeedback.className = 'form-feedback is-success';
            formFeedback.textContent = 'Thank you for reaching out! Your message has been sent successfully. I will get back to you shortly.';
            formFeedback.removeAttribute('hidden');
          }

          // Reset form
          contactForm.reset();

          // Hide success message after 7 seconds
          setTimeout(function () {
            if (formFeedback) {
              formFeedback.setAttribute('hidden', '');
            }
          }, 7000);
        }, 600);
      }
    });
  }

  // ------------------------------------------------------------------------
  // 8. DYNAMIC COPYRIGHT YEAR
  // ------------------------------------------------------------------------
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ------------------------------------------------------------------------
  // 9. SMOOTH SCROLL FOR ALL INTERNAL ANCHORS
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // ------------------------------------------------------------------------
  // IMAGE LIGHTBOX (MOKRAMAT, MAJORS, LOCATIONS, TELEGRAM)
  // ------------------------------------------------------------------------
  const lightbox        = document.getElementById('mokramaLightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxCloseBtn');
  const lightboxBdrop   = document.getElementById('lightboxBackdrop');

  function openLightbox(src, title) {
    if (!lightbox || !src) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || '';
    lightboxCaption.textContent = title || '';
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('hidden', '');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // Open on zoom-button click
  document.querySelectorAll('.mokrama-zoom-btn, .lightbox-zoom-btn, .btn-major-zoom').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openLightbox(btn.dataset.img, btn.dataset.title);
    });
  });

  // Also allow clicking image containers
  document.querySelectorAll('.mokrama-card, .major-img-wrap, .location-img-wrap, .telegram-poster-img-wrap, .grading-poster-img-wrap, .calendar-poster-img-wrap').forEach(function (box) {
    box.addEventListener('click', function (e) {
      if (e.target.closest('.mokrama-zoom-btn, .lightbox-zoom-btn, .btn-major-zoom')) return;
      var btn = box.querySelector('.mokrama-zoom-btn, .lightbox-zoom-btn, .btn-major-zoom');
      if (btn && btn.dataset.img) {
        openLightbox(btn.dataset.img, btn.dataset.title);
      }
    });
  });

  if (lightboxClose)  lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBdrop)  lightboxBdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && !lightbox.hasAttribute('hidden')) {
      closeLightbox();
    }
  });

  // ------------------------------------------------------------------------
  // TELEGRAM BOT LINK COPY FUNCTIONALITY
  // ------------------------------------------------------------------------
  const copyToast = document.getElementById('copyToast');
  let copyToastTimeout;

  function showToast(message) {
    if (!copyToast) return;
    copyToast.textContent = message;
    copyToast.classList.add('is-visible');
    clearTimeout(copyToastTimeout);
    copyToastTimeout = setTimeout(function () {
      copyToast.classList.remove('is-visible');
    }, 2600);
  }

  document.querySelectorAll('.btn-telegram-copy').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const link = btn.getAttribute('data-link');
      if (!link) return;

      const originalHtml = btn.innerHTML;

      function setCopiedState() {
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>تم النسخ!</span>
        `;
        btn.classList.add('is-copied');
        showToast('تم نسخ الرابط بنجاح: ' + link);
        setTimeout(function () {
          btn.innerHTML = originalHtml;
          btn.classList.remove('is-copied');
        }, 2200);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(setCopiedState).catch(function () {
          fallbackCopyText(link);
        });
      } else {
        fallbackCopyText(link);
      }

      function fallbackCopyText(text) {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (successful) {
            setCopiedState();
          } else {
            window.prompt('انسخ الرابط التالي:', text);
          }
        } catch (err) {
          window.prompt('انسخ الرابط التالي:', text);
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // ACADEMIC FORMATIONS LIGHTBOX
  // ------------------------------------------------------------------------
  (function () {
    const zoomBtn   = document.getElementById('formationsZoomBtn');
    const lightbox  = document.getElementById('formationsLightbox');
    const backdrop  = document.getElementById('formationsLightboxBackdrop');
    const closeBtn  = document.getElementById('formationsLightboxClose');

    if (!zoomBtn || !lightbox) return;

    function openLightbox() {
      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
      zoomBtn.focus();
    }

    zoomBtn.addEventListener('click', openLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
        closeLightbox();
      }
    });
  })();

})();
