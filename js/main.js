/**
 * Purely Pawsome - Interactive Functions
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initAboutCarousel();
    initReviewsCarousel();
    initPriceCalculator();
    initPoopDials();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/**
 * About Section Photo Carousel
 */
function initAboutCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play
    let autoPlay = setInterval(nextSlide, 4000);
    
    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 4000);
    });
}

/**
 * Reviews Carousel
 */
function initReviewsCarousel() {
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.reviews-prev');
    const nextBtn = document.querySelector('.reviews-next');
    
    if (!track || cards.length === 0) return;
    
    let currentCard = 0;
    const totalCards = cards.length;
    
    function goToCard(index) {
        currentCard = index;
        track.style.transform = `translateX(-${currentCard * 100}%)`;
    }
    
    function nextCard() {
        currentCard = (currentCard + 1) % totalCards;
        goToCard(currentCard);
    }
    
    function prevCard() {
        currentCard = (currentCard - 1 + totalCards) % totalCards;
        goToCard(currentCard);
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextCard);
    if (prevBtn) prevBtn.addEventListener('click', prevCard);
    
    // Auto-play
    let autoPlay = setInterval(nextCard, 5000);
    
    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextCard, 5000);
    });
}

/**
 * Dog Poop Calculator — Interactive Dials
 */
function initPoopDials() {
    const dogsKnob = document.getElementById('dogs-knob');
    const dogsTrack = document.getElementById('dogs-track');
    const dogsFill = document.getElementById('dogs-fill');
    const dogsDisplay = document.getElementById('dogs-display');

    const poopsKnob = document.getElementById('poops-knob');
    const poopsTrack = document.getElementById('poops-track');
    const poopsFill = document.getElementById('poops-fill');
    const poopsDisplay = document.getElementById('poops-display');

    if (!dogsKnob || !poopsKnob) return;

    const dogsMin = 1, dogsMax = 10;
    const poopsMin = 1, poopsMax = 6;

    let currentDogs = 1;
    let currentPoops = 2;

    function updateDial(knob, fill, track, display, value, min, max) {
        const pct = (value - min) / (max - min);
        const trackWidth = track.offsetWidth;
        const left = pct * trackWidth;
        knob.style.left = left + 'px';
        fill.style.width = pct * 100 + '%';
        display.textContent = value;
    }

    function setupDial(knob, track, fill, display, min, max, onChange) {
        let dragging = false;

        function getValue(clientX) {
            const rect = track.getBoundingClientRect();
            let pct = (clientX - rect.left) / rect.width;
            pct = Math.max(0, Math.min(1, pct));
            return Math.round(pct * (max - min) + min);
        }

        knob.addEventListener('mousedown', (e) => {
            dragging = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const value = getValue(e.clientX);
            knob.dataset.value = value;
            onChange(value);
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
        });

        // Touch support
        knob.addEventListener('touchstart', (e) => {
            dragging = true;
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!dragging) return;
            const value = getValue(e.touches[0].clientX);
            knob.dataset.value = value;
            onChange(value);
        });

        document.addEventListener('touchend', () => {
            dragging = false;
        });

        // Click on track to jump
        track.addEventListener('click', (e) => {
            const value = getValue(e.clientX);
            knob.dataset.value = value;
            onChange(value);
        });
    }

    function calculatePoop() {
        const daysPerMonth = 30;
        const monthlyPoops = currentDogs * currentPoops * daysPerMonth;
        // Average: 0.4 lbs per poop (USDA/AVMA: 0.25–0.5 lbs)
        const wasteWeight = (monthlyPoops * 0.4).toFixed(1);
        // 30 seconds per scoop
        const scoopingTime = Math.round(monthlyPoops * 0.5);
        // ~23 million bacteria per gram (EPA estimate for dog feces)
        const bacteriaExposure = Math.round((wasteWeight * 453.592) * 23000000 / 1000000);

        animateValue('monthly-poops', 0, monthlyPoops, 400);
        animateValue('waste-weight', 0, parseFloat(wasteWeight), 400, ' lbs');
        animateValue('scooping-time', 0, scoopingTime, 400, ' min');
        animateValue('bacteria-exposure', 0, bacteriaExposure, 400, 'M');
    }

    setupDial(dogsKnob, dogsTrack, dogsFill, dogsDisplay, dogsMin, dogsMax, (val) => {
        currentDogs = val;
        updateDial(dogsKnob, dogsFill, dogsTrack, dogsDisplay, val, dogsMin, dogsMax);
        calculatePoop();
    });

    setupDial(poopsKnob, poopsTrack, poopsFill, poopsDisplay, poopsMin, poopsMax, (val) => {
        currentPoops = val;
        updateDial(poopsKnob, poopsFill, poopsTrack, poopsDisplay, val, poopsMin, poopsMax);
        calculatePoop();
    });

    // Init defaults
    updateDial(dogsKnob, dogsFill, dogsTrack, dogsDisplay, currentDogs, dogsMin, dogsMax);
    updateDial(poopsKnob, poopsFill, poopsTrack, poopsDisplay, currentPoops, poopsMin, poopsMax);
    calculatePoop();
}

