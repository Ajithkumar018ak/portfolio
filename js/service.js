
/* =========================================================
   NOX CREATIVE STUDIO — SERVICES.JS
   Hero Slider | Service Carousel | Mobile Drawer | Parallax
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       01. SETTINGS
    ===================================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const touchDevice = window.matchMedia(
        "(pointer: coarse)"
    ).matches;

    const mobileScreen = () => window.innerWidth <= 900;


    /* =====================================================
       02. BODY ANIMATION CLASS
    ===================================================== */

    if (!reducedMotion) {
        document.documentElement.classList.add("js-motion");
    }


    /* =====================================================
       03. SCROLL PROGRESS
    ===================================================== */

    const progressBar = document.getElementById("scrollProgress");

    let scrollTicking = false;

    function updateScrollProgress() {

        if (!progressBar) return;

        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage = scrollHeight > 0
            ? (window.scrollY / scrollHeight) * 100
            : 0;

        progressBar.style.width = `${percentage}%`;

        scrollTicking = false;
    }

    window.addEventListener("scroll", () => {

        if (!scrollTicking) {

            window.requestAnimationFrame(updateScrollProgress);

            scrollTicking = true;
        }

    }, { passive: true });

    updateScrollProgress();


    /* =====================================================
       04. HEADER SCROLL EFFECT
    ===================================================== */

    const header = document.getElementById("siteHeader");

    function updateHeader() {

        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =====================================================
       05. MOBILE DRAWER & ESC KEY
       Centrally managed by main.js
    ===================================================== */


    /* =====================================================
       07. SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

    } else {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element, index) => {

            if (element.closest(".services-carousel")) {

                element.style.transitionDelay =
                    `${(index % 3) * 80}ms`;

            }

            revealObserver.observe(element);

        });
    }


    /* =====================================================
       08. HERO IMAGE SLIDER
    ===================================================== */

    const heroSlides = [
        ...document.querySelectorAll(".hero-slide")
    ];

    const heroDots = [
        ...document.querySelectorAll(".hero-pagination-dot")
    ];

    const heroPrev = document.getElementById("heroPrev");
    const heroNext = document.getElementById("heroNext");
    const heroCurrent = document.getElementById("heroCurrent");

    let heroIndex = 0;
    let heroTimer = null;

    const HERO_INTERVAL = 5500;

    function showHeroSlide(index) {

        if (!heroSlides.length) return;

        heroIndex = (
            index + heroSlides.length
        ) % heroSlides.length;

        heroSlides.forEach((slide, i) => {

            const active = i === heroIndex;

            slide.classList.toggle("active", active);

            slide.setAttribute(
                "aria-hidden",
                String(!active)
            );

        });

        heroDots.forEach((dot, i) => {

            const active = i === heroIndex;

            dot.classList.toggle("active", active);

            dot.setAttribute(
                "aria-pressed",
                String(active)
            );

        });

        if (heroCurrent) {

            heroCurrent.textContent = String(
                heroIndex + 1
            ).padStart(2, "0");

        }
    }

    function stopHeroAutoplay() {

        if (heroTimer !== null) {

            window.clearInterval(heroTimer);
            heroTimer = null;
        }
    }

    function startHeroAutoplay() {

        stopHeroAutoplay();

        if (reducedMotion || heroSlides.length < 2) return;

        heroTimer = window.setInterval(() => {

            showHeroSlide(heroIndex + 1);

        }, HERO_INTERVAL);
    }

    function restartHeroAutoplay() {
        startHeroAutoplay();
    }

    if (heroSlides.length) {

        showHeroSlide(0);

        if (heroPrev) {

            heroPrev.addEventListener("click", () => {

                showHeroSlide(heroIndex - 1);
                restartHeroAutoplay();

            });
        }

        if (heroNext) {

            heroNext.addEventListener("click", () => {

                showHeroSlide(heroIndex + 1);
                restartHeroAutoplay();

            });
        }

        heroDots.forEach((dot, index) => {

            dot.addEventListener("click", () => {

                showHeroSlide(index);
                restartHeroAutoplay();

            });

        });

        const heroSection = document.getElementById("serviceHero");

        if (heroSection) {

            heroSection.addEventListener("mouseenter", stopHeroAutoplay);

            heroSection.addEventListener("mouseleave", startHeroAutoplay);

            heroSection.addEventListener("focusin", stopHeroAutoplay);

            heroSection.addEventListener("focusout", startHeroAutoplay);

        }

        document.addEventListener("visibilitychange", () => {

            if (document.hidden) {
                stopHeroAutoplay();
            } else {
                startHeroAutoplay();
            }

        });

        startHeroAutoplay();
    }


    /* =====================================================
       09. HERO MOUSE PARALLAX
    ===================================================== */

    const heroSection = document.getElementById("serviceHero");

    const activeHeroImage = () => {
        return document.querySelector(".hero-slide.active img");
    };

    if (
        heroSection &&
        !touchDevice &&
        !reducedMotion
    ) {

        let heroFrame = null;

        heroSection.addEventListener("mousemove", event => {

            if (heroFrame) {
                cancelAnimationFrame(heroFrame);
            }

            heroFrame = requestAnimationFrame(() => {

                const rect = heroSection.getBoundingClientRect();

                const x = (
                    event.clientX - rect.left
                ) / rect.width - .5;

                const y = (
                    event.clientY - rect.top
                ) / rect.height - .5;

                const image = activeHeroImage();

                if (image) {

                    image.style.transform =
                        `scale(1.18) translate3d(${-x * 15}px, ${-y * 12}px, 0)`;
                }

                const orbOne = heroSection.querySelector(".hero-orb-one");

                if (orbOne) {

                    orbOne.style.marginLeft = `${x * 14}px`;
                    orbOne.style.marginTop = `${y * 12}px`;
                }

            });

        });

        heroSection.addEventListener("mouseleave", () => {

            const image = activeHeroImage();

            if (image) {
                image.style.transform = "";
            }

            const orbOne = heroSection.querySelector(".hero-orb-one");

            if (orbOne) {
                orbOne.style.marginLeft = "";
                orbOne.style.marginTop = "";
            }

        });
    }


    /* =====================================================
       10. SERVICES CAROUSEL
    ===================================================== */

    const servicesCarousel = document.getElementById(
        "servicesCarousel"
    );

    const servicesPrev = document.getElementById("servicesPrev");
    const servicesNext = document.getElementById("servicesNext");

    const servicesProgress = document.getElementById(
        "servicesProgress"
    );

    const servicesCurrent = document.getElementById(
        "servicesCurrent"
    );

    const serviceCards = servicesCarousel
        ? [...servicesCarousel.querySelectorAll(".service-card")]
        : [];

    let carouselScrollFrame = null;
    let carouselPointerDown = false;
    let carouselStartX = 0;
    let carouselStartScroll = 0;
    let carouselMoved = false;


    function getCarouselStep() {

        if (!servicesCarousel) return 0;

        const firstCard = serviceCards[0];

        if (!firstCard) return 0;

        const styles = window.getComputedStyle(servicesCarousel);

        const gap = parseFloat(styles.columnGap) || 0;

        return firstCard.getBoundingClientRect().width + gap;
    }


    function getVisibleCarouselCount() {

        if (!servicesCarousel) return 1;

        const step = getCarouselStep();

        if (!step) return 1;

        return Math.max(
            1,
            Math.floor(
                (servicesCarousel.clientWidth + 1) / step
            )
        );
    }


    function getMaximumCarouselIndex() {

        return Math.max(
            0,
            serviceCards.length - getVisibleCarouselCount()
        );
    }


    function getCurrentCarouselIndex() {

        const step = getCarouselStep();

        if (!step) return 0;

        return Math.min(
            getMaximumCarouselIndex(),
            Math.max(
                0,
                Math.round(servicesCarousel.scrollLeft / step)
            )
        );
    }


    function updateCarouselUI() {

        if (!servicesCarousel) return;

        const maxScroll =
            servicesCarousel.scrollWidth -
            servicesCarousel.clientWidth;

        const currentIndex = getCurrentCarouselIndex();

        const visibleCount = getVisibleCarouselCount();

        const maximumIndex = getMaximumCarouselIndex();

        if (servicesProgress) {

            const progress = maxScroll > 0
                ? (servicesCarousel.scrollLeft / maxScroll) * 100
                : 100;

            servicesProgress.style.width = `${progress}%`;
        }

        if (servicesCurrent) {

            servicesCurrent.textContent = String(
                Math.min(
                    serviceCards.length,
                    currentIndex + visibleCount
                )
            ).padStart(2, "0");
        }

        if (servicesPrev) {

            servicesPrev.disabled =
                servicesCarousel.scrollLeft <= 2;
        }

        if (servicesNext) {

            servicesNext.disabled =
                servicesCarousel.scrollLeft >= maxScroll - 2;
        }
    }


    function moveServicesCarousel(direction) {

        if (!servicesCarousel) return;

        const step = getCarouselStep();

        if (!step) return;

        const targetIndex = Math.min(
            getMaximumCarouselIndex(),
            Math.max(
                0,
                getCurrentCarouselIndex() + direction
            )
        );

        servicesCarousel.scrollTo({

            left: targetIndex * step,

            behavior: reducedMotion ? "auto" : "smooth"

        });
    }


    if (servicesCarousel) {

        if (servicesPrev) {

            servicesPrev.addEventListener("click", () => {
                moveServicesCarousel(-1);
            });
        }

        if (servicesNext) {

            servicesNext.addEventListener("click", () => {
                moveServicesCarousel(1);
            });
        }

        servicesCarousel.addEventListener("scroll", () => {

            if (carouselScrollFrame) return;

            carouselScrollFrame = requestAnimationFrame(() => {

                updateCarouselUI();

                carouselScrollFrame = null;
            });

        }, { passive: true });


        /* MOUSE DRAG */

        if (!touchDevice) {

            servicesCarousel.addEventListener("pointerdown", event => {

                if (event.pointerType === "touch") return;

                if (
                    event.target.closest("a, button")
                ) {
                    return;
                }

                carouselPointerDown = true;
                carouselMoved = false;

                carouselStartX = event.clientX;
                carouselStartScroll = servicesCarousel.scrollLeft;

                servicesCarousel.classList.add("dragging");

                servicesCarousel.setPointerCapture?.(
                    event.pointerId
                );
            });


            servicesCarousel.addEventListener("pointermove", event => {

                if (!carouselPointerDown) return;

                const difference =
                    event.clientX - carouselStartX;

                if (Math.abs(difference) > 5) {
                    carouselMoved = true;
                }

                servicesCarousel.scrollLeft =
                    carouselStartScroll - difference;
            });


            function finishCarouselDrag() {

                if (!carouselPointerDown) return;

                carouselPointerDown = false;

                servicesCarousel.classList.remove("dragging");

                updateCarouselUI();
            }

            servicesCarousel.addEventListener(
                "pointerup",
                finishCarouselDrag
            );

            servicesCarousel.addEventListener(
                "pointercancel",
                finishCarouselDrag
            );

            servicesCarousel.addEventListener(
                "lostpointercapture",
                finishCarouselDrag
            );

            servicesCarousel.addEventListener("click", event => {

                if (carouselMoved) {

                    event.preventDefault();
                    event.stopPropagation();

                    carouselMoved = false;
                }

            }, true);
        }


        /* KEYBOARD SUPPORT */

        servicesCarousel.addEventListener("keydown", event => {

            if (event.key === "ArrowRight") {

                event.preventDefault();
                moveServicesCarousel(1);

            } else if (event.key === "ArrowLeft") {

                event.preventDefault();
                moveServicesCarousel(-1);

            }
        });


        /* INITIAL UPDATE */

        updateCarouselUI();

        window.addEventListener("resize", updateCarouselUI, {
            passive: true
        });
    }


    /* =====================================================
       11. SERVICE CARD POINTER EFFECT
    ===================================================== */

    if (!touchDevice && !reducedMotion) {

        serviceCards.forEach(card => {

            card.addEventListener("mousemove", event => {

                const rect = card.getBoundingClientRect();

                const x = (
                    event.clientX - rect.left
                ) / rect.width;

                const y = (
                    event.clientY - rect.top
                ) / rect.height;

                card.style.setProperty(
                    "--pointer-x",
                    `${x * 100}%`
                );

                card.style.setProperty(
                    "--pointer-y",
                    `${y * 100}%`
                );

            });

        });
    }


    /* =====================================================
       12. CREATIVE SHOWCASE PARALLAX
    ===================================================== */

    const creativeVisual = document.querySelector(".creative-visual");

    if (
        creativeVisual &&
        !touchDevice &&
        !reducedMotion
    ) {

        const creativeImage = creativeVisual.querySelector("img");

        creativeVisual.addEventListener("mousemove", event => {

            const rect = creativeVisual.getBoundingClientRect();

            const x = (
                event.clientX - rect.left
            ) / rect.width - .5;

            const y = (
                event.clientY - rect.top
            ) / rect.height - .5;

            if (creativeImage) {

                creativeImage.style.transform =
                    `scale(1.07) translate3d(${-x * 13}px, ${-y * 10}px, 0)`;
            }

        });

        creativeVisual.addEventListener("mouseleave", () => {

            if (creativeImage) {
                creativeImage.style.transform = "";
            }

        });
    }


    /* =====================================================
       13. CTA DECORATION PARALLAX
    ===================================================== */

    const ctaPanel = document.querySelector(".cta-panel");
    const ctaDecoration = document.querySelector(".cta-decoration");

    if (
        ctaPanel &&
        ctaDecoration &&
        !touchDevice &&
        !reducedMotion
    ) {

        ctaPanel.addEventListener("mousemove", event => {

            const rect = ctaPanel.getBoundingClientRect();

            const x = (
                event.clientX - rect.left
            ) / rect.width - .5;

            const y = (
                event.clientY - rect.top
            ) / rect.height - .5;

            ctaDecoration.style.marginLeft = `${x * 16}px`;
            ctaDecoration.style.marginTop = `${y * 16}px`;

        });

        ctaPanel.addEventListener("mouseleave", () => {

            ctaDecoration.style.marginLeft = "";
            ctaDecoration.style.marginTop = "";

        });
    }


    /* =====================================================
       14. INTERNAL SMOOTH LINKS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({

                behavior: reducedMotion ? "auto" : "smooth",

                block: "start"

            });

        });
    });


    /* =====================================================
       15. CURRENT YEAR
    ===================================================== */

    document.querySelectorAll("[data-current-year]").forEach(element => {

        element.textContent = new Date().getFullYear();

    });


    /* =====================================================
       16. RESIZE CLEANUP
    ===================================================== */

    window.addEventListener("resize", () => {

        if (mobileScreen()) {

            if (heroSection) {

                const heroImage = heroSection.querySelector(
                    ".hero-slide.active img"
                );

                if (heroImage) {
                    heroImage.style.transform = "";
                }
            }

            if (creativeVisual) {

                const image = creativeVisual.querySelector("img");

                if (image) image.style.transform = "";
            }
        }

        updateScrollProgress();

    }, { passive: true });


    /* =====================================================
       17. PAGE READY
    ===================================================== */

    document.body.classList.add("page-ready");

    window.addEventListener("load", () => {

        document.body.classList.add("page-loaded");

        updateScrollProgress();
        updateCarouselUI();

    });


    /* =====================================================
       18. BRAND CONSOLE
    ===================================================== */

    console.log(
        "%c NOX CREATIVE STUDIO ",
        "background:#ff6b2c;color:#080808;font-size:14px;font-weight:900;padding:8px 12px;"
    );

});
