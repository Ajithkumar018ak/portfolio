

document.addEventListener("DOMContentLoaded", () => {


/* =====================================================
   HELPERS
===================================================== */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =====================================================
   SCROLL PROGRESS
===================================================== */

const scrollProgress = $("#scrollProgress");

function updateScrollProgress() {
    if (!scrollProgress) return;

    const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress = maxScroll > 0
        ? (window.scrollY / maxScroll) * 100
        : 0;

    scrollProgress.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, {
    passive: true
});

window.addEventListener("resize", updateScrollProgress);

updateScrollProgress();


/* =====================================================
   HEADER SCROLL EFFECT
===================================================== */

const siteHeader = $("#siteHeader");
const backToTop = $("#backToTop");

function updateHeader() {
    siteHeader?.classList.toggle(
        "scrolled",
        window.scrollY > 40
    );

    backToTop?.classList.toggle(
        "visible",
        window.scrollY > 400
    );
}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();


/* =====================================================
   BACK TO TOP
===================================================== */

backToTop?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
    });
});


/* =====================================================
   3D PRELOADER
   Camera → Loading → Lens zoom → Website
===================================================== */

const preloader = $("#noxPreloader");
const preloaderPercentage = $("#preloaderPercentage");
const preloaderProgress = $("#preloaderProgress");
const preloaderMessage = $("#preloaderMessage");

const lensTransition = $("#lensTransition");
const cameraLens = $("#cameraLens");

let preloaderStarted = false;
let preloaderFinished = false;

function finishPreloader() {
    if (preloaderFinished) return;

    preloaderFinished = true;

    if (preloaderPercentage) {
        preloaderPercentage.textContent = "100";
    }

    if (preloaderProgress) {
        preloaderProgress.style.width = "100%";
    }

    if (preloaderMessage) {
        preloaderMessage.textContent =
            "WELCOME TO NOX";
    }

    preloader?.classList.add("is-complete");

    window.setTimeout(() => {
        lensTransition?.classList.add("active");
        cameraLens?.classList.add("lens-zoom");

        preloader?.classList.add("lens-zooming");
    }, reduceMotion ? 0 : 250);

    window.setTimeout(() => {
        preloader?.classList.add("loaded");

        preloader?.setAttribute("aria-hidden", "true");

        document.body.classList.add("site-ready");
        document.body.classList.remove("is-loading");

        if (preloader) {
            preloader.style.pointerEvents = "none";
        }

        lensTransition?.classList.remove("active");
    }, reduceMotion ? 100 : 1500);
}

function startPreloader() {
    if (preloaderStarted) return;

    preloaderStarted = true;

    if (!preloader) {
        document.body.classList.add("site-ready");
        return;
    }

    document.body.classList.add("is-loading");

    let progress = 0;

    const duration = reduceMotion ? 100 : 2300;
    const interval = 30;
    const increment = 100 / (duration / interval);

    const timer = window.setInterval(() => {
        progress = Math.min(100, progress + increment);

        if (preloaderPercentage) {
            preloaderPercentage.textContent =
                String(Math.floor(progress)).padStart(2, "0");
        }

        if (preloaderProgress) {
            preloaderProgress.style.width = `${progress}%`;
        }

        if (preloaderMessage) {
            if (progress < 25) {
                preloaderMessage.textContent =
                    "INITIALIZING CREATIVE STUDIO";
            } else if (progress < 55) {
                preloaderMessage.textContent =
                    "BUILDING THE EXPERIENCE";
            } else if (progress < 85) {
                preloaderMessage.textContent =
                    "FOCUSING THE VISION";
            } else {
                preloaderMessage.textContent =
                    "PREPARING YOUR EXPERIENCE";
            }
        }

        if (progress >= 100) {
            clearInterval(timer);
            finishPreloader();
        }
    }, interval);
}

if (preloader) {
    if (document.readyState === "complete") {
        startPreloader();
    } else {
        window.addEventListener("load", startPreloader, {
            once: true
        });

        // Fallback: broken images should not block the site.
        window.setTimeout(startPreloader, 1800);
    }
} else {
    document.body.classList.add("site-ready");
}


/* =====================================================
   HERO SLIDER — 3 IMAGES
===================================================== */

const heroSlides = $$(".hero-slide");
const slideCurrent = $("#slideCurrent");

const slidePrev = $("#slidePrev");
const slideNext = $("#slideNext");

