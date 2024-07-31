document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.navbar a');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and pages
            navLinks.forEach(link => link.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));

            // Add active class to the clicked link
            this.classList.add('active');

            // Show the corresponding section
            const sectionId = this.getAttribute('href').substring(1); // remove the #
            const activePage = document.getElementById(sectionId);
            if (activePage) {
                activePage.classList.add('active');
            }
        });
    });

    // Load the initial section
    const initialLink = document.querySelector('.navbar a[href="#home-page"]');
    if (initialLink) {
        initialLink.classList.add('active');
        const initialPage = document.getElementById('home-page');
        if (initialPage) {
            initialPage.classList.add('active');
        }
    }

    // const openPopupButton = document.getElementById('open-popup');
    
});
