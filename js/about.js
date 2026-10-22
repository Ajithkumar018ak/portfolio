
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
       5. MOBILE DRAWER
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerClose = document.getElementById("drawerClose");

    let drawerOpen = false;
    let lastFocusedElement = null;

    function openDrawer() {

        if (!mobileDrawer || !mobileOverlay || drawerOpen) return;

        drawerOpen = true;
        lastFocusedElement = document.activeElement;

        mobileDrawer.classList.add("is-open");
        mobileOverlay.classList.add("is-open");

        mobileDrawer.setAttribute("aria-hidden", "false");
        mobileOverlay.setAttribute("aria-hidden", "false");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "true");
        }

        document.body.classList.add("about-drawer-open");

        if (drawerClose) {
            drawerClose.focus();
        }
    }

    function closeDrawer() {

        if (!mobileDrawer || !mobileOverlay || !drawerOpen) return;

        drawerOpen = false;

        mobileDrawer.classList.remove("is-open");
        mobileOverlay.classList.remove("is-open");

        mobileDrawer.setAttribute("aria-hidden", "true");
        mobileOverlay.setAttribute("aria-hidden", "true");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }

        document.body.classList.remove("about-drawer-open");

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            if (drawerOpen) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (drawerClose) {
        drawerClose.addEventListener("click", closeDrawer);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener("click", closeDrawer);
    }

    if (mobileDrawer) {

        mobileDrawer.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                if (link.getAttribute("href")?.startsWith("#")) {
                    closeDrawer();
                }

            });

        });

    }


    /* =====================================================
       6. LOGIN MODAL
    ===================================================== */

    const loginModal = document.getElementById("loginModal");
    const loginTriggers = page.querySelectorAll("[data-login-trigger]");
    const loginCloseButtons = page.querySelectorAll("[data-login-close]");

    let modalOpen = false;
    let modalPreviousFocus = null;

    function openLoginModal() {

        if (!loginModal || modalOpen) return;

        closeDrawer();

        modalOpen = true;
        modalPreviousFocus = document.activeElement;

        loginModal.classList.add("is-open");
        loginModal.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";

        const firstInput = loginModal.querySelector(
            'input:not([type="hidden"])'
        );

        if (firstInput) {
            window.setTimeout(() => firstInput.focus(), 100);
        }
    }

    function closeLoginModal() {

        if (!loginModal || !modalOpen) return;

        modalOpen = false;

        loginModal.classList.remove("is-open");
        loginModal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        if (
            modalPreviousFocus &&
            typeof modalPreviousFocus.focus === "function"
        ) {
            modalPreviousFocus.focus();
        }
    }

    loginTriggers.forEach(button => {
        button.addEventListener("click", openLoginModal);
    });

    loginCloseButtons.forEach(button => {
        button.addEventListener("click", closeLoginModal);
    });


    /* =====================================================
       7. CLIENT / STUDIO TAB
    ===================================================== */

    const loginTabs = page.querySelectorAll("[data-login-tab]");
    const loginNotice = document.getElementById("aboutLoginNotice");

    let selectedLoginType = "client";

    loginTabs.forEach(tab => {

        tab.addEventListener("click", () => {

            selectedLoginType = tab.dataset.loginTab || "client";

            loginTabs.forEach(item => {
                const active = item === tab;

                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", String(active));
            });

            if (loginNotice) {
                loginNotice.textContent = "";
            }

        });

    });


    /* =====================================================
       8. PASSWORD SHOW / HIDE
    ===================================================== */

    const passwordInput = document.getElementById("aboutLoginPassword");
    const passwordToggle = document.getElementById("aboutPasswordToggle");

    if (passwordInput && passwordToggle) {

        passwordToggle.addEventListener("click", () => {

            const showPassword = passwordInput.type === "password";

            passwordInput.type = showPassword ? "text" : "password";

            passwordToggle.setAttribute(
                "aria-label",
                showPassword ? "Hide password" : "Show password"
            );

            const icon = passwordToggle.querySelector("i");

            if (icon) {

                icon.classList.toggle("fa-eye", !showPassword);
                icon.classList.toggle("fa-eye-slash", showPassword);

            }

        });

    }


    /* =====================================================
       9. STATIC LOGIN DEMO
       No backend / no credential storage
    ===================================================== */

    const loginForm = document.getElementById("aboutLoginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", event => {

            event.preventDefault();

            if (!loginForm.reportValidity()) return;

            /*
             * Static demo only.
             * No credentials are sent or saved.
             */

            if (loginNotice) {

                loginNotice.textContent =
                    `${selectedLoginType === "client" ? "Client" : "Studio"} login is a demo. Connect authentication to enable sign-in.`;

            }

        });

    }


    /* =====================================================
       10. ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        if (modalOpen) {
            closeLoginModal();
            return;
        }

        if (drawerOpen) {
            closeDrawer();
        }

    });


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
