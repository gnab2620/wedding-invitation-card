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
    initBackgroundMusic();
});

// --- Supabase Configuration ---
// TO USER: DO NOT edit these values here. Add them to GitHub Repository Secrets.
const SUPABASE_URL = window._dC('==wbj5SZzFmYhBXdz5ieslXcmFHbsdXe0l2Z15GesZHc49yL6MHc0RHa');
const SUPABASE_ANON_KEY = window._dC('==QStxWTIJDcvh3dGpXdIZlSMBDTmtWZMhWe0IVaiNkb5dFbIFkSitWLwIEZuAjbONzZE9UNnR0T0EkaNZTSDNGNW1WSzlleORTSq1keNpnTzUkaPlWUYlFcKNETpRjMiVnRtlkNJNlWzlTbjl2dplkN4dVZ4p1VjNHeyQWNShVYuZlbiRDetR2do5WS2kUaaxmSul0cJNlW6ZUbZhmQYRmeKl2Tp10MjBnS5VmL5o0QWhFcrlkNJN0Y1IlbJNXSp5UMJpXVJpUaPl2YHJGaKlXZ');


const isProduction = window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('netlify.app');

const isConfigured = SUPABASE_URL &&
    SUPABASE_URL !== '---YOUR_SUPABASE_URL_HERE---' &&
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY !== '---YOUR_SUPABASE_ANON_KEY_HERE---';

if (isProduction && !isConfigured) {
    console.warn('RSVP Warning: Supabase is NOT configured. Check GitHub Secrets.');
}

let supabaseClient = null;
if (typeof supabase !== 'undefined' && isConfigured) {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
        console.error('Supabase Init Error:', e);
    }
}

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
        heart.style.animationDuration = (10 + Math.random() * 15) + 's'; // Slower falling time
        heart.style.animationDelay = Math.random() * 5 + 's';

        container.appendChild(heart);

        // Remove after animation
        const duration = parseFloat(heart.style.animationDuration) * 1000 +
            parseFloat(heart.style.animationDelay) * 1000;
        setTimeout(() => {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
        }, duration);
    }

    // Create initial hearts with more dramatic stagger
    for (let i = 0; i < 10; i++) {
        setTimeout(createHeart, i * 400);
    }

    // Keep creating hearts
    setInterval(createHeart, 2000);
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
            let success = false;

            if (supabaseClient) {
                // Submit to Supabase
                const { error } = await supabaseClient
                    .from('rsvps')
                    .insert([{ name, guests, message }]);

                if (error) throw error;
                success = true;
            } else {
                // If on production but Supabase is missing, don't try local API
                if (isProduction) {
                    throw new Error('Hệ thống RSVP chưa được cấu hình. Vui lòng thiết lập GitHub Secrets theo hướng dẫn.');
                }

                // Check if running on file protocol
                if (window.location.protocol === 'file:') {
                    throw new Error('Bạn đang mở tệp trực tiếp từ máy tính. Vui lòng chạy máy chủ (npm start) hoặc cấu hình Supabase để chức năng này hoạt động.');
                }

                // Fallback to local API (for development)
                const response = await fetch('/api/rsvp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, guests, message }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                success = data.success;
            }

            if (success) {
                // Show success message
                form.style.display = 'none';
                successEl.style.display = 'block';
            } else {
                throw new Error('Có lỗi xảy ra');
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

    let isTransitioning = false;

    async function updateSlides() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Lazy load current and adjacent slides (both bg and main img)
        await loadSlideImage(currentIndex);

        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Pre-load neighbors
        if (currentIndex < slides.length - 1) loadSlideImage(currentIndex + 1);
        if (currentIndex > 0) loadSlideImage(currentIndex - 1);

        // Update indicators
        indicators.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });

        // Reset transition flag after CSS transition finishes
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }

    async function loadSlideImage(index) {
        const slide = slides[index];
        if (!slide) return;

        // 1. Load Background Blur Image (Low Res Thumbnail for Performance)
        const bgUrl = slide.getAttribute('data-bg');
        if (bgUrl && !slide.style.getPropertyValue('--bg-image')) {
            // Transform URL to low-res thumbnail if it's Cloudinary
            const lowResUrl = bgUrl.replace('/upload/', '/upload/w_50,c_scale,e_blur:1000,f_auto,q_auto/');
            slide.style.setProperty('--bg-image', `url('${lowResUrl}')`);
        }

        // 2. Load & Decode Main Image
        const img = slide.querySelector('img');
        if (img && img.getAttribute('src')) {
            // Use decode() to ensure main image is ready before transition if it's the current slide
            try {
                if (img.decode) {
                    await img.decode();
                }
            } catch (e) {
                // Fallback for older browsers
            }
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
        loadingText.textContent = 'Đã sẵn sàng!';
        loadingBar.style.display = 'none';

        // Auto-open after a short delay
        setTimeout(handleOpen, 500);
    }

    function handleOpen() {
        if (envelopeWrapper.classList.contains('open')) return;

        // Step 1: Open envelope flap
        envelopeWrapper.classList.add('open');

        // Play music - Attach to any first interaction
        const startMusic = () => {
            const bgMusic = document.getElementById('bgMusic');
            const musicToggle = document.getElementById('musicToggle');
            if (bgMusic && musicToggle && bgMusic.paused) {
                // Remove listeners immediately so we don't spam play()
                document.body.removeEventListener('click', startMusic);
                document.body.removeEventListener('touchstart', startMusic);
                document.body.removeEventListener('scroll', startMusic);

                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicToggle.classList.add('playing');
                        musicToggle.querySelector('.play-icon').style.display = 'none';
                        musicToggle.querySelector('.pause-icon').style.display = 'block';
                    }).catch(e => {
                        console.log('Autoplay blocked:', e);
                        // Re-attach if it failed so next interaction tries again
                        document.body.addEventListener('click', startMusic, { once: true });
                        document.body.addEventListener('touchstart', startMusic, { once: true });
                    });
                }
            }
        };

        // Listen for any user interaction to start the music. Use body for broader capture.
        document.body.addEventListener('click', startMusic, { once: true });
        document.body.addEventListener('touchstart', startMusic, { once: true });
        document.body.addEventListener('scroll', startMusic, { once: true });

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

/* ---- Background Music ---- */
function initBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const playIcon = musicToggle?.querySelector('.play-icon');
    const pauseIcon = musicToggle?.querySelector('.pause-icon');

    if (!bgMusic || !musicToggle) return;

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
            }).catch(e => console.log('Playback failed:', e));
        } else {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        }
    });

    bgMusic.addEventListener('ended', () => {
        musicToggle.classList.remove('playing');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
    });
}
