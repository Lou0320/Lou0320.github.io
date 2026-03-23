// ─── EmailJS Configuration ───────────────────────────────────────────────────
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an Email Service (e.g. Gmail) → copy the Service ID
// 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
//    → copy the Template ID
// 4. Go to Account → API Keys → copy your Public Key
// Then replace the three placeholders below:

const EMAILJS_PUBLIC_KEY  = 'ldF5tiJUwllEH8iOz';
const EMAILJS_SERVICE_ID  = 'service_lou0320';
const EMAILJS_TEMPLATE_ID = 'template_lou0320';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

// ─── Scroll-Based Blur Animation Speed ───────────────────────────────────────
let lastScrollY = window.scrollY;
let scrollVelocity = 0;

window.addEventListener('scroll', () => {
    scrollVelocity = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
    
    const bgShapes = document.querySelectorAll('.bg-shape');
    bgShapes.forEach((shape, i) => {
        // Base speeds: 5s to 8s (already faster)
        const baseSpeeds = [5, 6, 7, 5.5, 6.5, 5.2, 6.8, 5.3, 5.8, 6.2, 5.5, 6.8];
        const baseSpeed = baseSpeeds[i] || 6;
        
        // Min speed when not scrolling, max speed when scrolling fast
        const minSpeed = baseSpeed;
        const maxSpeed = baseSpeed * 0.15; // 6-7x faster when scrolling fast
        
        // Cap velocity at 30 for even more aggressive speed
        const cappedVelocity = Math.min(scrollVelocity, 30);
        const speedFactor = Math.max(0.15, 1 - (cappedVelocity / 30) * 0.85);
        const newSpeed = minSpeed * speedFactor;
        
        shape.style.animationDuration = newSpeed + 's';
    });
}, { passive: true });

// ─── Smooth Scroll ───────────────────────────────────────────────────────────
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// ─── Section Fade-in on Scroll ───────────────────────────────────────────────
function revealSections() {
    const navBarHeight = 70; // approximate header height
    const viewportCenter = (window.innerHeight + navBarHeight) / 2;
    
    document.querySelectorAll('section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < viewportCenter) {
            section.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('DOMContentLoaded', revealSections);

// ─── Nav Active Link Highlight ───────────────────────────────────────────────
function setActiveNav() {
    const scrollPos = window.scrollY + 100;
    document.querySelectorAll('section').forEach(section => {
        const id = section.id;
        const navLink = document.querySelector(`nav a[href="#${id}"]`);
        if (navLink) {
            const offset = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= offset && scrollPos < offset + height) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}
window.addEventListener('scroll', setActiveNav);
window.addEventListener('DOMContentLoaded', setActiveNav);

// ─── Contact Form – EmailJS ───────────────────────────────────────────────────
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.getElementById('send-btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  + ' at ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const templateParams = {
        from_name:  this.querySelector('[name="from_name"]').value,
        from_email: this.querySelector('[name="from_email"]').value,
        message:    this.querySelector('[name="message"]').value,
        time:       timeStr
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            btn.textContent = 'Message Sent ✓';
            btn.style.background = '#6bcb8b';
            this.reset();
        })
        .catch((err) => {
            console.error('EmailJS error:', err);
            btn.textContent = 'Failed – Try Again';
            btn.style.background = '#f97b7b';
            btn.disabled = false;
        });
});

// ─── Image Zoom Buttons for Passion Galleries ─────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('img-zoom-modal');
    const modalImg = modal.querySelector('img');

    function openModal(src, alt) {
        modalImg.src = src;
        modalImg.alt = alt || '';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        modalImg.src = '';
    }

    // For gallery sliders we handle image click-to-zoom inside the slider logic.
    // No visible buttons are injected so panels show only the image and arrows.

    // Close when clicking the overlay or close button
    modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target.classList.contains('close-btn')) closeModal();
    });

    // Close with Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
});

// ─── Convert passion galleries into simple sliders ───────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    function createSlider(gallery) {
        const images = Array.from(gallery.querySelectorAll('img'));
        if (images.length === 0) return;

        const slider = document.createElement('div');
        slider.className = 'gallery-slider';

        const slides = document.createElement('div');
        slides.className = 'slides';
        // populate slides
        images.forEach(orig => {
            const s = document.createElement('img');
            s.className = 'slide-img';
            s.src = orig.getAttribute('src');
            s.alt = orig.getAttribute('alt') || '';
            slides.appendChild(s);
        });
        slider.appendChild(slides);

        // no caption element: panels should show only the image

        const prevBtn = document.createElement('button'); prevBtn.className = 'slider-arrow prev'; prevBtn.type = 'button'; prevBtn.innerHTML = '‹';
        const nextBtn = document.createElement('button'); nextBtn.className = 'slider-arrow next'; nextBtn.type = 'button'; nextBtn.innerHTML = '›';
        slider.appendChild(prevBtn);
        slider.appendChild(nextBtn);

        gallery.innerHTML = '';
        gallery.appendChild(slider);

        let idx = 0;
        function show(i, animate = true) {
            idx = ((i % images.length) + images.length) % images.length;

            const applyTransform = () => {
                slides.style.transform = `translateX(-${idx * 100}%)`;
            };

            if (!animate) {
                // jump without transition
                const prevTransition = slides.style.transition;
                slides.style.transition = 'none';
                applyTransform();
                // restore transition on next frame
                requestAnimationFrame(() => { slides.style.transition = prevTransition || ''; });
                return;
            }

            // animated slide: perform transform (no blur)
            requestAnimationFrame(() => { applyTransform(); });
        }

        prevBtn.addEventListener('click', () => show(idx - 1));
        nextBtn.addEventListener('click', () => show(idx + 1));

        // keyboard navigation
        slider.tabIndex = 0;
        slider.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });

        // touch swipe
        let startX = null;
        slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        slider.addEventListener('touchend', (e) => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) {
                if (dx < 0) nextBtn.click(); else prevBtn.click();
            }
            startX = null;
        });

        // click image to open zoom modal
        slides.addEventListener('click', (e) => {
            if (e.target && e.target.tagName === 'IMG') {
                const modal = document.getElementById('img-zoom-modal');
                const modalImg = modal.querySelector('img');
                modalImg.src = e.target.src;
                modalImg.alt = e.target.alt || '';
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });

        show(0, false);
    }

    document.querySelectorAll('.passion-gallery').forEach(g => createSlider(g));
});
