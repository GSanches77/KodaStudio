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

    // =========================================================================
    // 13. Interactive 3D Canvas — Rede de Nós e Tráfego de Dados (Hero)
    // =========================================================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas && !prefersReduced) {
        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let animationFrameId = null;
        let isHeroVisible = true;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const particleCount = isMobile ? 26 : 48;
        const maxDist = isMobile ? 90 : 120;
        const particles = [];

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        // Inicializar partículas 3D em torno da origem
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * (width * 0.9),
                y: (Math.random() - 0.5) * (height * 0.9),
                z: (Math.random() - 0.5) * 360,
                baseRadius: Math.random() * 1.5 + 1.2,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                vz: (Math.random() - 0.5) * 0.25
            });
        }

        let rotX = 0;
        let rotY = 0;
        let targetRotX = 0;
        let targetRotY = 0;

        const heroEl = document.querySelector('.hero');
        if (heroEl) {
            heroEl.addEventListener('mousemove', (e) => {
                const rect = heroEl.getBoundingClientRect();
                const normX = (e.clientX - rect.left) / rect.width - 0.5;
                const normY = (e.clientY - rect.top) / rect.height - 0.5;
                targetRotY = normX * 0.35;
                targetRotX = -normY * 0.35;
            }, { passive: true });
        }

        const fov = 420;

        const render3D = (time) => {
            if (!isHeroVisible) return;

            ctx.clearRect(0, 0, width, height);

            // Rotação suave contínua + inércia do cursor
            targetRotY += 0.0008;
            targetRotX = Math.sin(time * 0.0006) * 0.08;

            rotX += (targetRotX - rotX) * 0.04;
            rotY += (targetRotY - rotY) * 0.04;

            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);

            const centerX = width * 0.55;
            const centerY = height * 0.5;

            const projected = [];

            // Atualizar e projetar partículas
            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;

                // Limites com bounce suave
                const boundX = width * 0.45;
                const boundY = height * 0.45;
                const boundZ = 200;
                if (Math.abs(p.x) > boundX) p.vx *= -1;
                if (Math.abs(p.y) > boundY) p.vy *= -1;
                if (Math.abs(p.z) > boundZ) p.vz *= -1;

                // Rotação Y
                const x1 = p.x * cosY - p.z * sinY;
                const z1 = p.z * cosY + p.x * sinY;

                // Rotação X
                const y2 = p.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + p.y * sinX;

                const scale = fov / (fov + z2 + 250);
                const projX = x1 * scale + centerX;
                const projY = y2 * scale + centerY;
                const alpha = Math.max(0.08, Math.min(0.85, (z2 + 200) / 400));

                projected.push({
                    x: projX,
                    y: projY,
                    z: z2,
                    scale: scale,
                    alpha: alpha,
                    radius: p.baseRadius * scale
                });
            }

            // Conectar nós próximos com feixes de luz
            for (let i = 0; i < particleCount; i++) {
                const pi = projected[i];
                for (let j = i + 1; j < particleCount; j++) {
                    const pj = projected[j];
                    const dx = pi.x - pj.x;
                    const dy = pi.y - pj.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const lineAlpha = (1 - dist / maxDist) * 0.22 * ((pi.alpha + pj.alpha) * 0.5);
                        ctx.strokeStyle = `rgba(0, 218, 255, ${lineAlpha})`;
                        ctx.lineWidth = 0.85 * pi.scale;
                        ctx.beginPath();
                        ctx.moveTo(pi.x, pi.y);
                        ctx.lineTo(pj.x, pj.y);
                        ctx.stroke();
                    }
                }
            }

            // Desenhar nós
            for (let i = 0; i < particleCount; i++) {
                const p = projected[i];
                ctx.fillStyle = `rgba(0, 218, 255, ${p.alpha * 0.9})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(0.8, p.radius), 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render3D);
        };

        // Economizar CPU/GPU quando fora da tela
        if (heroEl) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isHeroVisible = entry.isIntersecting;
                    if (isHeroVisible && !animationFrameId) {
                        animationFrameId = requestAnimationFrame(render3D);
                    } else if (!isHeroVisible && animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                });
            }, { threshold: 0.1 });
            heroObserver.observe(heroEl);
        }
    }

    // =========================================================================
    // 14. 3D Tilt Interativo nos Cards com Brilho Especular (Desktop)
    // =========================================================================
    const tiltCards = document.querySelectorAll('.service-card, .case-card');
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (tiltCards.length > 0 && hasFinePointer && !prefersReduced) {
        tiltCards.forEach(card => {
            let rafTilt = null;
            let rect = null;

            card.addEventListener('mouseenter', () => {
                rect = card.getBoundingClientRect();
                card.style.transition = 'transform 0.08s ease-out, border-color 0.2s, background-color 0.2s, box-shadow 0.2s';
            });

            card.addEventListener('mousemove', (e) => {
                if (!rect) rect = card.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const normX = Math.max(0, Math.min(1, mouseX / rect.width));
                const normY = Math.max(0, Math.min(1, mouseY / rect.height));

                // Definir coordenadas do reflexo especular
                card.style.setProperty('--mouse-x', `${mouseX}px`);
                card.style.setProperty('--mouse-y', `${mouseY}px`);

                const rotX = (0.5 - normY) * 11;
                const rotY = (normX - 0.5) * 13;

                if (!rafTilt) {
                    rafTilt = requestAnimationFrame(() => {
                        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02) translateZ(10px)`;
                        rafTilt = null;
                    });
                }
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                rect = null;
                card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s, background-color 0.2s, box-shadow 0.2s';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)';
                card.style.setProperty('--mouse-x', '-500px');
                card.style.setProperty('--mouse-y', '-500px');
            });
        });
    }

    // =========================================================================
    // 15. Parallax 3D nos Micro-Badges do Dataviz (Hero)
    // =========================================================================
    const badgeLead = document.querySelector('.dataviz-badge--lead');
    const badgeRoas = document.querySelector('.dataviz-badge--roas');
    const heroSection = document.querySelector('.hero');

    if (heroSection && badgeLead && badgeRoas && hasFinePointer && !prefersReduced) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const normX = (e.clientX - rect.left) / rect.width - 0.5;
            const normY = (e.clientY - rect.top) / rect.height - 0.5;

            badgeLead.style.transform = `translate(${(-normX * 16).toFixed(1)}px, ${(-normY * 12).toFixed(1)}px)`;
            badgeRoas.style.transform = `translate(${(normX * 18).toFixed(1)}px, ${(normY * 14).toFixed(1)}px)`;
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            badgeLead.style.transform = '';
            badgeRoas.style.transform = '';
        });
    }

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