let currentSlide = Math.max(
    0,
    heroSlides.findIndex(slide =>
        slide.classList.contains("active")
    )
);

let heroTimer = null;
const heroDelay = 6000;

function showHeroSlide(index) {
    if (!heroSlides.length) return;

    currentSlide =
        (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, i) => {
        const active = i === currentSlide;

        slide.classList.toggle("active", active);

        slide.setAttribute(
            "aria-hidden",
            active ? "false" : "true"
        );
    });

    if (slideCurrent) {
        slideCurrent.textContent =
            String(currentSlide + 1).padStart(2, "0");
    }
}

function stopHeroAutoplay() {
    if (heroTimer) {
        clearInterval(heroTimer);
        heroTimer = null;
    }
}

function startHeroAutoplay() {
    stopHeroAutoplay();

    if (reduceMotion || heroSlides.length < 2) return;

    heroTimer = setInterval(() => {
        showHeroSlide(currentSlide + 1);
    }, heroDelay);
}

slidePrev?.addEventListener("click", () => {
    showHeroSlide(currentSlide - 1);
    startHeroAutoplay();
});

slideNext?.addEventListener("click", () => {
    showHeroSlide(currentSlide + 1);
    startHeroAutoplay();
});

if (heroSlides.length) {
    showHeroSlide(currentSlide);
    startHeroAutoplay();
}


/* =====================================================
   INTRO PLAY BUTTON
===================================================== */

$("#introPlay")?.addEventListener("click", () => {
    const manifesto = $(".manifesto-section");

    if (manifesto) {
        manifesto.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start"
        });
    }
});


/* =====================================================
   MOBILE DRAWER
===================================================== */

const menuToggle = $("#menuToggle");
const mobileOverlay = $("#mobileOverlay");
const mobileDrawer = $("#mobileDrawer");
const drawerClose = $("#drawerClose");

function openDrawer() {
    if (!mobileDrawer || !mobileOverlay) return;

    mobileDrawer.classList.add("active", "open");
    mobileOverlay.classList.add("active", "open");

    menuToggle?.classList.add("active");

    mobileDrawer.setAttribute("aria-hidden", "false");

    menuToggle?.setAttribute("aria-expanded", "true");

    document.body.classList.add("drawer-open");
}

function closeDrawer() {
    mobileDrawer?.classList.remove("active", "open");
    mobileOverlay?.classList.remove("active", "open");

    menuToggle?.classList.remove("active");

    mobileDrawer?.setAttribute("aria-hidden", "true");

    menuToggle?.setAttribute("aria-expanded", "false");

    document.body.classList.remove("drawer-open");
}

menuToggle?.addEventListener("click", () => {
    const isOpen =
        mobileDrawer?.classList.contains("active") ||
        mobileDrawer?.classList.contains("open");

    if (isOpen) {
        closeDrawer();
    } else {
        openDrawer();
    }
});

drawerClose?.addEventListener("click", closeDrawer);

mobileOverlay?.addEventListener("click", closeDrawer);

$$("#mobileDrawer a, #mobileDrawer .login-trigger")
    .forEach(link => {
        link.addEventListener("click", closeDrawer);
    });


/* =====================================================
   SMOOTH SCROLL
===================================================== */

$$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = $(href);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "start"
        });

        closeDrawer();
    });
});


/* =====================================================
   LOGIN MODAL
===================================================== */

const loginModal = $("#loginModal");
const loginModalClose = $("#loginModalClose");

const loginTriggers = $$(".login-trigger");
const loginTabs = $$(".login-tab");
const loginForms = $$(".login-form");

let previousFocus = null;

function setLoginTab(type) {
    const selected = type === "admin" ? "admin" : "user";

    loginTabs.forEach(tab => {
        const active = tab.dataset.loginTab === selected;

        tab.classList.toggle("active", active);

        tab.setAttribute(
            "aria-selected",
            active ? "true" : "false"
        );
    });

    loginForms.forEach(form => {
        const active = form.dataset.loginForm === selected;

        form.classList.toggle("active", active);
    });

    const loginTitle = $("#loginTitle");

    if (loginTitle) {
        loginTitle.innerHTML = selected === "admin"
            ? 'Sign in to <span>your team.</span>'
            : 'Sign in to <span>continue.</span>';
    }
}

