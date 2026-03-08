/* ========================================
   WEDDING INVITATION — JavaScript
   Bằng & Linh — 22/03/2026
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initIntroAnimation();
    initScrollAnimations();
    initNavScroll();
    initFloatingHearts();
    initGalleryLightbox();
    initRSVPForm();
    initSlideshow();
});

/* ---- Countdown Timer ---- */
function initCountdown() {
    const weddingDate = new Date('2026-03-22T11:30:00+07:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function update() {
        const now = Date.now();
        const diff = weddingDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}

/* ---- Scroll-triggered Animations ---- */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for siblings
                    const delay = index * 80;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    elements.forEach((el) => observer.observe(el));
}

/* ---- Navigation Scroll Effect ---- */
function initNavScroll() {
    const nav = document.getElementById('nav');
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 80) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Floating Hearts ---- */
function initFloatingHearts() {
    const container = document.getElementById('heartsBg');
    const heartSymbols = ['♥', '♡', '❤', '💕'];
    const maxHearts = 15;

    function createHeart() {
        if (container.children.length >= maxHearts) return;

        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (10 + Math.random() * 16) + 'px';
        heart.style.animationDuration = (8 + Math.random() * 10) + 's';
        heart.style.animationDelay = Math.random() * 3 + 's';

        container.appendChild(heart);

        // Remove after animation
        const duration = parseFloat(heart.style.animationDuration) * 1000 +
            parseFloat(heart.style.animationDelay) * 1000;
        setTimeout(() => {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
        }, duration);
    }

    // Create initial hearts
    for (let i = 0; i < 8; i++) {
        setTimeout(createHeart, i * 600);
    }

    // Keep creating hearts
    setInterval(createHeart, 2500);
}

/* ---- Gallery Lightbox ---- */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentIndex = 0;
    const images = [];

    galleryItems.forEach((item) => {
        const img = item.querySelector('img');
        if (img) images.push(img.src);
    });

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

/* ---- RSVP Form ---- */
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const btn = document.getElementById('rsvpBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    const successEl = document.getElementById('rsvpSuccess');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('guestName').value.trim();
        const guests = parseInt(document.getElementById('guestCount').value, 10);
        const message = document.getElementById('guestMessage').value.trim();

        if (!name) {
            alert('Vui lòng nhập họ và tên của bạn.');
            return;
        }

        // Show loading
        btn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        try {
            const response = await fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, guests, message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.success) {
                // Show success message
                form.style.display = 'none';
                successEl.style.display = 'block';
            } else {
                throw new Error(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('RSVP Error:', error);
            alert('Không thể gửi xác nhận. Vui lòng thử lại sau.');
            btn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}
/* ---- Slideshow Album ---- */
function initSlideshow() {
    const wrapper = document.getElementById('slideWrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('slideIndicators');

    if (!wrapper || slides.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;

    // Create indicators
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `indicator ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(idx));
        indicatorsContainer.appendChild(dot);
    });

    const indicators = document.querySelectorAll('.indicator');

    function updateSlides() {
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Lazy load current and adjacent slides
        loadSlideImage(currentIndex);
        if (currentIndex < slides.length - 1) loadSlideImage(currentIndex + 1);
        if (currentIndex > 0) loadSlideImage(currentIndex - 1);

        // Update indicators
        indicators.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function loadSlideImage(index) {
        const slide = slides[index];
        if (!slide) return;

        // Load background image for blur effect
        const bgUrl = slide.getAttribute('data-bg');
        if (bgUrl && !slide.style.getPropertyValue('--bg-image')) {
            slide.style.setProperty('--bg-image', `url('${bgUrl}')`);
        }
    }

    // Initial load for first slide
    loadSlideImage(0);
    if (slides.length > 1) loadSlideImage(1);

    function goToSlide(index) {
        currentIndex = index;
        updateSlides();
        resetAutoSlide();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });

    // Touch Support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextSlide();
        if (touchEndX - touchStartX > 50) prevSlide();
        startAutoSlide();
    }, { passive: true });

    startAutoSlide();
}

/* ---- Intro Animation & Preloading ---- */
function initIntroAnimation() {
    const overlay = document.getElementById('intro-overlay');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const openBtn = document.getElementById('open-card-btn');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');

    // Add active class to body to prevent scrolling
    document.body.classList.add('intro-active');

    // Collect all image URLs
    const imagesToLoad = [];

    // Check all img tags
    document.querySelectorAll('img').forEach(img => {
        if (img.src) imagesToLoad.push(img.src);
    });

    // Check all data-bg attributes
    document.querySelectorAll('[data-bg]').forEach(el => {
        const bg = el.getAttribute('data-bg');
        if (bg) imagesToLoad.push(bg);
    });

    // Remove duplicates
    const uniqueImages = [...new Set(imagesToLoad)];
    let loadedCount = 0;
    const totalCount = uniqueImages.length;

    if (totalCount === 0) {
        completePreloading();
    } else {
        uniqueImages.forEach(url => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loadedCount++;
                const percent = Math.round((loadedCount / totalCount) * 100);
                loadingBar.style.width = percent + '%';
                loadingText.textContent = `Đang tải... ${percent}%`;

                if (loadedCount === totalCount) {
                    setTimeout(completePreloading, 500);
                }
            };
            img.src = url;
        });
    }

    function completePreloading() {
        let countdown = 3;
        loadingText.textContent = `Thiệp sẽ tự động mở sau ${countdown} giây...`;

        const timer = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                loadingText.textContent = `Thiệp sẽ tự động mở sau ${countdown} giây...`;
            } else {
                clearInterval(timer);
                loadingText.textContent = 'Đang mở...';
                handleOpen();
            }
        }, 1000);
    }

    function handleOpen() {
        if (envelopeWrapper.classList.contains('open')) return;

        // Step 1: Open envelope flap
        envelopeWrapper.classList.add('open');

        // Step 2: Fade out overlay after animation
        setTimeout(() => {
            overlay.classList.add('fade-out');
            document.body.classList.remove('intro-active');

            // Re-trigger scroll animations for visible elements
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        }, 1500);
    }
}
