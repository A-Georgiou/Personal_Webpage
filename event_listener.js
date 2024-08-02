document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('#toggle-dark-mode');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
        });
    });
});