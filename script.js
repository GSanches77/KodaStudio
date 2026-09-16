/**
 * KODA STUDIO — MAIN SCRIPTS v2
 * Vanilla JS, performance-first, prefers-reduced-motion respected throughout
 */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =========================================================================
    // 1. Mobile Menu Toggle
    // =========================================================================
    const menuToggle = document.querySelector('.js-menu-toggle');
    const nav = document.querySelector('.js-nav');
    const navLinks = document.querySelectorAll('.js-nav-link');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('is-active');
            nav.classList.toggle('is-active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('is-active');
                nav.classList.remove('is-active');
            });
        });
    }

    // =========================================================================
    // 2. Dynamic Header + Scroll Progress Bar
    // =========================================================================
    const header = document.querySelector('.js-header');
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.prepend(progressBar);

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        progressBar.style.transform = `scaleX(${progress / 100})`;
    };

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                handleScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    handleScroll();

    // =========================================================================
    // 3. Hero — Stagger de entrada nos spans do h1 + desc + actions
    //    Focal moment: o único momento orquestrado da página
    // =========================================================================
    const heroContent = document.querySelector('.hero__content');
    const heroTitleSpans = document.querySelectorAll('.hero__title span');
    const heroDesc = document.querySelector('.hero__desc');
    const heroActions = document.querySelector('.hero__actions');

    if (heroContent && !prefersReduced) {
        // Stagger: span 0 → 0ms, span 1 → 80ms, span 2 → 160ms
        heroTitleSpans.forEach((span, i) => {
            span.style.transitionDelay = `${i * 0.08}s`;
            // Pequeno delay para garantir que a transição CSS dispare
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    span.classList.add('is-visible');
                });
            });
        });

        if (heroDesc) heroDesc.classList.add('is-visible');
        if (heroActions) heroActions.classList.add('is-visible');
    } else {
        // Sem animação: mostrar imediatamente
        heroTitleSpans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'none';
        });
        if (heroDesc) {
            heroDesc.style.opacity = '1';
            heroDesc.style.transform = 'none';
        }
        if (heroActions) {
            heroActions.style.opacity = '1';
            heroActions.style.transform = 'none';
        }
    }

    // =========================================================================
    // 4. Scroll Reveal via IntersectionObserver
    // =========================================================================
    const revealElements = document.querySelectorAll('.js-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================================================
    // 5. Service Cards — stagger no scroll
    // =========================================================================
    const serviceCards = document.querySelectorAll('.service-card');

    const cardsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = [...serviceCards];
                const idx = cards.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, idx * 70);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    serviceCards.forEach(card => cardsObserver.observe(card));

    // =========================================================================
    // 6. Method list items — stagger reveal
    // =========================================================================
    const methodItems = document.querySelectorAll('.method-list__item');

    const methodObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = [...methodItems];
                const idx = items.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, idx * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    methodItems.forEach(item => {
        item.classList.add('js-method-item');
        methodObserver.observe(item);
    });

    // =========================================================================
    // 7. Data-Viz Animation (Hero)
    // =========================================================================
    const datavizVisual = document.querySelector('.hero__visual');
    const counterEl = document.querySelector('.js-counter');
    const chartBars = document.querySelectorAll('.chart-bar');
    let datavizAnimated = false;

    const animateDataViz = () => {
        if (datavizAnimated) return;
        datavizAnimated = true;

        if (counterEl && !prefersReduced) {
            const target = parseInt(counterEl.getAttribute('data-target'), 10);
            const duration = 1800;
            const start = performance.now();

            const easeOut = t => 1 - Math.pow(1 - t, 3);

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.floor(easeOut(progress) * target);
                counterEl.textContent = value.toLocaleString('pt-BR');
                if (progress < 1) requestAnimationFrame(tick);
                else counterEl.textContent = target.toLocaleString('pt-BR');
            };

            requestAnimationFrame(tick);
        } else if (counterEl) {
            const target = parseInt(counterEl.getAttribute('data-target'), 10);
            counterEl.textContent = target.toLocaleString('pt-BR');
        }

        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('is-animated');
            }, index * 90);
        });
    };

    if (datavizVisual) {
        const datavizObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateDataViz, 300);
                    datavizObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        datavizObserver.observe(datavizVisual);
    }

    // =========================================================================
    // 8. Hero Cursor Glow Tracker
    // =========================================================================
    if (!prefersReduced) {
        const hero = document.querySelector('.hero');

        if (hero) {
            const glow = document.createElement('div');
            glow.className = 'hero-glow';
            glow.setAttribute('aria-hidden', 'true');
            hero.appendChild(glow);

            let glowX = 0, glowY = 0;
            let targetX = 0, targetY = 0;
            let rafId = null;

            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                targetX = e.clientX - rect.left;
                targetY = e.clientY - rect.top;

                if (!rafId) {
                    rafId = requestAnimationFrame(function animate() {
                        glowX += (targetX - glowX) * 0.07;
                        glowY += (targetY - glowY) * 0.07;
                        glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

                        if (Math.abs(targetX - glowX) > 0.5 || Math.abs(targetY - glowY) > 0.5) {
                            rafId = requestAnimationFrame(animate);
                        } else {
                            rafId = null;
                        }
                    });
                }
            }, { passive: true });

            hero.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            });

            hero.addEventListener('mouseenter', () => {
                glow.style.opacity = '1';
            });
        }
    }

    // =========================================================================
    // 9. Magnetic CTA Button
    // =========================================================================
    if (!prefersReduced) {
        const ctaBtn = document.querySelector('.hero__actions .btn--primary');

        if (ctaBtn) {
            ctaBtn.addEventListener('mousemove', (e) => {
                const rect = ctaBtn.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * 0.3;
                const dy = (e.clientY - cy) * 0.3;
                ctaBtn.style.transform = `translate(${dx}px, ${dy}px)`;
            });

            ctaBtn.addEventListener('mouseleave', () => {
                ctaBtn.style.transform = '';
            });
        }
    }

    // =========================================================================
    // 10. Typed text effect — hero accent word cycles
    //     Transição imperceptível: apaga e reescreve sem cursor piscante
    // =========================================================================
    if (!prefersReduced) {
        const accentEl = document.querySelector('.hero__typed');
        if (accentEl) {
            const words = ['do seu negócio', 'da sua marca', 'da sua empresa', 'do seu futuro'];
            let wordIndex = 0;
            let charIndex = 0;
            let deleting = false;

            const render = (str) => {
                accentEl.textContent = str || '\u00A0';
            };

            const type = () => {
                const current = words[wordIndex];

                if (deleting) {
                    charIndex--;
                } else {
                    charIndex++;
                }

                render(current.substring(0, charIndex));

                let speed = deleting ? 40 : 80;

                if (!deleting && charIndex === current.length) {
                    speed = 2400;
                    deleting = true;
                } else if (deleting && charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    speed = 280;
                }

                setTimeout(type, speed);
            };

            render(words[0]);
            charIndex = words[0].length;
            deleting = true;
            setTimeout(type, 2400);
        }
    }

    // =========================================================================
    // 11. Status badge — "Ao Vivo" blink mais natural
    // =========================================================================
    const statusBadge = document.querySelector('.js-status');
    if (statusBadge) {
        // Já controlado por CSS animation: blink — sem overhead JS
    }

    // =========================================================================
    // 12. Nav link active state no scroll (highlight atual)
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav__link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksList.forEach(link => {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));

});

// Google Tag Manager Event Tracking
function trackWhatsAppClick() {
    if (typeof gtag === 'function') {
        gtag('event', 'whatsapp_click', {
            event_category: 'Contato',
            event_label: 'Botao WhatsApp'
        });
    }
}