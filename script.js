// スムーススクロールとナビゲーション制御
document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーションリンクにスムーススクロールを適用
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80; // ナビゲーションバーの高さを考慮
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    // アクティブなナビゲーションアイテムのハイライト
    const sections = document.querySelectorAll('.section');
    
    function highlightActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            
            if (sectionTop <= 200 && sectionTop + sectionHeight > 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // カードのホバーアニメーション強化
    const cards = document.querySelectorAll('.achievement-card, .project-card, .experience-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    // メダルの特別なホバーエフェクト
    const medalItems = document.querySelectorAll('.medal-item');
    
    medalItems.forEach(medal => {
        medal.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)';
        });
        
        medal.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    // スキルアイテムの回転アニメーション
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon');
            icon.style.transform = 'rotate(360deg) scale(1.2)';
            icon.style.transition = 'transform 0.6s ease';
        });
        
        skill.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            icon.style.transform = 'rotate(0deg) scale(1)';
        });
    });
    // 改善されたパーティクルエフェクト
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 3 + 2}px;
            height: ${Math.random() * 3 + 2}px;
            background: ${Math.random() > 0.5 ? 'var(--color-light-pink)' : 'var(--color-medium-pink)'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            opacity: ${Math.random() * 0.5 + 0.3};
            box-shadow: 0 0 6px rgba(132, 88, 104, 0.4);
        `;
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        // より自然なアニメーション
        let posY = startY;
        let posX = startX;
        let opacity = particle.style.opacity;
        let rotation = 0;
        
        const animation = setInterval(() => {
            posY -= Math.random() * 3 + 1;
            posX += Math.sin(posY * 0.01) * 2 + (Math.random() - 0.5);
            opacity -= 0.008;
            rotation += Math.random() * 10 - 5;
            
            particle.style.top = posY + 'px';
            particle.style.left = posX + 'px';
            particle.style.opacity = opacity;
            particle.style.transform = `rotate(${rotation}deg)`;
            
            if (posY < -10 || opacity <= 0) {
                clearInterval(animation);
                particle.remove();
            }
        }, 50);
    }
    // パーティクルを定期的に生成（控えめに）
    setInterval(createParticle, 4000);
    // 実績統計のカウントアップアニメーション（ゆっくり版）
    function animateCounter(element, target) {
        let current = 0;
        // より多くの分割でゆっくりとしたアニメーション（300回に分割）
        const increment = target / 300;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 10); // 10msごとに更新
    }
    // スクロール時に統計アニメーションを実行
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;
    function checkStatsVisibility() {
        if (statsAnimated) return;
        
        const statsSection = document.querySelector('#achievements');
        if (statsSection) {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                statsAnimated = true;
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    if (number > 0) {
                        animateCounter(stat, number);
                    }
                });
            }
        }
    }
    // スクロール時のパフォーマンス向上
    let ticking = false;
    
    function updateOnScroll() {
        highlightActiveNav();
        checkStatsVisibility();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    // レスポンシブ時のタッチイベント対応
    if ('ontouchstart' in window) {
        // タッチデバイス用の最適化
        const touchCards = document.querySelectorAll('.achievement-card, .project-card, .experience-card');
        
        touchCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px) scale(1.01)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    console.log('🌸 ここを見てくれた人とKaggleがしたい 🌸');
});
// CSS3アニメーションとナビゲーションスタイルの動的追加
const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
    .nav-item.active {
        background: var(--color-cream);
        color: var(--color-dark-pink);
        font-weight: 600;
        box-shadow: var(--shadow-soft);
    }
    
    .particle {
        animation: particle-float 6s linear infinite;
    }
    
    @keyframes particle-float {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
        }
        50% {
            transform: translateY(-50vh) rotate(180deg) scale(1.2);
        }
        100% {
            transform: translateY(-100vh) rotate(360deg) scale(0.8);
        }
    }
    
    .achievement-card, .project-card, .experience-card, .stat-card {
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .medal-item {
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .skill-icon {
        transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .particle {
            animation: none !important;
        }
        
        * {
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(dynamicStyle);