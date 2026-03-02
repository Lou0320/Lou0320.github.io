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
    document.querySelectorAll('section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
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
