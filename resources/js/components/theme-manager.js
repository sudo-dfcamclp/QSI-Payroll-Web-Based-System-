// Apply the selected theme
function applyTheme(theme) {
    const html = document.documentElement;

    if (theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    updateThemeUI(theme === 'dark');
}

function updateThemeUI(isDark) {
    const icon = document.getElementById('themeToggleIcon');
    const text = document.getElementById('themeToggleText');
    const knob = document.getElementById('themeToggleKnob');

    if (icon) {
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    if (text) {
        text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    if (knob) {
        if (isDark) {
            knob.classList.add('translate-x-5');
        } else {
            knob.classList.remove('translate-x-5');
        }
    }
}

// Toggle between light and dark mode
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    const newTheme = isDark ? 'light' : 'dark';

    localStorage.setItem('qsi_theme', newTheme);

    applyTheme(newTheme);
}

// Initialize the saved theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('qsi_theme');

    const theme = savedTheme === 'dark'
        ? 'dark'
        : 'light';

    applyTheme(theme);
}

// Export functions for other JavaScript modules
export {
    applyTheme,
    updateThemeUI,
    toggleTheme,
    initializeTheme
};

// Initialize the saved theme
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
});