// Script básico e limpo para Nossa História de Amor
document.addEventListener('DOMContentLoaded', () => {
    initBasicNavigation();
    initBasicFeelingsForm();
    initBasicVideoPlayers();
    initQuietReveals();
    initUnlivedMemory();
    initErasure();
});

// Navegação básica sem interferir no CSS
function initBasicNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    // Menu mobile toggle simples
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Formulário básico sem interferir no CSS
function initBasicFeelingsForm() {
    const form = document.getElementById('feelingsForm');
    if (!form) return;
    
    const rangeInputs = form.querySelectorAll('input[type="range"]');
    const rangeValues = form.querySelectorAll('.range-value');
    
    if (rangeInputs.length === 0 || rangeValues.length === 0) return;
    
    // Atualizar valores dos ranges em tempo real
    rangeInputs.forEach((input, index) => {
        const valueDisplay = rangeValues[index];
        if (!valueDisplay) return;
        
        // Carregar valor salvo
        const savedValue = localStorage.getItem(`feeling_${input.id}`);
        if (savedValue !== null) {
            input.value = savedValue;
            valueDisplay.textContent = savedValue;
        }
        
        // Atualizar display em tempo real
        input.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
        });
        
        // Salvar ao soltar o mouse
        input.addEventListener('change', (e) => {
            localStorage.setItem(`feeling_${input.id}`, e.target.value);
        });
    });
    
    // Envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Salvar todos os valores
        rangeInputs.forEach(input => {
            localStorage.setItem(`feeling_${input.id}`, input.value);
        });
        
        // Feedback simples
        alert('Sentimentos salvos com sucesso! 💕');
    });
}

// Player de vídeos CONSERTADO e funcionando
function initBasicVideoPlayers() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        const wrapper = video.closest('.video-wrapper');
        const overlay = wrapper?.querySelector('.video-overlay');
        
        // Pausar outros vídeos quando um começar
        video.addEventListener('play', () => {
            videos.forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
            
            // Esconder overlay quando vídeo começar
            if (overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.visibility = 'hidden';
                }, 300);
            }
        });
        
        // Mostrar overlay quando vídeo pausar
        video.addEventListener('pause', () => {
            if (overlay) {
                overlay.style.visibility = 'visible';
                overlay.style.opacity = '1';
            }
        });
        
        // Play ao clicar no overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                video.play().catch(e => {
                    console.log('Erro ao reproduzir vídeo:', e);
                    // Fallback: mostrar mensagem de erro
                    showRomanticMessage('Erro ao reproduzir vídeo 😔');
                });
            });
        }
        
        // Tratamento de erro básico
        video.addEventListener('error', () => {
            console.log('Erro ao carregar vídeo:', video.src);
            showRomanticMessage('Erro ao carregar vídeo 😔');
        });
        
        // Adicionar controles básicos se não existirem
        if (!video.hasAttribute('controls')) {
            video.setAttribute('controls', 'true');
        }
        
        // Garantir que o overlay esteja visível inicialmente
        if (overlay) {
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
        }
    });
}

// Scroll suave básico para links internos
document.addEventListener('DOMContentLoaded', () => {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

function initQuietReveals() {
    const nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
        nodes.forEach((node) => node.classList.add('is-in'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.22, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((node, index) => {
        node.style.transitionDelay = `${Math.min(index * 90, 420)}ms`;
        observer.observe(node);
    });
}

function initUnlivedMemory() {
    const section = document.getElementById('futuro');
    if (!section) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canObserve = 'IntersectionObserver' in window;

    if (reduce || !canObserve) {
        section.classList.add('is-static');
    }

    if (!canObserve) return;

    let started = false;
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || started) return;
                started = true;
                if (!reduce) section.classList.add('is-playing');
                softenSoundtrack();
                observer.unobserve(section);
            });
        },
        { threshold: 0, rootMargin: '0px 0px -25% 0px' }
    );

    observer.observe(section);
}

