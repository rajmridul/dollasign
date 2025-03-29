document.addEventListener('DOMContentLoaded', () => {
    console.log('About page loaded, fam!');

    // Hamburger menu toggle
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });
});