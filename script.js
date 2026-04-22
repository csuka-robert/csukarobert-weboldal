// Hamburger menü funkcionalitás
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active'); // Opcionális: animációhoz
});

// Modális ablak funkcionalitás
const modalButtons = document.querySelectorAll('[data-modal-target]');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.modal .close-btn');

// Gombokra kattintva megnyitja a modált
modalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetModal = document.querySelector(button.dataset.modalTarget);
        if (targetModal) {
            openModal(targetModal);
        }
    });
});

// Bezárás gombokra kattintva bezárja a modált
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal'); // Megkeresi a legközelebbi modális szülőt
        if (modal) {
            closeModal(modal);
        }
    });
});

// Kattintás a modálon kívülre bezárja a modált
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        // Ellenőrzi, hogy a kattintás a modál külső részén történt-e (nem a modal-tartalmon belül)
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// ESC billentyűre bezárja a legfelső modált
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.active'); // Megkeresi az aktív modált
        if (openModal) {
            closeModal(openModal);
        }
    }
});


// Modál megnyitása
function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    // Opcionális: megakadályozza az oldal görgetését, amíg a modál nyitva van
    document.body.style.overflow = 'hidden';
}

// Modál bezárása
function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    // Opcionális: visszaállítja az oldal görgetést
    document.body.style.overflow = 'auto';
}

// Opcionális: Animate on Scroll (ha használod)
// Ehhez további JS kód kell, ami figyeli a görgetést és hozzáadja a 'fade-in' class-t
// Amikor az elem láthatóvá válik. Ez egy kicsit komplexebb, de vannak kész library-k is rá (pl. AOS)
