const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('menu-principal');

navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('nav--open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navList.classList.remove('nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

document.getElementById('ano-atual').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const counters = document.querySelectorAll('.count-up');

const setCounterValue = (counter, value) => {
    counter.textContent = new Intl.NumberFormat('pt-BR').format(value);
};

if (prefersReducedMotion) {
    counters.forEach((counter) => setCounterValue(counter, Number(counter.dataset.count)));
} else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = Number(counter.dataset.count);
            const duration = 1400;
            const startedAt = performance.now();

            const animateCounter = (now) => {
                const progress = Math.min((now - startedAt) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                setCounterValue(counter, Math.round(target * easedProgress));

                if (progress < 1) requestAnimationFrame(animateCounter);
            };

            requestAnimationFrame(animateCounter);
            observer.unobserve(counter);
        });
    }, { threshold: 0.65 });

    counters.forEach((counter) => counterObserver.observe(counter));
}

const revealEls = document.querySelectorAll(
    '.hero-stats > div, .hero-panorama, .profile-row, .service-feature, .story-grid blockquote, .booking-card, main section h2'
);

if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
    revealEls.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
}