function openLoginModal(type = "user") {
    if (!loginModal) {
        console.error("Missing #loginModal in index.html");
        return;
    }

    previousFocus = document.activeElement;

    closeDrawer();

    loginModal.classList.add("active", "show", "open");

    loginModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    setLoginTab(type);

    window.setTimeout(() => {
        const activeForm = $(".login-form.active", loginModal);
        const firstInput = $("input", activeForm || loginModal);

        firstInput?.focus();
    }, 120);
}

function closeLoginModal() {
    if (!loginModal) return;

    loginModal.classList.remove("active", "show", "open");

    loginModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    previousFocus?.focus?.();
}

loginTriggers.forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();

        const requestedTab =
            button.dataset.loginType === "admin"
                ? "admin"
                : "user";

        openLoginModal(requestedTab);
    });
});

loginModalClose?.addEventListener(
    "click",
    closeLoginModal
);

loginModal?.addEventListener("click", event => {
    if (event.target === loginModal) {
        closeLoginModal();
    }
});

loginTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        setLoginTab(tab.dataset.loginTab);
    });
});


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

$$("[data-password-toggle]").forEach(button => {
    button.addEventListener("click", () => {
        const id = button.dataset.passwordToggle;
        const input = id ? document.getElementById(id) : null;

        if (!input) return;

        const show = input.type === "password";

        input.type = show ? "text" : "password";

        button.setAttribute(
            "aria-label",
            show ? "Hide password" : "Show password"
        );

        const icon = $("i", button);

        if (icon) {
            icon.classList.toggle("fa-eye", !show);
            icon.classList.toggle("fa-eye-slash", show);
            icon.classList.toggle("fa-regular", !show);
            icon.classList.toggle("fa-solid", show);
        }
    });
});


/* =====================================================
   LOGIN FORM → USER / ADMIN DASHBOARD
   Demo redirect only; no credential verification.
===================================================== */

function attachLogin(formId, dashboard, role) {
    const form = document.getElementById(formId);

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        let feedback = $(".login-feedback", form);

        if (!feedback) {
            feedback = document.createElement("p");
            feedback.className = "login-feedback";
            feedback.setAttribute("role", "status");

            form.appendChild(feedback);
        }

        feedback.textContent =
            `${role} login successful. Redirecting to dashboard...`;

        feedback.style.cssText = `
            display: block;
            color: #58d68d;
            font-size: 13px;
            line-height: 1.6;
            margin-top: 12px;
        `;

        const submitButton = $(
            'button[type="submit"]',
            form
        );

        if (submitButton) {
            submitButton.disabled = true;
        }

        window.setTimeout(() => {
            window.location.href = dashboard;
        }, 600);
    });
}

attachLogin(
    "userLoginForm",
    "user-dashboard.html",
    "Client"
);

attachLogin(
    "adminLoginForm",
    "admin-dashboard.html",
    "Team"
);


/* =====================================================
   ESC KEY — CLOSE MODAL / DRAWER
===================================================== */

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    closeLoginModal();
    closeDrawer();
});


/* =====================================================
   SCROLL REVEAL ANIMATIONS
   Uses your existing .reveal HTML classes.
===================================================== */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");

                revealObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach(element => {
        element.classList.add("is-visible");
    });
}


/* =====================================================
   COUNTER ANIMATION
===================================================== */

const counters = $$("[data-count]");

function animateCounter(element) {
    if (element.dataset.counted === "true") return;

    element.dataset.counted = "true";

    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) return;

    const duration = reduceMotion ? 0 : 1300;
    const start = performance.now();

    function step(now) {
        const elapsed = now - start;

        const progress = duration === 0
            ? 1
            : Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 4);

        element.textContent = String(
            Math.round(target * eased)
        ).padStart(2, "0");

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                animateCounter(entry.target);

                counterObserver.unobserve(entry.target);
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
} else {
    counters.forEach(animateCounter);
}


/* =====================================================
   TESTIMONIAL SLIDER + PAGINATION
===================================================== */

const testimonialSlides = $$(".testimonial-slide");

const testimonialCurrent = $("#testimonialCurrent");

const testimonialPrev = $("#testimonialPrev");
const testimonialNext = $("#testimonialNext");

const testimonialDots = $$(".testimonial-pagination i");

let currentTestimonial = Math.max(
    0,
    testimonialSlides.findIndex(slide =>
        slide.classList.contains("active")
    )
);

