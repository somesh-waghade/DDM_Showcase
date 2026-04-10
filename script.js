// Scroll Animation & Filtering Setup
document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup Intersection Observer for fade-up animations
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once faded in
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Initially trigger ones already in view
    setTimeout(() => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);

    // 2. Navbar blur effect on scroll
    const navbar = document.querySelector('.navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(24, 24, 27, 0.8)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'var(--bg-card)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // 3. Category Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const assignmentCards = document.querySelectorAll('.assignment-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter cards
            assignmentCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Re-trigger animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400); // Wait for transition
                }
            });
        });
    });

    // 4. Welcome Box Slide/Fade Animation (Indian Languages + Ladakhi)
    const welcomesData = [
        {text: "Welcome", lang: "English"},
        {text: "स्वागत", lang: "Hindi/Marathi"},
        {text: "ཇུ་ལེགས།", lang: "Ladakhi"},
        {text: "স্বাগতম", lang: "Bengali"},
        {text: "స్వాగతం", lang: "Telugu"},
        {text: "நல்வரவு", lang: "Tamil"},
        {text: "ಸ್ವಾಗತ", lang: "Kannada"},
        {text: "ਜੀ ਆਇਆਂ ਨੂੰ", lang: "Punjabi"},
        {text: "ସ୍ୱାଗତମ୍", lang: "Odia"},
        {text: "സ്വാഗതം", lang: "Malayalam"},
        {text: "સ્વાગત છે", lang: "Gujarati"},
        {text: "पधारो सा", lang: "Rajasthani"},
        {text: "خوش آمدید", lang: "Urdu"}
    ];
    let welcomeIdx = 0;
    const wrapperEl = document.getElementById("welcome-slide-wrapper");
    const textEl = document.getElementById("welcome-text");
    const langEl = document.getElementById("welcome-lang");
    
    if (wrapperEl && textEl && langEl) {
        setInterval(() => {
            // Step 1: Slide Up & Fade Out smoothly
            wrapperEl.style.transform = "translateY(-30px)";
            wrapperEl.style.opacity = "0";

            setTimeout(() => {
                // Step 2: Instantly teleport underneath the container (invisible)
                wrapperEl.style.transition = "none";
                wrapperEl.style.transform = "translateY(30px)";
                
                // Swap the language text and author name
                welcomeIdx = (welcomeIdx + 1) % welcomesData.length;
                textEl.innerText = welcomesData[welcomeIdx].text;
                langEl.innerText = "— " + welcomesData[welcomeIdx].lang;

                // Step 3: Wait essentially 1 frame to ensure CSS recognizes the teleport
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Step 4: Re-enable transitions and Slide up into Center
                        wrapperEl.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-out";
                        wrapperEl.style.transform = "translateY(0)";
                        wrapperEl.style.opacity = "1";
                    });
                });
            }, 500); // Delay matches outbound animation duration
        }, 3200); // Repeat comfortably every 3.2 seconds
    }
});
