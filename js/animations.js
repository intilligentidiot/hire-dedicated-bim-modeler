document.addEventListener('DOMContentLoaded', () => {

    // 1. Blueprint Background Animation
    // Create SVG container dynamically
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("class", "blueprint-bg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");

        // Define grid pattern
        // Horizontal lines
        for (let i = 0; i < 20; i++) {
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", "0");
            line.setAttribute("y1", i * 50);
            line.setAttribute("x2", "100%");
            line.setAttribute("y2", i * 50);
            line.setAttribute("stroke", "rgba(220, 53, 62, 0.1)"); // Brand color low opacity
            line.setAttribute("stroke-width", "1");
            line.setAttribute("class", "blueprint-line");
            svg.appendChild(line);
        }

        // Vertical lines
        for (let i = 0; i < 40; i++) {
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", i * 50);
            line.setAttribute("y1", "0");
            line.setAttribute("x2", i * 50);
            line.setAttribute("y2", "100%");
            line.setAttribute("stroke", "rgba(220, 53, 62, 0.1)");
            line.setAttribute("stroke-width", "1");
            line.setAttribute("class", "blueprint-line");
            svg.appendChild(line);
        }

        // Add some "construction marks" (Circles/Crosses)
        for (let i = 0; i < 5; i++) {
            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", Math.random() * 100 + "%");
            circle.setAttribute("cy", Math.random() * 100 + "%");
            circle.setAttribute("r", (Math.random() * 20 + 10));
            circle.setAttribute("fill", "none");
            circle.setAttribute("stroke", "rgba(220, 53, 62, 0.2)");
            circle.setAttribute("class", "blueprint-mark");
            svg.appendChild(circle);
        }

        heroSection.insertBefore(svg, heroSection.firstChild);

        // Animate Lines using Anime.js
        anime({
            targets: '.blueprint-line',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutSine',
            duration: 3000,
            delay: function (el, i) { return i * 50 },
            direction: 'alternate',
            loop: false
        });

        anime({
            targets: '.blueprint-mark',
            scale: [0, 1],
            opacity: [0, 1],
            easing: 'spring(1, 80, 10, 0)',
            duration: 2000,
            delay: anime.stagger(200, { start: 1000 })
        });
    }

    // 2. Stats Number Counting Animation
    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        let animated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;

                    // Animate 16+
                    const el1 = document.querySelectorAll('.stat-number')[0];
                    const val1 = 16;

                    // Animate 10k+
                    const el2 = document.querySelectorAll('.stat-number')[1];
                    const val2 = 10000;

                    // Helper to animate numbers
                    anime({
                        targets: { val: 0 },
                        val: val1,
                        round: 1,
                        easing: 'easeOutExpo',
                        duration: 2000,
                        update: function () {
                            el1.innerHTML = this.targets.val + '+';
                        }
                    });

                    anime({
                        targets: { val: 0 },
                        val: 10, // 10k
                        round: 1, // 0.1 decimal if needed, but here integers
                        easing: 'easeOutExpo',
                        duration: 2500,
                        update: function () {
                            el2.innerHTML = this.targets.val + 'k+';
                        }
                    });
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // 3. Hero Staggered Entrance (Senior Refinement)
    // Run appropriately after initial paint/load
    const heroItems = document.querySelectorAll('.hero-stagger-item');
    if (heroItems.length > 0) {
        anime({
            targets: heroItems,
            translateY: [30, 0],   // Slide up from 30px
            easing: 'spring(1, 80, 10, 0)', // Springy/Bouncy feel
            duration: 1000,
            delay: anime.stagger(150, { start: 300 }) // Stagger by 150ms, start after 300ms
        });
    }
});
