// Simple smooth scroll for navigation
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Dynamic header message
function updateHeaderMessage() {
    const hour = new Date().getHours();
    let message = "Welcome!";
    if (hour < 12) message = "Good morning!";
    else if (hour < 18) message = "Good afternoon!";
    else message = "Good evening!";
    document.getElementById('header-message').textContent = message;
}
updateHeaderMessage();

// Basic form handler (no backend)
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message!');
    this.reset();
});
