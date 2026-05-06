/* =====================================================
   MATTIA MASSALONGO — v2.0
   Vanilla JS — semplice, robusto, zero dipendenze
   ===================================================== */

(() => {
    'use strict';

    /* ---------- DOM ---------- */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const yearEl = document.getElementById('year');
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    /* ---------- YEAR ---------- */
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- NAVBAR SCROLL ---------- */
    const onScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- MOBILE MENU ---------- */
    if (navToggle && mobileMenu) {
        const toggleMenu = (force) => {
            const isActive = force !== undefined ? force : !mobileMenu.classList.contains('active');
            mobileMenu.classList.toggle('active', isActive);
            navToggle.classList.toggle('active', isActive);
            navToggle.setAttribute('aria-expanded', isActive);
            mobileMenu.setAttribute('aria-hidden', !isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        navToggle.addEventListener('click', () => toggleMenu());
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
    }

    /* ---------- FADE-UP REVEAL (Intersection Observer) ---------- */
    const fadeElements = document.querySelectorAll('.fade-up');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: mostra subito tutto
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    /* ---------- SMOOTH SCROLL CON OFFSET NAVBAR ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const navHeight = navbar.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ---------- SERVICE CARDS GLOW (mouse position) ---------- */
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });
    });

    /* ---------- CONTACT FORM (mailto) ---------- */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = new FormData(contactForm);
            const name = (data.get('name') || '').trim();
            const email = (data.get('email') || '').trim();
            const message = (data.get('message') || '').trim();

            if (!name || !email || !message) {
                showFeedback('Compila tutti i campi per procedere.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFeedback('Inserisci un indirizzo email valido.', 'error');
                return;
            }

            const subject = encodeURIComponent(`Nuovo progetto da ${name}`);
            const body = encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMessaggio:\n${message}`);
            const mailto = `mailto:massalongomattia@gmail.com?subject=${subject}&body=${body}`;

            showFeedback('Apertura del client email…', 'success');
            setTimeout(() => {
                window.location.href = mailto;
            }, 600);

            setTimeout(() => {
                contactForm.reset();
                showFeedback('Messaggio pronto per essere inviato. Grazie!', 'success');
            }, 1500);
        });
    }

    function showFeedback(text, type) {
        if (!formFeedback) return;
        formFeedback.textContent = text;
        formFeedback.style.color = type === 'error' ? '#ff6b6b' : 'var(--gold)';
    }

    /* ---------- ACTIVE SECTION HIGHLIGHT ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if ('IntersectionObserver' in window && sections.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(s => sectionObserver.observe(s));
    }

    /* ---------- READY ---------- */
    console.log('%c MATTIA MASSALONGO ', 'background: linear-gradient(135deg, #FFD700, #D4AF37); color: #000; font-weight: bold; padding: 8px 16px; border-radius: 4px;');
    console.log('%c Web Developer & Cybersecurity Specialist ', 'color: #D4AF37; font-style: italic;');
})();