function showTestimonial(index) {
    if (!testimonialSlides.length) return;

    currentTestimonial =
        (index + testimonialSlides.length) %
        testimonialSlides.length;

    testimonialSlides.forEach((slide, i) => {
        const active = i === currentTestimonial;

        slide.classList.toggle("active", active);

        slide.setAttribute(
            "aria-hidden",
            active ? "false" : "true"
        );
    });

    testimonialDots.forEach((dot, i) => {
        dot.classList.toggle(
            "active",
            i === currentTestimonial
        );
    });

    if (testimonialCurrent) {
        testimonialCurrent.textContent =
            String(currentTestimonial + 1).padStart(2, "0");
    }
}

testimonialPrev?.addEventListener("click", () => {
    showTestimonial(currentTestimonial - 1);
});

testimonialNext?.addEventListener("click", () => {
    showTestimonial(currentTestimonial + 1);
});

testimonialDots.forEach((dot, index) => {
    dot.setAttribute("role", "button");
    dot.setAttribute("tabindex", "0");
    dot.setAttribute(
        "aria-label",
        `Show testimonial ${index + 1}`
    );

    dot.addEventListener("click", () => {
        showTestimonial(index);
    });

    dot.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showTestimonial(index);
        }
    });
});

if (testimonialSlides.length) {
    showTestimonial(currentTestimonial);
}


/* =====================================================
   ACTIVE NAVIGATION LINK
===================================================== */

const navLinks = $$(
    '.desktop-nav a[href^="#"]'
);