function animateValue(elementId, start, end, duration, suffix = '') {
    const element = document.getElementById(elementId);
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + range * easeOut);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Price Calculator
 */
function initPriceCalculator() {
    // Base prices
    const basePrices = {
        1: 25,   // One time
        2: 22,   // 2x/week
        3: 20,   // 3x/week
        4: 18,   // 4x/week
        5: 15    // 5x/week (daily)
    };
    
    const distanceFees = {
        0: 0,
        5: 5,
        10: 10,
        15: 15
    };
    
    const durationPrices = {
        30: 0,
        45: 5,
        60: 10
    };
    
    const poopScoopOnlyPrice = 15;
    const poopScoopComboPrice = 10;
    
    function calculatePrice() {
        const frequency = parseInt(document.querySelector('input[name="frequency"]:checked').value);
        const numDogs = parseInt(document.getElementById('num-dogs-price').value) || 1;
        const distance = parseInt(document.getElementById('distance').value);
        const duration = parseInt(document.getElementById('walk-duration').value);
        const poopScoopOnly = document.getElementById('poop-scoop-only').checked;
        const poopScoopCombo = document.getElementById('poop-scoop-combo').checked;
        
        // Base price calculation
        const basePrice = basePrices[frequency] * numDogs * 4; // 4 weeks
        
        // Distance fee
        const distFee = distanceFees[distance] * 4;
        
        // Duration fee
        const durFee = durationPrices[duration] * numDogs * 4;
        
        // Poop scoop calculations
        const poopOnlyFee = poopScoopOnly ? poopScoopOnlyPrice * 4 : 0;
        const poopComboFee = poopScoopCombo ? poopScoopComboPrice * 4 : 0;
        
        // Update display
        document.querySelector('.walk-qty').textContent = duration;
        document.querySelector('.dog-qty').textContent = numDogs;
        document.querySelector('.freq-qty').textContent = frequency;
        document.querySelector('.base-price span').textContent = basePrice;
        
        // Show/hide rows
        const distRow = document.getElementById('distance-row');
        const durRow = document.getElementById('duration-row');
        const poopOnlyRow = document.getElementById('poop-only-row');
        const poopComboRow = document.getElementById('poop-combo-row');
        
        distRow.style.display = distFee > 0 ? 'flex' : 'none';
        durRow.style.display = durFee > 0 ? 'flex' : 'none';
        poopOnlyRow.style.display = poopScoopOnly ? 'flex' : 'none';
        poopComboRow.style.display = poopScoopCombo ? 'flex' : 'none';
        
        document.querySelector('.dist-fee').textContent = distFee;
        document.querySelector('.dur-fee').textContent = durFee;
        document.querySelector('.poop-only-fee').textContent = poopOnlyFee;
        document.querySelector('.poop-combo-fee').textContent = poopComboFee;
        
        // Total
        const total = basePrice + distFee + durFee + poopOnlyFee + poopComboFee;
        document.querySelector('.total-price span').textContent = total;
    }
    
    // Add event listeners
    document.querySelectorAll('input[name="frequency"]').forEach(input => {
        input.addEventListener('change', calculatePrice);
    });
    
    document.getElementById('num-dogs-price').addEventListener('input', calculatePrice);
    document.getElementById('distance').addEventListener('change', calculatePrice);
    document.getElementById('walk-duration').addEventListener('change', calculatePrice);
    document.getElementById('poop-scoop-only').addEventListener('change', calculatePrice);
    document.getElementById('poop-scoop-combo').addEventListener('change', calculatePrice);
    
    // Initial calculation
    calculatePrice();
}

// Toggle functions for add-ons
function togglePoopScoopOnly() {
    const poopOnly = document.getElementById('poop-scoop-only');
    const poopCombo = document.getElementById('poop-scoop-combo');
    
    if (poopOnly.checked) {
        poopCombo.checked = false;
    }
    initPriceCalculator();
}

function togglePoopScoopCombo() {
    const poopOnly = document.getElementById('poop-scoop-only');
    const poopCombo = document.getElementById('poop-scoop-combo');
    
    if (poopCombo.checked) {
        poopOnly.checked = false;
    }
    initPriceCalculator();
}

// Initialize price calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initPriceCalculator, 100);
});

/**
 * Contact Form - Mailto Redirect
 */
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const message = document.getElementById('contact-message').value;
    
    const subject = encodeURIComponent(`Purely Pawsome Inquiry from ${name}`);
    const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n\n` +
        `Message:\n${message}`
    );
    
    // Open mail app with pre-filled data
    window.location.href = `mailto:vallesleonardo822@gmail.com?subject=${subject}&body=${body}`;
});

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
