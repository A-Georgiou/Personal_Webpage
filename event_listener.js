document.addEventListener('DOMContentLoaded', function() {
    const darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

    // Add no-transition class initially
    document.body.classList.add('no-transition');

    if (darkMode) {
        document.body.classList.add('dark-mode');
    }

    // Remove no-transition class after the content is fully loaded
    setTimeout(() => {
        document.body.classList.remove('no-transition');
    }, 0);

    const toggleButtons = document.querySelectorAll('#toggle-dark-mode');
    toggleButtons.forEach(div => {
        div.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        });
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        document.body.classList.add("resize-animation-stopper");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove("resize-animation-stopper");
        }, 400);
    });
});
