/* helperFunctions.js */

/* Formatting Functions */

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// Format date (example: YYYY-MM-DD)
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/* Validation Functions */

// Validate email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password (min 8 characters)
function validatePassword(password) {
    return password.length >= 8;
}

/* DOM Manipulation Helpers */

// Add class to element
function addClass(element, className) {
    element.classList.add(className);
}

// Remove class from element
function removeClass(element, className) {
    element.classList.remove(className);
}

// Toggle class on element
function toggleClass(element, className) {
    element.classList.toggle(className);
}

// Create element with attributes
function createElement(tagName, attributes = {}, textContent = '') {
    const element = document.createElement(tagName);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}