const navSections = navLinks
    .map(link => $(link.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window && navSections.length) {
    const navObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navLinks.forEach(link => {
                    const active =
                        link.getAttribute("href") ===
                        `#${entry.target.id}`;

                    link.classList.toggle("active", active);
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    navSections.forEach(section => {
        navObserver.observe(section);
    });
}


/* =====================================================
   IMAGE LOAD FALLBACK
===================================================== */

$$(
    ".project-image img, .manifesto-image img, " +
    ".login-visual img, .client-meta img"
).forEach(image => {
    image.addEventListener("error", () => {
        image.classList.add("image-unavailable");
    });
});


/* =====================================================
   MODAL / DRAWER / REVEAL CSS SAFETY
   Prevent content from remaining invisible.
===================================================== */

const runtimeStyle = document.createElement("style");

runtimeStyle.textContent = `
    .reveal {
        opacity: 1;
        visibility: visible;
    }

    .reveal.is-visible {
        opacity: 1;
        visibility: visible;
    }

    .modal-overlay {
        display: none;
    }

    .modal-overlay.active,
    .modal-overlay.show,
    .modal-overlay.open,
    .modal-overlay[aria-hidden="false"] {
        display: flex;
        visibility: visible;
        opacity: 1;
        pointer-events: auto;
    }

    .mobile-overlay {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
    }

    .mobile-overlay.active,
    .mobile-overlay.open {
        visibility: visible;
        opacity: 1;
        pointer-events: auto;
    }

    .mobile-drawer {
        visibility: hidden;
        pointer-events: none;
    }

    .mobile-drawer.active,
    .mobile-drawer.open {
        visibility: visible;
        pointer-events: auto;
        transform: translateX(0);
    }

    #noxPreloader.loaded {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    #scrollProgress {
        width: 0;
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(runtimeStyle);


/* =====================================================
   READY
===================================================== */

document.body.classList.add("js-enabled");

console.log("NOX Creative Studio JavaScript initialized.");


});




















/* ============================================
   NOX — KEEP HOME LINK ALWAYS ACTIVE
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    const desktopLinks = document.querySelectorAll(
        ".desktop-nav a"
    );

    const mobileLinks = document.querySelectorAll(
        "#mobileDrawer nav a"
    );

    function keepHomeActive() {

        desktopLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#home"
            );
        });

        mobileLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#home"
            );
        });

    }

    // Page load
    keepHomeActive();

    // Scroll pannalum Home active
    window.addEventListener("scroll", keepHomeActive, {
        passive: true
    });

    // Menu click pannalum Home active
    desktopLinks.forEach(link => {
        link.addEventListener("click", keepHomeActive);
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", keepHomeActive);
    });

});






/* =========================================================
   NOX CREATIVE STUDIO — 3D HERO CAROUSEL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const hero = document.querySelector(".nox-hero");

    if (!hero) return;

    const cards = [...hero.querySelectorAll(".nox-image-card")];
    const backgrounds = [...hero.querySelectorAll(".nox-background")];

    const previousButton = hero.querySelector("#noxSlidePrev");
    const nextButton = hero.querySelector("#noxSlideNext");

    const currentNumber = hero.querySelector("#noxSlideCurrent");
    const captionNumber = hero.querySelector("#noxCaptionNumber");
    const progressBar = hero.querySelector("#noxCarouselProgress");

    const category = hero.querySelector("#noxHeroCategory");
    const title = hero.querySelector("#noxHeroTitle");
    const description = hero.querySelector("#noxHeroDescription");
    const caption = hero.querySelector("#noxHeroCaption");
    const imageLabel = hero.querySelector("#noxImageLabel");

    const total = cards.length;

    if (!total) return;

    const slideContent = [
        {
            category: "01 / BRAND EXPERIENCE",
            title: "Ideas made<br><span>impossible</span><br>to ignore<span class='nox-title-dot'>.</span>",
            description:
                "We build distinctive brands, digital experiences and visual stories for people moving culture forward.",
            caption: "STRATEGY · DESIGN · DIGITAL",
            label: "CREATIVE DIRECTION"
        },
        {
            category: "02 / DIGITAL WORLDS",
            title: "Digital made<br><span>beautifully</span><br>different<span class='nox-title-dot'>.</span>",
            description:
                "We transform ambitious ideas into immersive digital experiences that make people stop, explore and remember.",
            caption: "WEB · EXPERIENCE · INNOVATION",
            label: "DIGITAL EXPERIENCE"
        },
        {
            category: "03 / VISUAL CULTURE",
            title: "Make your<br><span>presence</span><br>impossible to miss<span class='nox-title-dot'>.</span>",
            description:
                "From bold campaign visuals to distinctive art direction, we create work with a clear point of view.",
            caption: "ART DIRECTION · CAMPAIGNS",
            label: "VISUAL STORYTELLING"
        },
        {
            category: "04 / CREATIVE THINKING",
            title: "Good ideas<br><span>deserve</span><br>great design<span class='nox-title-dot'>.</span>",
            description:
                "Strategy, identity and thoughtful design come together to give ambitious brands a world of their own.",
            caption: "IDENTITY · STRATEGY · DESIGN",
            label: "BRAND IDENTITY"
        },
        {
            category: "05 / FUTURE FORWARD",
            title: "Create what<br><span>comes</span><br>next<span class='nox-title-dot'>.</span>",
            description:
                "We partner with forward-thinking teams to shape new ideas, explore fresh possibilities and build what is next.",
            caption: "IDEAS · MOTION · FUTURE",
            label: "EXPERIMENTAL DESIGN"
        }
    ];

    let activeIndex = 0;
    let autoplayTimer;
    let resizeTimer;

    const modulo = (number, length) => {
        return ((number % length) + length) % length;
    };

    function positionCards() {

        const isMobile = window.innerWidth <= 760;
        const isSmallMobile = window.innerWidth <= 420;

        const stage = hero.querySelector("#noxCarouselStage");
        const stageWidth = stage ? stage.clientWidth : 600;

        const spacing = isMobile
            ? (isSmallMobile ? 112 : 135)
            : Math.min(185, stageWidth * 0.31);

        cards.forEach((card, index) => {

            const offset = index - activeIndex;
            const normalizedOffset = modulo(offset + Math.floor(total / 2), total)
                - Math.floor(total / 2);

            const position = normalizedOffset;

            const x = position * spacing;

            const rotateY = position * -14;
            const rotateZ = position * -2.5;

            const scale = position === 0
                ? 1
                : Math.max(0.70, 1 - Math.abs(position) * 0.105);

            const z = position === 0
                ? 100
                : -Math.abs(position) * 75;

            const opacity = Math.abs(position) > 2
                ? 0
                : position === 0
                    ? 1
                    : 0.82;

            card.style.transform =
                `translate(-50%, -50%) ` +
                `translate3d(${x}px, 0, ${z}px) ` +
                `rotateY(${rotateY}deg) ` +
                `rotateZ(${rotateZ}deg) ` +
                `scale(${scale})`;

            card.style.opacity = opacity;
            card.style.zIndex = String(20 - Math.abs(position));

            card.style.pointerEvents = position === 0 ? "auto" : "none";

            card.classList.toggle("is-active", position === 0);

            card.setAttribute(
                "aria-label",
                `Creative image ${index + 1} of ${total}`
            );
        });
    }

    function updateBackground(index) {

        backgrounds.forEach((background, backgroundIndex) => {
            background.classList.toggle(
                "active",
                backgroundIndex === index
            );
        });
    }

    function updateText(index) {

        const content = slideContent[index];

        if (!content) return;

        if (category) {
            category.textContent = content.category;
        }

        if (title) {
            title.innerHTML = content.title;
        }

        if (description) {
            description.textContent = content.description;
        }

        if (caption) {
            caption.textContent = content.caption;
        }

        if (imageLabel) {
            imageLabel.textContent = content.label;
        }

        const formattedNumber = String(index + 1).padStart(2, "0");

        if (currentNumber) {
            currentNumber.textContent = formattedNumber;
        }

        if (captionNumber) {
            captionNumber.textContent = formattedNumber;
        }

        if (progressBar) {
            progressBar.style.width =
                `${((index + 1) / total) * 100}%`;
        }
    }

    function goToSlide(index) {

        activeIndex = modulo(index, total);

        positionCards();
        updateBackground(activeIndex);
        updateText(activeIndex);
    }

    function nextSlide() {
        goToSlide(activeIndex + 1);
    }

    function previousSlide() {
        goToSlide(activeIndex - 1);
    }

    function startAutoplay() {

        stopAutoplay();

        autoplayTimer = window.setInterval(() => {
            if (document.hidden) return;
            nextSlide();
        }, 5500);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            nextSlide();
            startAutoplay();
        });
    }

    if (previousButton) {
        previousButton.addEventListener("click", () => {
            previousSlide();
            startAutoplay();
        });
    }

    /* Pause autoplay when the user interacts with the carousel */

    const carouselArea = hero.querySelector(".nox-carousel-area");

    if (carouselArea) {
        carouselArea.addEventListener("mouseenter", stopAutoplay);
        carouselArea.addEventListener("mouseleave", startAutoplay);
        carouselArea.addEventListener("focusin", stopAutoplay);
        carouselArea.addEventListener("focusout", startAutoplay);
    }

    /* Keyboard controls */

    hero.addEventListener("keydown", event => {

        if (event.key === "ArrowRight") {
            nextSlide();
            startAutoplay();
        }

        if (event.key === "ArrowLeft") {
            previousSlide();
            startAutoplay();
        }
    });

    /* Touch swipe support */

    let touchStartX = 0;
    let touchEndX = 0;

    if (carouselArea) {

        carouselArea.addEventListener("touchstart", event => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        carouselArea.addEventListener("touchend", event => {

            touchEndX = event.changedTouches[0].screenX;

            const distance = touchEndX - touchStartX;

            if (Math.abs(distance) < 45) return;

            if (distance < 0) {
                nextSlide();
            } else {
                previousSlide();
            }

            startAutoplay();

        }, { passive: true });
    }

    /* Recalculate 3D perspective on resize */

    window.addEventListener("resize", () => {

        window.clearTimeout(resizeTimer);

        resizeTimer = window.setTimeout(() => {
            positionCards();
        }, 120);
    });

    /* Stop when the browser tab is hidden */

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    /* INITIALISE */

    goToSlide(0);
    startAutoplay();

});




/* =========================================
   AUTOMATIC ACTIVE NAVIGATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".desktop-nav a");

    let currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (currentPage === "" || currentPage === "/") {
        currentPage = "index.html";
    }

    navLinks.forEach(function (link) {

        const linkPage = link
            .getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

    });

});


















/* ==========================================
   NOX LOGIN MODAL — ALL PAGES
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const loginModal = document.getElementById("loginModal");
    const loginModalClose = document.getElementById("loginModalClose");
    const loginTriggers = document.querySelectorAll(".login-trigger");

    // Stop if modal doesn't exist on this page
    if (!loginModal) {
        console.warn("Login modal is missing from this page.");
        return;
    }

    // OPEN LOGIN MODAL
    loginTriggers.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            loginModal.classList.add("active");
            loginModal.setAttribute("aria-hidden", "false");

            document.body.classList.add("login-modal-open");

        });

    });

    // CLOSE LOGIN MODAL
    function closeLoginModal() {

        loginModal.classList.remove("active");
        loginModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("login-modal-open");

    }

    if (loginModalClose) {
        loginModalClose.addEventListener("click", closeLoginModal);
    }

    // Close when clicking the overlay
    loginModal.addEventListener("click", function (event) {

        if (event.target === loginModal) {
            closeLoginModal();
        }

    });

    // Close with Escape key
    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            loginModal.classList.contains("active")
        ) {
            closeLoginModal();
        }

    });

});
