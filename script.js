/* ============================================= */
/*  SCRIPT.JS - Teljes funkcionalitás            */
/*  Minden oldalra: index, projektek, projekt/*  */
/* ============================================= */

(function() {
    'use strict';

    // =============================================
    // 1. MOBIL MENÜ KEZELÉSE
    // =============================================
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) return;
        
        // Menü megnyitása/zárása
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Body scroll letiltása ha a menü nyitva van
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Menüpontra kattintva bezárás
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Kattintás a menün kívülre -> bezárás
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Escape gombra bezárás
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // =============================================
    // 2. SMOOTH SCROLL (belső linkekhez)
    // =============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Üres href vagy csak # esetén ne csináljunk semmit
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    // Fejléc magasságának kiszámítása (sticky header miatt)
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const extraOffset = 20; // Extra térköz
                    
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // URL frissítése a scroll után
                    setTimeout(() => {
                        history.pushState(null, null, href);
                    }, 500);
                }
            });
        });
        
        // Ha az URL-ben van hash, görgessünk oda betöltéskor
        if (window.location.hash) {
            setTimeout(() => {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const extraOffset = 20;
                    
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }

    // =============================================
    // 3. PROJEKTEK SZŰRŐ (projektek.html)
    // =============================================
    function initProjectFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const noResults = document.querySelector('.no-results');
        
        if (filterBtns.length === 0 || projectCards.length === 0) return;
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Aktív gomb frissítése
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                let visibleCount = 0;
                
                // Kártyák szűrése animációval
                projectCards.forEach((card, index) => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        visibleCount++;
                        
                        // Kis késleltetés az animációhoz
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 200);
                    }
                });
                
                // "Nincs találat" üzenet
                if (noResults) {
                    if (visibleCount === 0) {
                        setTimeout(() => {
                            noResults.style.display = 'block';
                        }, 300);
                    } else {
                        noResults.style.display = 'none';
                    }
                }
            });
        });
    }

    // =============================================
    // 4. SCROLL ANIMÁCIÓ (fade-in effekt)
    // =============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length === 0) return;
        
        function checkVisibility() {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Ha az elem láthatóvá válik
                if (rect.top < windowHeight * 0.85) {
                    el.classList.add('fade-in');
                }
            });
        }
        
        // Első ellenőrzés
        checkVisibility();
        
        // Scroll esemény throttling-gal
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                checkVisibility();
            }, 50);
        }, { passive: true });
    }

    // =============================================
    // 5. AKTÍV MENÜPONT KIEMELÉSE
    // =============================================
    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu a, .nav-menu-centered a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Aktív osztály eltávolítása mindenhonnan
            link.classList.remove('active');
            
            // Aktuális oldal kiemelése
            if (currentPath.endsWith(href) || 
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('active');
            }
            
            // Projekt aloldalak esetén a Projektek menüpont legyen aktív
            if (currentPath.includes('/projekt/') && href === '../projektek.html') {
                link.classList.add('active');
            }
        });
    }

    // =============================================
    // 6. FEJLÉC ÁTLÁTSZÓSÁG VÁLTOZTATÁSA SCROLLNÁL
    // =============================================
    function initHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Átlátszóság növelése scrollnál
            if (currentScroll > 50) {
                header.style.background = 'rgba(26, 26, 46, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.background = 'rgba(26, 26, 46, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // =============================================
    // 7. KÉPEK LUSTA BETÖLTÉSE (ha lenne sok kép)
    // =============================================
    function initLazyImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // =============================================
    // 8. KONZOL ÜZENET (Easter egg)
    // =============================================
    function consoleEasterEgg() {
        console.log(`
        🚀 Csuka Róbert - Portfólió Weboldal
        👨‍💻 Készült HTML, CSS és JavaScript felhasználásával
        📧 csukaa0@gmail.com
        🐙 github.com/csuka-robert
        
        "A technológia arra való, hogy használjuk."
        `);
    }

    // =============================================
    // INICIALIZÁLÁS
    // =============================================
    function init() {
        initMobileMenu();
        initSmoothScroll();
        initProjectFilter();
        initScrollAnimations();
        highlightCurrentPage();
        initHeaderScroll();
        initLazyImages();
        consoleEasterEgg();
        
        // Reszponzív újraméretezés kezelése
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Menü bezárása ha asztali nézetre váltunk
                const navMenu = document.querySelector('.nav-menu');
                const hamburger = document.querySelector('.hamburger');
                if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
    }

    // DOM betöltése után inicializálás
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();