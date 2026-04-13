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

    // 5. Digital Book TOC Scroll-Spy & Active States
    const bookSections = document.querySelectorAll('.book-content section');
    const tocLinks = document.querySelectorAll('.book-toc a');
    
    if (bookSections.length > 0 && tocLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = "";
            bookSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });

        // Smooth scroll for TOC links (optional refinement)
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});
class CanvasCityMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Grid properties
        this.gridSize = 40;
        this.nodes = [];
        this.buildings = [];

        // Camera properties
        this.camera = { x: 0, y: 0, zoom: 1, angle: 0 };
        this.targetCamera = { x: 0, y: 0, zoom: 1, angle: 0 };

        // Pointer properties
        this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0, radius: 4, glow: 0, transitioning: false };
        this.trail = [];
        this.shockwaves = [];
        this.init();
        this.startJumping();
        
        // Start animation loop
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Generate grid nodes
        const cols = Math.ceil(this.canvas.width / this.gridSize) + 4;
        const rows = Math.ceil(this.canvas.height / this.gridSize) + 4;

        for (let r = -2; r < rows; r++) {
            for (let c = -2; c < cols; c++) {
                this.nodes.push({ x: c * this.gridSize, y: r * this.gridSize });
            }
        }

        // Generate some buildings
        for (let i = 0; i < 50; i++) {
            const node = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            this.buildings.push({
                x: node.x,
                y: node.y,
                width: this.gridSize * (Math.random() > 0.5 ? 2 : 1),
                height: this.gridSize * (Math.random() > 0.5 ? 2 : 1),
                depth: Math.random() * 80 + 20
            });
        }

        // Set initial pointer position
        const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        this.pointer.x = this.pointer.targetX = startNode.x;
        this.pointer.y = this.pointer.targetY = startNode.y;
        
        this.camera.x = this.targetCamera.x = this.pointer.x;
        this.camera.y = this.targetCamera.y = this.pointer.y;
    }

    startJumping() {
        setInterval(() => {
            const nextNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            this.pointer.targetX = nextNode.x;
            this.pointer.targetY = nextNode.y;
            this.pointer.transitioning = true;
            this.pointer.glow = 1.0;

            // Slightly shift camera towards the new point
            this.targetCamera.x = nextNode.x;
            this.targetCamera.y = nextNode.y;
            this.targetCamera.angle = (Math.random() - 0.5) * 0.2; // Slight tilt

        }, 3000);
    }

    animate() {
        this.ctx.fillStyle = getComputedStyle(document.body).backgroundColor; // clear to background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Interpolate camera
        this.camera.x += (this.targetCamera.x - this.camera.x) * 0.02;
        this.camera.y += (this.targetCamera.y - this.camera.y) * 0.02;
        this.camera.angle += (this.targetCamera.angle - this.camera.angle) * 0.01;

        // Interpolate pointer with an arc
        if (this.pointer.transitioning) {
             const dx = this.pointer.targetX - this.pointer.x;
             const dy = this.pointer.targetY - this.pointer.y;
             this.pointer.x += dx * 0.05;
             this.pointer.y += dy * 0.05;
             this.pointer.glow = Math.max(0, this.pointer.glow - 0.02);
             
             if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
                 this.pointer.transitioning = false;
                 this.pointer.glow = 1; // Pulse on arrival
                 this.shockwaves.push({ x: this.pointer.x, y: this.pointer.y, radius: 2, alpha: 1.0 });
             }
        } else {
             this.pointer.glow = 0.2 + 0.8 * Math.abs(Math.sin(Date.now() / 300)); // Constant pulse
        }

        this.ctx.save();
        
        // Setup isometric transform
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(this.camera.angle);
        
        // Tilt
        this.ctx.scale(1, 0.5); 
        
        // Move to camera position
        this.ctx.translate(-this.camera.x, -this.camera.y);

        // Draw Grid lines
        this.ctx.strokeStyle = `rgba(14, 165, 233, 0.15)`; // Primary color muted
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let x = -this.canvas.width; x < this.canvas.width * 2; x += this.gridSize) {
            this.ctx.moveTo(x, -this.canvas.height);
            this.ctx.lineTo(x, this.canvas.height * 2);
        }
        for (let y = -this.canvas.height; y < this.canvas.height * 2; y += this.gridSize) {
            this.ctx.moveTo(-this.canvas.width, y);
            this.ctx.lineTo(this.canvas.width * 2, y);
        }
        this.ctx.stroke();

        // Draw Buildings (simple boxes)
        this.ctx.fillStyle = `rgba(14, 165, 233, 0.05)`;
        this.ctx.strokeStyle = `rgba(14, 165, 233, 0.2)`;
        
        this.buildings.forEach(b => {
            this.ctx.beginPath();
            this.ctx.rect(b.x, b.y, b.width, b.height);
            this.ctx.fill();
            this.ctx.stroke();
            // Draw pseudo 3d height by drawing the top shifted slightly
             this.ctx.beginPath();
             this.ctx.rect(b.x, b.y - b.depth, b.width, b.height);
             this.ctx.stroke();
             
             // Connecting lines
             this.ctx.beginPath();
             this.ctx.moveTo(b.x, b.y);
             this.ctx.lineTo(b.x, b.y - b.depth);
             this.ctx.moveTo(b.x + b.width, b.y);
             this.ctx.lineTo(b.x + b.width, b.y - b.depth);
             this.ctx.moveTo(b.x + b.width, b.y + b.height);
             this.ctx.lineTo(b.x + b.width, b.y + b.height- b.depth);
             this.ctx.moveTo(b.x , b.y + b.height);
             this.ctx.lineTo(b.x , b.y + b.height- b.depth);
             this.ctx.stroke();
        });

        // Draw Pointer
        // Arc height simulation
        const isJumping = this.pointer.transitioning;
        const jumpHeight = isJumping ? Math.sin(Math.PI * (1 - this.pointer.glow)) * 60 : 0;

        // Trail Logic
        if (isJumping || this.trail.length > 0) {
            this.trail.push({ x: this.pointer.x, y: this.pointer.y - jumpHeight, alpha: 1.0 });
        }

        if (this.trail.length > 1) {
            this.ctx.save();
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#0ea5e9';
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.lineWidth = 2.5;

            this.ctx.beginPath();
            for (let i = 0; i < this.trail.length - 1; i++) {
                const p1 = this.trail[i];
                const p2 = this.trail[i + 1];
                
                this.ctx.strokeStyle = `rgba(14, 165, 233, ${p1.alpha})`;
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();

                p1.alpha -= 0.03; // Fade out slightly faster
            }
            
            const lastPt = this.trail[this.trail.length - 1];
            if (!isJumping) lastPt.alpha -= 0.03;

            this.ctx.restore();

            // Cull faded points
            this.trail = this.trail.filter(pt => pt.alpha > 0);
        }

        // Draw Shockwaves (Blasting Effect)
        if (this.shockwaves.length > 0) {
            this.ctx.save();
            this.ctx.lineWidth = 2;
            for (let i = 0; i < this.shockwaves.length; i++) {
                const sw = this.shockwaves[i];
                this.ctx.strokeStyle = `rgba(14, 165, 233, ${sw.alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                
                sw.radius += 2.5; // Expansion speed
                sw.alpha -= 0.03; // Fade speed
            }
            this.ctx.restore();
            this.shockwaves = this.shockwaves.filter(sw => sw.alpha > 0);
        }

        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#0ea5e9';
        this.ctx.fillStyle = '#0ea5e9';
        
        this.ctx.beginPath();
        // Shift Y up by jumpHeight to simulate Z-axis jump in isometric view
        this.ctx.arc(this.pointer.x, this.pointer.y - jumpHeight, this.pointer.radius * (1 + this.pointer.glow), 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ground shadow
        if (isJumping) {
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = `rgba(14, 165, 233, 0.2)`;
            this.ctx.beginPath();
            this.ctx.arc(this.pointer.x, this.pointer.y, this.pointer.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();

        requestAnimationFrame(() => this.animate());
    }
}

// Initializing the city map on load
document.addEventListener('DOMContentLoaded', () => {
    new CanvasCityMap('city-canvas');
});

