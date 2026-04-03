// 🎭 iCloth - Hero Slider & Visuals
function initHeroSlider() {
    const sliderContainer = document.getElementById('hero-slider');
    if (!sliderContainer) return;

    if (!window.heroSlides || window.heroSlides.length === 0) {
        // Fallback for default theme
        const fallbackSlides = [
            { id: '1', imageUrl: 'images/hero/hero1.jpg', title: 'Summer Collection', sub: 'New Arrivals' },
            { id: '2', imageUrl: 'images/hero/hero2.jpg', title: 'Street Wear', sub: 'The Latest Style' }
        ];
        renderHeroSlides(fallbackSlides);
    } else {
        renderHeroSlides(window.heroSlides);
    }
}

function renderHeroSlides(slides) {
    const container = document.getElementById('hero-slider');
    if (!container) return;
    
    container.innerHTML = slides.map((s, idx) => `
        <div class="hero-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${s.imageUrl}')"></div>
    `).join('');

    let current = 0;
    setInterval(() => {
        const slidesEls = document.querySelectorAll('.hero-slide');
        if (slidesEls.length < 2) return;
        slidesEls[current].classList.remove('active');
        current = (current + 1) % slidesEls.length;
        slidesEls[current].classList.add('active');
    }, 5000);
}

function formatBrandTitle(title) {
    if (!title) return { main: 'iCloth', span: 'FASHION' };
    const parts = title.split(' ');
    if (parts.length < 2) return { main: parts[0], span: '' };
    const last = parts.pop();
    return { main: parts.join(' '), span: last };
}
