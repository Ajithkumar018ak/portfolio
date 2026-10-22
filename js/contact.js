/* =========================================================
   NOX CREATIVE STUDIO
   CONTACT PAGE INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       1. SCROLL PROGRESS
    ===================================================== */

    const scrollProgress = document.getElementById("scrollProgress");

    let scrollTicking = false;

    function updateScrollProgress() {

        if (!scrollProgress) {
            return;
        }

        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        scrollProgress.style.width = `${progress}%`;

        scrollTicking = false;

    }

    window.addEventListener("scroll", function () {

        if (!scrollTicking) {

            requestAnimationFrame(updateScrollProgress);

            scrollTicking = true;

        }

    }, { passive: true });

    updateScrollProgress();



    /* =====================================================
       2. MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");

    const mainNav = document.getElementById("mainNav");


    function closeMenu() {

        if (!menuToggle || !mainNav) {
            return;
        }

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute("aria-label", "Open navigation");

        mainNav.classList.remove("is-open");

    }


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Open navigation" : "Close navigation"
            );

            mainNav.classList.toggle("is-open", !isOpen);

        });


        mainNav.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", closeMenu);

        });


        document.addEventListener("click", function (event) {

            if (
                mainNav.classList.contains("is-open") &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                closeMenu();

            }

        });


        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMenu();
            }

        });


        window.addEventListener("resize", function () {

            if (window.innerWidth > 760) {
                closeMenu();
            }

        });

    }



    /* =====================================================
       3. HERO IMAGE CAROUSEL

       Replace image paths with your own files.
    ===================================================== */

    const heroImage = document.getElementById("heroSliderImage");

    const heroImageNumber = document.getElementById("heroImageNumber");

    const heroImageCaption = document.getElementById("heroImageCaption");

    const heroPrev = document.getElementById("heroPrev");

    const heroNext = document.getElementById("heroNext");

    const heroVisual = document.getElementById("heroVisual");


    const heroImages = [

        {
            src: "assets/images/contact-hero-01.webp",
            caption: "IDEAS INTO EXPERIENCE"
        },

        {
            src: "assets/images/contact-hero-02.webp",
            caption: "BUILT TO STAND OUT"
        },

        {
            src: "assets/images/contact-hero-03.webp",
            caption: "CREATIVE WITHOUT LIMITS"
        }

    ];


    let activeImage = 0;

    let carouselTimer = null;

    let imageChanging = false;


    // Preload images

    heroImages.forEach(function (item) {

        const image = new Image();

        image.src = item.src;

    });


    function changeHeroImage(index) {

        if (!heroImage || imageChanging || !heroImages.length) {
            return;
        }

        activeImage =
            (index + heroImages.length) % heroImages.length;

        const selectedImage = heroImages[activeImage];

        imageChanging = true;

        heroImage.classList.add("image-changing");


        const newImage = new Image();


        newImage.onload = function () {

            heroImage.src = selectedImage.src;

            heroImage.alt = selectedImage.caption;


            if (heroImageNumber) {

                heroImageNumber.textContent =
                    String(activeImage + 1).padStart(2, "0");

            }


            if (heroImageCaption) {

                heroImageCaption.textContent = selectedImage.caption;

            }


            requestAnimationFrame(function () {

                heroImage.classList.remove("image-changing");

                imageChanging = false;

            });

        };


        newImage.onerror = function () {

            console.warn(
                "Unable to load hero image:",
                selectedImage.src
            );

            heroImage.classList.remove("image-changing");

            imageChanging = false;

        };


        newImage.src = selectedImage.src;

    }



    function stopCarousel() {

        if (carouselTimer) {

            clearInterval(carouselTimer);

            carouselTimer = null;

        }

    }



    function startCarousel() {

        stopCarousel();

        if (reducedMotion || document.hidden) {
            return;
        }

        carouselTimer = setInterval(function () {

            changeHeroImage(activeImage + 1);

        }, 5000);

    }



    if (heroNext) {

        heroNext.addEventListener("click", function () {

            changeHeroImage(activeImage + 1);

            startCarousel();

        });

    }


    if (heroPrev) {

        heroPrev.addEventListener("click", function () {

            changeHeroImage(activeImage - 1);

            startCarousel();

        });

    }


    if (heroVisual) {

        heroVisual.addEventListener("mouseenter", stopCarousel);

        heroVisual.addEventListener("mouseleave", startCarousel);

        heroVisual.addEventListener("focusin", stopCarousel);

        heroVisual.addEventListener("focusout", startCarousel);

    }


    document.addEventListener("visibilitychange", function () {

        if (document.hidden) {

            stopCarousel();

        } else {

            startCarousel();

        }

    });


    if (heroImages.length) {

        changeHeroImage(0);

        startCarousel();

    }



    /* =====================================================
       4. HERO 3D PARALLAX
    ===================================================== */

    const contactHero = document.getElementById("contactHero");

    const supportsPointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;


    if (contactHero && supportsPointer && !reducedMotion) {

        let pointerFrame = null;

        let mouseX = 0;

        let mouseY = 0;


        contactHero.addEventListener("pointermove", function (event) {

            const bounds = contactHero.getBoundingClientRect();

            mouseX =
                ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;

            mouseY =
                ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;


            if (pointerFrame) {
                return;
            }


            pointerFrame = requestAnimationFrame(function () {


                // Move the ribbons at different depths

                contactHero.querySelectorAll(".hero-ribbon")
                    .forEach(function (ribbon, index) {

                        const strength = (index + 1) * 5;

                        ribbon.style.marginLeft =
                            `${mouseX * strength}px`;

                        ribbon.style.marginTop =
                            `${mouseY * strength}px`;

                    });


                // Move the spheres

                contactHero.querySelectorAll(".hero-sphere")
                    .forEach(function (sphere, index) {

                        const strength = (index + 1) * 7;

                        sphere.style.translate =
                            `${mouseX * strength}px ${mouseY * strength}px`;

                    });


                // Tilt the image

                const frame =
                    contactHero.querySelector(".hero-image-frame");


                if (frame) {

                    const rotateY = mouseX * 5;

                    const rotateX = mouseY * -4;

                    frame.style.transform =
                        `rotateY(${-9 + rotateY}deg) rotateX(${3 + rotateX}deg)`;

                }


                pointerFrame = null;

            });

        });


        contactHero.addEventListener("pointerleave", function () {

            if (pointerFrame) {

                cancelAnimationFrame(pointerFrame);

                pointerFrame = null;

            }


            contactHero.querySelectorAll(".hero-ribbon")
                .forEach(function (ribbon) {

                    ribbon.style.marginLeft = "";

                    ribbon.style.marginTop = "";

                });


            contactHero.querySelectorAll(".hero-sphere")
                .forEach(function (sphere) {

                    sphere.style.translate = "";

                });


            const frame =
                contactHero.querySelector(".hero-image-frame");


            if (frame) {

                frame.style.transform = "";

            }

        });

    }



    /* =====================================================
       5. FAQ ACCORDION
    ===================================================== */

    const faqItems = document.querySelectorAll(".faq-item");


    faqItems.forEach(function (item) {

        const question = item.querySelector(".faq-question");

        const toggle = item.querySelector(".faq-toggle");


        if (!question || !toggle) {
            return;
        }


        question.addEventListener("click", function () {

            const wasOpen = item.classList.contains("is-open");


            // Close every item

            faqItems.forEach(function (otherItem) {

                otherItem.classList.remove("is-open");

                const otherButton =
                    otherItem.querySelector(".faq-question");

                const otherToggle =
                    otherItem.querySelector(".faq-toggle");


                if (otherButton) {

                    otherButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }


                if (otherToggle) {

                    otherToggle.textContent = "+";

                }

            });


            // Open selected item

            if (!wasOpen) {

                item.classList.add("is-open");

                question.setAttribute("aria-expanded", "true");

                toggle.textContent = "−";

            }

        });

    });



    /* =====================================================
       6. PROJECT FORM

       Static demo:
       Valid submission goes to 404.html.
       No backend, API, or storage is used.
    ===================================================== */

    const projectForm = document.getElementById("projectForm");


    if (projectForm) {

        const nameInput = document.getElementById("projectName");

        const phoneInput = document.getElementById("projectPhone");

        const messageInput = document.getElementById("projectMessage");


        // Name validation

        if (nameInput) {

            nameInput.addEventListener("input", function () {

                nameInput.setCustomValidity("");

            });

        }


        // Phone validation

        if (phoneInput) {

            phoneInput.addEventListener("input", function () {

                phoneInput.setCustomValidity("");

            });

        }


        // Message validation

        if (messageInput) {

            messageInput.addEventListener("input", function () {

                messageInput.setCustomValidity("");

            });

        }


        projectForm.addEventListener("submit", function (event) {

            event.preventDefault();


            if (!projectForm.checkValidity()) {

                projectForm.reportValidity();

                return;

            }


            const nameValue = nameInput.value.trim();

            const messageValue = messageInput.value.trim();


            if (nameValue.length < 2) {

                nameInput.setCustomValidity(
                    "Please enter at least two characters."
                );

                nameInput.reportValidity();

                return;

            }


            if (messageValue.length < 10) {

                messageInput.setCustomValidity(
                    "Please describe your project in at least 10 characters."
                );

                messageInput.reportValidity();

                return;

            }


            // This is a static demonstration form.
            // No data is saved or sent to a server.

            window.location.href = "404.html";

        });

    }



    /* =====================================================
       7. SIMPLE REVEAL ANIMATIONS
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".contact-info-card, " +
        ".process-card, " +
        ".showcase-card, " +
        ".faq-item"
    );


    if ("IntersectionObserver" in window && !reducedMotion) {

        const revealObserver = new IntersectionObserver(

            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },

            {
                threshold: 0.12,
                rootMargin: "0px 0px -25px 0px"
            }

        );


        revealElements.forEach(function (element) {

            element.classList.add("reveal-element");

            revealObserver.observe(element);

        });

    }


    console.log("NOX Contact Page ready.");

});