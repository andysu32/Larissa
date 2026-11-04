// Script básico e limpo para Nossa História de Amor
document.addEventListener('DOMContentLoaded', () => {
    initBasicNavigation();
    initBasicFeelingsForm();
    initBasicVideoPlayers();
    initQuietReveals();
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
