/**
 * KODA STUDIO - MAIN SCRIPTS
 * Vanilla JS Performance-First Approach
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

    // Inject scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    const handleScroll = () => {
        // Header state
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }

        // Scroll progress
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
    });

    handleScroll();

    // =========================================================================
    // 3. Scroll Reveal via IntersectionObserver
    // =========================================================================
    const revealElements = document.querySelectorAll('.js-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================================================
    // 4. Service Cards — dynamic stagger on scroll entry
    // =========================================================================
    const serviceCards = document.querySelectorAll('.service-card');

    const cardsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = [...serviceCards];
                const idx = cards.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    serviceCards.forEach(card => cardsObserver.observe(card));

    // =========================================================================
    // 5. Method list items — staggered reveal
    // =========================================================================
    const methodItems = document.querySelectorAll('.method-list__item');

    const methodObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = [...methodItems];
                const idx = items.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, idx * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });

    methodItems.forEach(item => {
        item.classList.add('js-method-item');
        methodObserver.observe(item);
    });

    // =========================================================================
    // 6. Data-Viz Animation (Hero Section)
    // =========================================================================
    const datavizVisual = document.querySelector('.hero__visual');
    const counterEl = document.querySelector('.js-counter');
    const chartBars = document.querySelectorAll('.chart-bar');
    let datavizAnimated = false;

    const animateDataViz = () => {
        if (datavizAnimated) return;
        datavizAnimated = true;

        if (counterEl) {
            const target = parseInt(counterEl.getAttribute('data-target'), 10);
            const duration = 2000;
            const fps = 60;
            const frames = duration / (1000 / fps);
            const increment = target / frames;
            let current = 0;

            const counterInterval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counterEl.textContent = target.toLocaleString('en-US');
                    clearInterval(counterInterval);
                } else {
                    counterEl.textContent = Math.floor(current).toLocaleString('en-US');
                }
            }, 1000 / fps);
        }

        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('is-animated');
            }, index * 100);
        });
    };

    if (datavizVisual) {
        const datavizObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateDataViz, 400);
                    datavizObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        datavizObserver.observe(datavizVisual);
    }

    // =========================================================================
    // 7. Hero Cursor Glow Tracker
    // =========================================================================
    if (!prefersReduced) {
        const hero = document.querySelector('.hero');

        if (hero) {
            const glow = document.createElement('div');
            glow.className = 'hero-glow';
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
                        glowX += (targetX - glowX) * 0.08;
                        glowY += (targetY - glowY) * 0.08;
                        glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

                        if (Math.abs(targetX - glowX) > 0.5 || Math.abs(targetY - glowY) > 0.5) {
                            rafId = requestAnimationFrame(animate);
                        } else {
                            rafId = null;
                        }
                    });
                }
            });

            hero.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });

            hero.addEventListener('mouseenter', () => {
                glow.style.opacity = '1';
            });
        }
    }

    // =========================================================================
    // 8. Magnetic CTA Button
    // =========================================================================
    if (!prefersReduced) {
        const ctaBtn = document.querySelector('.hero__actions .btn--primary');

        if (ctaBtn) {
            ctaBtn.addEventListener('mousemove', (e) => {
                const rect = ctaBtn.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * 0.35;
                const dy = (e.clientY - cy) * 0.35;
                ctaBtn.style.transform = `translate(${dx}px, ${dy}px)`;
            });

            ctaBtn.addEventListener('mouseleave', () => {
                ctaBtn.style.transform = 'translate(0, 0)';
            });
        }
    }

    // =========================================================================
    // 9. Typed text effect — hero title accent word cycles
    // =========================================================================
    if (!prefersReduced) {
        const accentEl = document.querySelector('.hero__typed');
        // \n marks where the line break happens — renders as <br> via innerHTML
        const words = ['do seu\nnegócio', 'da sua\nmarca', 'da sua\nempresa', 'do seu\nfuturo'];
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const render = (str) => {
            accentEl.innerHTML = str.replace('\n', '<br>');
        };

        const type = () => {
            const current = words[wordIndex];

            if (deleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            render(current.substring(0, charIndex));

            let speed = deleting ? 50 : 90;

            if (!deleting && charIndex === current.length) {
                speed = 2200;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                speed = 300;
            }

            setTimeout(type, speed);
        };

        // Pre-fill first word instantly, then start erasing after pause
        setTimeout(() => {
            render(words[0]);
            charIndex = words[0].length;
            deleting = true;
            setTimeout(type, 2200);
        }, 1000);
    }

});