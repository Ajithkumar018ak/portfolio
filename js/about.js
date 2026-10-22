
/* =========================================================
   NOX CREATIVE STUDIO — ABOUT PAGE INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const page = document.querySelector(".nox-about-page");

    if (!page) return;


    /* =====================================================
       1. SCROLL PROGRESS
    ===================================================== */

    const scrollProgress = document.getElementById("scrollProgress");

    function updateScrollProgress() {

        if (!scrollProgress) return;

        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        scrollProgress.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", updateScrollProgress, {
        passive: true
    });

    window.addEventListener("resize", updateScrollProgress);

    updateScrollProgress();


    /* =====================================================
       2. SCROLL REVEAL ANIMATIONS
    ===================================================== */

    const revealSelectors = [
        ".about-section-heading",
        ".about-intro-heading",
        ".about-intro-content",
        ".about-number-item",
        ".about-philosophy-title",
        ".about-belief-card",
        ".about-process-top",
        ".about-process-card",
        ".about-team-heading",
        ".about-team-card",
        ".about-statement-content",
        ".about-cta-content"
    ];

    const revealElements = page.querySelectorAll(
        revealSelectors.join(",")
    );

    revealElements.forEach((element, index) => {

        element.setAttribute("data-about-reveal", "");

        const siblings = element.parentElement
            ? [...element.parentElement.children]
            : [];

        const siblingIndex = siblings.indexOf(element);

        if (
            element.matches(
                ".about-number-item, .about-belief-card, .about-process-card, .about-team-card"
            )
        ) {
            element.style.setProperty(
                "--about-reveal-delay",
                `${Math.max(0, siblingIndex) * 100}ms`
            );
        }
    });

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("about-revealed");

                    observer.unobserve(entry.target);
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
            element.classList.add("about-revealed");
        });

    }


    /* =====================================================
       3. 3D IMAGE PARALLAX
    ===================================================== */

    const hero = document.getElementById("aboutHero");
    const visualStage = page.querySelector(".about-visual-stage");

    const photoBack = page.querySelector(".about-photo-back");
    const photoMiddle = page.querySelector(".about-photo-middle");
    const photoFront = page.querySelector(".about-photo-front");
    const orbitBadge = page.querySelector(".about-orbit-badge");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

    let animationFrame = null;

    function resetParallax() {

        if (photoBack) {
            photoBack.style.transform =
                "translateZ(-110px) rotateY(17deg) rotateZ(-9deg)";
        }

        if (photoMiddle) {
            photoMiddle.style.transform =
                "translateZ(-40px) rotateY(-14deg) rotateZ(8deg)";
        }

        if (photoFront) {
            photoFront.style.transform =
                "translateZ(80px) rotateY(-4deg) rotateZ(-2deg)";
        }

        if (orbitBadge) {
            orbitBadge.style.translate = "0 0";
        }
    }

    if (
        hero &&
        visualStage &&
        finePointer.matches &&
        !reduceMotion.matches
    ) {

        hero.addEventListener("pointermove", event => {

            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            animationFrame = requestAnimationFrame(() => {

                const rect = visualStage.getBoundingClientRect();

                const relativeX =
                    (event.clientX - rect.left) / rect.width;

                const relativeY =
                    (event.clientY - rect.top) / rect.height;

                const x = (relativeX - 0.5) * 2;
                const y = (relativeY - 0.5) * 2;

                if (photoBack) {
                    photoBack.style.transform =
                        `translate3d(${x * -13}px, ${y * -10}px, -110px) ` +
                        `rotateY(${17 + x * 4}deg) ` +
                        `rotateZ(${-9 + y * 2}deg)`;
                }

                if (photoMiddle) {
                    photoMiddle.style.transform =
                        `translate3d(${x * 17}px, ${y * 12}px, -40px) ` +
                        `rotateY(${-14 + x * 5}deg) ` +
                        `rotateZ(${8 - y * 2}deg)`;
                }

                if (photoFront) {
                    photoFront.style.transform =
                        `translate3d(${x * 9}px, ${y * 8}px, 80px) ` +
                        `rotateY(${-4 + x * 4}deg) ` +
                        `rotateZ(${-2 + y * 1.5}deg)`;
                }

                if (orbitBadge) {
                    orbitBadge.style.translate =
                        `${x * 9}px ${y * 9}px`;
                }

            });

        });

        hero.addEventListener("pointerleave", () => {

            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            resetParallax();

        });

    }


    /* =====================================================
       4. ANIMATED STATISTICS
    ===================================================== */

    const numberElements = page.querySelectorAll("[data-count]");

    function animateNumber(element) {

        if (element.dataset.countAnimated === "true") return;

        element.dataset.countAnimated = "true";

        const target = Number(element.dataset.count);

        if (!Number.isFinite(target)) return;

        const duration = 1400;
        const startTime = performance.now();

        function updateNumber(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);

            /* Smooth ease-out */
            const eased = 1 - Math.pow(1 - progress, 4);

            element.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateNumber);
    }

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    animateNumber(entry.target);

                    observer.unobserve(entry.target);
                });

            },
            {
                threshold: 0.55
            }
        );

        numberElements.forEach(element => {
            counterObserver.observe(element);
        });

    } else {

        numberElements.forEach(element => {
            animateNumber(element);
        });

    }


    /* =====================================================
       5. MOBILE DRAWER & ESC KEY
       Centrally managed by main.js
    ===================================================== */

    /* =====================================================
       6. LOGIN MODAL
       Fully handled by main.js which loads first.
       main.js binds all .login-trigger buttons, the
       modal close button, overlay-click close, ESC close,
       password toggles, and form submit handlers.
    ===================================================== */

    /* No duplicate listeners needed here. */


    /* =====================================================
       11. CLOSE DRAWER WHEN RESIZED TO DESKTOP
    ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 850 && drawerOpen) {
            closeDrawer();
        }

    });


    /* =====================================================
       12. SMOOTH INTERNAL ANCHORS
    ===================================================== */

    page.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", event => {

            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion.matches ? "auto" : "smooth",
                block: "start"
            });

            closeDrawer();

        });

    });


    /* =====================================================
       13. RESET 3D EFFECT FOR REDUCED MOTION
    ===================================================== */

    if (reduceMotion.matches) {
        resetParallax();
    }

});
