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

const trainingModal = document.getElementById('training-modal');
const openTrainingButton = document.querySelector('[data-open-training]');
const closeTrainingButton = document.querySelector('[data-close-training]');

if (trainingModal && openTrainingButton && closeTrainingButton) {
    const openTrainingModal = () => {
        trainingModal.showModal();
        document.body.classList.add('training-modal-open');
    };

    const closeTrainingModal = () => trainingModal.close();

    openTrainingButton.addEventListener('click', openTrainingModal);
    closeTrainingButton.addEventListener('click', closeTrainingModal);
    trainingModal.addEventListener('click', (event) => {
        if (event.target === trainingModal) closeTrainingModal();
    });
    trainingModal.addEventListener('close', () => {
        document.body.classList.remove('training-modal-open');
        openTrainingButton.focus();
    });
}

const storyCarousel = document.querySelector('.story-carousel');

if (storyCarousel) {
    const slides = [...storyCarousel.querySelectorAll('.story-slide')];
    const dots = [...storyCarousel.querySelectorAll('.story-dot')];
    const previousButton = storyCarousel.querySelector('.story-prev');
    const nextButton = storyCarousel.querySelector('.story-next');
    let activeSlide = 0;
    let autoplayId;
    let touchStartX = 0;

    const showSlide = (index) => {
        activeSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeSlide;
            slide.hidden = !isActive;
            slide.classList.toggle('is-active', isActive);
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeSlide;
            dot.classList.toggle('is-active', isActive);
            if (isActive) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
    };

    const stopAutoplay = () => window.clearInterval(autoplayId);
    const startAutoplay = () => {
        if (prefersReducedMotion) return;
        stopAutoplay();
        autoplayId = window.setInterval(() => showSlide(activeSlide + 1), 6000);
    };

    previousButton.addEventListener('click', () => {
        showSlide(activeSlide - 1);
        startAutoplay();
    });

    nextButton.addEventListener('click', () => {
        showSlide(activeSlide + 1);
        startAutoplay();
    });

    dots.forEach((dot, index) => dot.addEventListener('click', () => {
        showSlide(index);
        startAutoplay();
    }));

    storyCarousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showSlide(activeSlide - 1);
        if (event.key === 'ArrowRight') showSlide(activeSlide + 1);
    });
    storyCarousel.addEventListener('mouseenter', stopAutoplay);
    storyCarousel.addEventListener('mouseleave', startAutoplay);
    storyCarousel.addEventListener('focusin', stopAutoplay);
    storyCarousel.addEventListener('focusout', startAutoplay);
    storyCarousel.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
        stopAutoplay();
    }, { passive: true });
    storyCarousel.addEventListener('touchend', (event) => {
        const distance = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(distance) > 45) showSlide(activeSlide + (distance < 0 ? 1 : -1));
        startAutoplay();
    }, { passive: true });

    startAutoplay();
}

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
    '.hero-stats > div, .hero-panorama, .profile-row, .service-feature, .story-carousel, .booking-card, main section h2'
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
