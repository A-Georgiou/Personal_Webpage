document.addEventListener('DOMContentLoaded', function() {

    const toggleButtons = document.querySelectorAll('#toggle-dark-mode');
    toggleButtons.forEach(div => {
        div.addEventListener('click', function() {
            document.documentElement.classList.toggle('dark-mode');
            const isDarkMode = document.documentElement.classList.contains('dark-mode');
            localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        });
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        document.body.classList.add("no-transition");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove("no-transition");
        }, 400);
    });
});

