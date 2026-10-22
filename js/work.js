/* =========================================
   NOX CREATIVE STUDIO — WORK PAGE JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       ELEMENTS
    ===================================== */

    const header = document.getElementById("siteHeader");

    const scrollProgress = document.getElementById("scrollProgress");

    const showcase = document.getElementById("heroShowcase");

    const slides = Array.from(
        document.querySelectorAll(".showcase-slide")
    );

    const slideTitle = document.getElementById("slideTitle");

    const slideDescription = document.getElementById("slideDescription");

    const slideCategory = document.getElementById("slideCategory");

    const slideClient = document.getElementById("slideClient");

    const slideCurrent = document.getElementById("slideCurrent");

    const slideTotal = document.getElementById("slideTotal");

    const slidePrev = document.getElementById("slidePrev");

    const slideNext = document.getElementById("slideNext");

    const sliderProgressBar = document.getElementById("sliderProgressBar");


    /* =====================================
       1. STICKY HEADER + SCROLL PROGRESS
    ===================================== */

    function updateScrollUI() {

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const maxScroll =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            maxScroll > 0
                ? (scrollTop / maxScroll) * 100
                : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        if (header) {
            header.classList.toggle("scrolled", scrollTop > 30);
        }

    }

    window.addEventListener("scroll", updateScrollUI, {
        passive: true
    });

    updateScrollUI();


    /* =====================================
       2. HERO IMAGE CAROUSEL
    ===================================== */

    let currentSlide = 0;

    let autoSlideTimer = null;

    let touchStartX = 0;

    const slideDuration = 5500;

    if (slideTotal) {
        slideTotal.textContent = String(slides.length).padStart(2, "0");
    }


    function showSlide(index) {

        if (!slides.length) return;

        currentSlide =
            (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {

            const isActive = i === currentSlide;

            slide.classList.toggle("is-active", isActive);

            slide.setAttribute(
                "aria-hidden",
                String(!isActive)
            );

        });


        const activeSlide = slides[currentSlide];

        const nextTitle = activeSlide.dataset.title || "";

        const nextDescription =
            activeSlide.dataset.description || "";

        const nextCategory =
            activeSlide.dataset.category || "";

        const nextClient =
            activeSlide.dataset.client || "";


        /*
          Content transition:
          image and matching text update together.
        */

        if (slideTitle) {

            slideTitle.classList.add("content-changing");

            slideTitle.textContent = nextTitle;

            requestAnimationFrame(() => {
                slideTitle.classList.remove("content-changing");
            });

        }


        if (slideDescription) {
            slideDescription.textContent = nextDescription;
        }

        if (slideCategory) {
            slideCategory.textContent = nextCategory;
        }

        if (slideClient) {
            slideClient.textContent = nextClient;
        }


        if (slideCurrent) {

            slideCurrent.textContent =
                String(currentSlide + 1).padStart(2, "0");

        }


        if (sliderProgressBar) {

            sliderProgressBar.style.width =
                `${((currentSlide + 1) / slides.length) * 100}%`;

        }

    }


    function nextSlide() {
        showSlide(currentSlide + 1);
    }


    function previousSlide() {
        showSlide(currentSlide - 1);
    }


    function startAutoSlide() {

        stopAutoSlide();

        if (slides.length > 1) {

            autoSlideTimer = window.setInterval(() => {
                nextSlide();
            }, slideDuration);

        }

    }


    function stopAutoSlide() {

        if (autoSlideTimer !== null) {

            window.clearInterval(autoSlideTimer);

            autoSlideTimer = null;

        }

    }


    function restartAutoSlide() {
        startAutoSlide();
    }


    if (slideNext) {

        slideNext.addEventListener("click", () => {

            nextSlide();

            restartAutoSlide();

        });

    }


    if (slidePrev) {

        slidePrev.addEventListener("click", () => {

            previousSlide();

            restartAutoSlide();

        });

    }


    /*
      Pause auto-slide when the user hovers
      over the image showcase.
    */

    if (showcase) {

        showcase.addEventListener("mouseenter", stopAutoSlide);

        showcase.addEventListener("mouseleave", startAutoSlide);


        showcase.addEventListener("focusin", stopAutoSlide);

        showcase.addEventListener("focusout", startAutoSlide);


        /* Mobile swipe support */

        showcase.addEventListener("touchstart", (event) => {

            touchStartX = event.changedTouches[0].clientX;

        }, {
            passive: true
        });


        showcase.addEventListener("touchend", (event) => {

            const touchEndX = event.changedTouches[0].clientX;

            const difference = touchEndX - touchStartX;

            if (Math.abs(difference) > 50) {

                if (difference < 0) {
                    nextSlide();
                } else {
                    previousSlide();
                }

                restartAutoSlide();

            }

        }, {
            passive: true
        });

    }


    showSlide(0);

    startAutoSlide();


    /* =====================================
       3. MOBILE NAVIGATION DRAWER & ESC KEY
       Centrally managed by main.js
    ===================================== */


    /* =====================================
       5. SCROLL REVEAL ANIMATIONS
    ===================================== */

    const revealElements = document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

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

            /*
              Small stagger between sibling elements.
            */

            element.style.transitionDelay =
                `${Math.min(index % 4, 3) * 70}ms`;

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }


    /* =====================================
       6. STATISTICS COUNTERS
    ===================================== */

    const counters = document.querySelectorAll("[data-count]");


    function animateCounter(element) {

        const target = Number(element.dataset.count);

        if (!Number.isFinite(target)) return;

        const duration = 1500;

        const startTime = performance.now();


        function updateCounter(now) {

            const elapsed = now - startTime;

            const progress = Math.min(elapsed / duration, 1);

            /*
              Ease-out curve.
            */

            const eased = 1 - Math.pow(1 - progress, 4);

            const value = Math.round(target * eased);

            element.textContent = value.toLocaleString("en-US");


            if (progress < 1) {

                requestAnimationFrame(updateCounter);

            } else {

                element.textContent = target.toLocaleString("en-US");

            }

        }


        requestAnimationFrame(updateCounter);

    }


    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        animateCounter(entry.target);

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.65
            }
        );


        counters.forEach((counter) => {
            counterObserver.observe(counter);
        });

    } else {

        counters.forEach((counter) => {
            counter.textContent = counter.dataset.count;
        });

    }


    /* =====================================
       7. CAPABILITY CARD 3D TILT
    ===================================== */

    const capabilityCards =
        document.querySelectorAll(".capability-card");

    const supportsFinePointer =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;


    if (supportsFinePointer) {

        capabilityCards.forEach((card) => {

            card.addEventListener("mousemove", (event) => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;

                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;

                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 2.5;

                const rotateX = ((centerY - y) / centerY) * 2.5;


                card.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;

            });


            card.addEventListener("mouseleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* =====================================
       8. LOGIN MODAL
       Fully handled by main.js which loads
       first. No duplicate listeners needed.
    ===================================== */

    /* main.js attaches all .login-trigger click handlers,
       the modal close button, overlay-click close,
       ESC key close, and form submit handlers.          */


    /* =====================================
       9. IMAGE FALLBACK
    ===================================== */

    /*
      If an image file is missing, preserve the layout
      and display a dark orange-toned fallback.
    */

    document.querySelectorAll("img").forEach((img) => {

        img.addEventListener("error", () => {

            img.classList.add("image-missing");

            img.style.background =
                "radial-gradient(circle at 30% 30%, rgba(255,107,44,.18), #242424 70%)";

            img.style.minHeight = "100px";

            console.warn(
                "NOX image not found:",
                img.getAttribute("src")
            );

        });

    });


    /* =====================================
       10. HERO CONTENT CHANGE ANIMATION
    ===================================== */

    const dynamicContent = [
        slideTitle,
        slideDescription
    ].filter(Boolean);


    dynamicContent.forEach((element) => {

        element.style.transition =
            "opacity .25s ease, transform .25s ease";

    });


    /* =====================================
       READY
    ===================================== */

    document.documentElement.classList.add("work-page-ready");

});