// Simple client-side JavaScript for enhancing the UI
document.addEventListener('DOMContentLoaded', function() {
    // Add animation to the poem when it's displayed
    const poemElement = document.querySelector('.poem');
    if (poemElement) {
        poemElement.style.opacity = '0';
        setTimeout(() => {
            poemElement.style.transition = 'opacity 1s ease-in-out';
            poemElement.style.opacity = '1';
        }, 300);
    }
    
    // Form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            const title = document.getElementById('title').value.trim();
            const emotion = document.getElementById('emotion').value.trim();
            const tone = document.getElementById('tone').value.trim();
            const context = document.getElementById('context').value.trim();
            
            if (!title || !emotion || !tone || !context) {
                event.preventDefault();
                alert('Please fill out all fields to generate a poem.');
            }
        });
    }
});