function softenSoundtrack() {
    document.querySelectorAll('audio').forEach((audio) => {
        let start;
        try {
            start = audio.volume;
        } catch (e) {
            return;
        }
        const target = 0.3;
        if (!(start > target)) return;

        const duration = 1700;
        const t0 = performance.now();
        const step = (now) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = p * p * (3 - 2 * p);
            try {
                audio.volume = start + (target - start) * eased;
            } catch (err) {
                return;
            }
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

function initErasure() {
    const button = document.getElementById('erasureButton');
    if (!button || button.dataset.bound === '1') return;
    button.dataset.bound = '1';

    button.addEventListener('click', () => {
        if (document.body.classList.contains('is-erasing')) return;
        document.body.classList.add('is-erasing');
        button.disabled = true;
        eraseWhatNoLongerExists(button);
    });
}

function eraseWhatNoLongerExists(originEl) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.style.background = '#000';
    document.body.style.background = '#000';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';

    document.querySelectorAll('video').forEach((video) => {
        try { video.pause(); } catch (e) { /* segue o apagamento */ }
    });

    if (reduce) {
        document.querySelectorAll('header, section, footer, .erasure').forEach((el) => {
            el.style.visibility = 'hidden';
        });
        document.body.classList.add('is-erased');
        return;
    }

    const origin = originEl.getBoundingClientRect();
    const ox = origin.left + origin.width / 2;
    const oy = origin.top + origin.height / 2;

    const atoms = [...document.querySelectorAll(
        'h1, h2, h3, p, li, img, video, a, button, .quality-item, .hero-orb, .feeling-card'
    )].filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 2 && rect.height > 2;
    });

    const pieces = atoms.filter((el) => !atoms.some((other) => other !== el && el.contains(other)));

    const scatter = (el, delay, duration, dx, dy, rot, scale) => {
        el.getAnimations().forEach((anim) => anim.cancel());
        el.style.animation = 'none';
        el.style.transformOrigin = 'center center';
        el.animate(
            [
                { transform: 'none', opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${scale})`, opacity: 0 }
            ],
            { duration, delay, easing: 'ease-in', fill: 'forwards' }
        );
    };

    pieces.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(cx - ox, cy - oy);
        const delay = Math.min(dist / 780, 1600);
        const onScreen = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
        if (!onScreen) {
            el.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: 900, delay: 400, easing: 'ease-in', fill: 'forwards' }
            );
            return;
        }
        const dx = (cx - ox) * (0.05 + Math.random() * 0.16) + (Math.random() - 0.5) * 90;
        const dy = -20 - Math.random() * 120;
        scatter(el, delay, 1500 + Math.random() * 1200, dx, dy, (Math.random() - 0.5) * 28, 0.2 + Math.random() * 0.5);
    });

    document.querySelectorAll('header, section, footer').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const dist = Math.hypot(rect.left + rect.width / 2 - ox, rect.top + rect.height / 2 - oy);
        el.animate(
            [
                { opacity: 1, transform: 'none' },
                { opacity: 0, transform: 'translateY(-24px) scale(0.98)' }
            ],
            { duration: 2600, delay: Math.min(dist / 900, 900), easing: 'ease-in', fill: 'forwards' }
        );
    });

    const veil = document.createElement('div');
    veil.id = 'erasureVeil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);

    const canvas = document.createElement('canvas');
    canvas.id = 'erasureField';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    function fitCanvas() {
        canvas.width = Math.floor(window.innerWidth * ratio);
        canvas.height = Math.floor(window.innerHeight * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    fitCanvas();

    const particles = [];
    let area = 0;
    const boxes = [];
    pieces.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const left = Math.max(rect.left, 0);
        const right = Math.min(rect.right, window.innerWidth);
        const top = Math.max(rect.top, 0);
        const bottom = Math.min(rect.bottom, window.innerHeight);
        const w = right - left;
        const h = bottom - top;
        if (w < 6 || h < 6) return;
        area += w * h;
        const color = getComputedStyle(el).color;
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        boxes.push({
            left, right, top, bottom,
            color: match ? `${match[1]},${match[2]},${match[3]}` : '237,230,218'
        });
    });

    const gap = Math.max(8, Math.sqrt(area / 850));
    boxes.forEach((box) => {
        for (let y = box.top; y < box.bottom && particles.length < 950; y += gap) {
            for (let x = box.left; x < box.right && particles.length < 950; x += gap) {
                particles.push({
                    x: x + (Math.random() - 0.5) * gap,
                    y: y + (Math.random() - 0.5) * gap,
                    vx: (Math.random() - 0.5) * 2.2,
                    vy: -0.35 - Math.random() * 1.8,
                    g: 0.012 + Math.random() * 0.028,
                    size: 1 + Math.random() * 2.4,
                    life: 0.75 + Math.random() * 0.25,
                    decay: 0.0035 + Math.random() * 0.007,
                    color: box.color
                });
            }
        }
    });

    const started = performance.now();
    function frame(now) {
        try {
            const veilAlpha = Math.min(1, (now - started) / 5200);
            veil.style.opacity = String(veilAlpha);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            let alive = 0;
            particles.forEach((p) => {
                if (p.life <= 0) return;
                alive += 1;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.g;
                p.vx *= 0.992;
                p.life -= p.decay;
                ctx.globalAlpha = Math.max(p.life, 0);
                ctx.fillStyle = `rgb(${p.color})`;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            ctx.globalAlpha = 1;
            if (alive > 0 || veilAlpha < 1) {
                requestAnimationFrame(frame);
                return;
            }
        } catch (e) {
            veil.style.opacity = '1';
        }
        canvas.remove();
        document.body.classList.add('is-erased');
    }
    requestAnimationFrame(frame);
}
