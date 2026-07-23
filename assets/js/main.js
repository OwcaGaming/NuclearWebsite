/* ============================================
   NUCLEAR SECTOR WEBSITE - VANILLA JAVASCRIPT
   ============================================ */

// ===================================
// 1. THEME TOGGLE
// ===================================

const themeToggle = document.getElementById('themeToggle');
const storageKey = 'procm-theme';

function getStoredTheme() {
    try {
        return localStorage.getItem(storageKey);
    } catch (error) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(storageKey, theme);
    } catch (error) {
        console.warn('Theme preference could not be saved', error);
    }
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
}

const initialTheme = 'light';
applyTheme(initialTheme);

themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    saveTheme(nextTheme);
    applyTheme(nextTheme);
});

// ===================================
// 2. MOBILE NAVIGATION TOGGLE
// ===================================

const navToggle = document.getElementById('navToggle');
const navMain = document.getElementById('navMain');
const navList = document.querySelector('.nav-list');

// Toggle navigation menu
navToggle?.addEventListener('click', function() {
    const isActive = navList.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isActive);
});

// Close navigation when a link is clicked
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Close navigation when clicking outside
document.addEventListener('click', (e) => {
    if (!navMain.contains(e.target) && !navToggle.contains(e.target)) {
        navList.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

// ===================================
// 3. LANGUAGE SELECTOR
// ===================================

const languageButtons = document.querySelectorAll('.lang-btn');
const contactForm = document.getElementById('contactForm');
const header = document.getElementById('header');
const mainContent = document.querySelector('main') || document.body;

languageButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const selectedLang = this.getAttribute('data-lang');
        
        // Update active button
        languageButtons.forEach(btn => btn.classList.remove('lang-active'));
        this.classList.add('lang-active');
        
        // Handle language selection
        if (selectedLang === 'en') {
            // English is the default - just reset
            document.body.style.display = 'block';
            removeLanguagePlaceholder();
        } else if (selectedLang === 'pl') {
            showLanguagePlaceholder('pl', 'Wersja w języku polskim będzie dostępna wkrótce', 'Polish version coming soon');
        } else if (selectedLang === 'nl') {
            showLanguagePlaceholder('nl', 'Nederlandse versie komt binnenkort', 'Dutch version coming soon');
        }
    });
});

function showLanguagePlaceholder(lang, mainText, subText) {
    removeLanguagePlaceholder();
    
    const placeholder = document.createElement('div');
    placeholder.className = 'lang-coming-soon';
    placeholder.id = 'langPlaceholder';
    placeholder.innerHTML = `
        <div style="background: white; padding: 48px; border-radius: 8px; text-align: center; max-width: 400px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);">
            <h2 style="color: #2D1B69; margin-bottom: 16px;">${mainText}</h2>
            <p style="color: #4A4A4A; margin: 0;">${subText}</p>
            <p style="color: #4A4A4A; margin-top: 16px; font-size: 14px;">The website is currently available in English only.</p>
        </div>
    `;
    
    // Add close button functionality
    placeholder.addEventListener('click', function(e) {
        if (e.target === this) {
            removeLanguagePlaceholder();
            // Reset to English
            languageButtons.forEach(btn => btn.classList.remove('lang-active'));
            document.querySelector('[data-lang="en"]').classList.add('lang-active');
        }
    });
    
    document.body.appendChild(placeholder);
}

function removeLanguagePlaceholder() {
    const existing = document.getElementById('langPlaceholder');
    if (existing && existing.classList.contains('lang-coming-soon')) {
        existing.remove();
    }
}

// ===================================
// 4. CONTACT FORM VALIDATION
// ===================================

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Form field elements
const formFields = {
    companyName: document.getElementById('companyName'),
    contactPerson: document.getElementById('contactPerson'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message'),
    consent: document.getElementById('consent')
};

// Error message elements
const errorMessages = {
    companyName: document.getElementById('companyNameError'),
    contactPerson: document.getElementById('contactPersonError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    message: document.getElementById('messageError'),
    consent: document.getElementById('consentError')
};

// Validation rules
const validators = {
    
    contactPerson: (value) => {
        if (!value.trim()) return 'Contact person name is required';
        if (value.trim().length < 2) return 'Contact person name must be at least 2 characters';
        return null;
    },
    
    email: (value) => {
        if (!value.trim()) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
        return null;
    },
    
    phone: (value) => {
        if (!value.trim()) return 'Telephone number is required';
        const phoneRegex = /^[\d\s\-\+\(\)\.]+$/;
        if (!phoneRegex.test(value.trim())) return 'Please enter a valid telephone number';
        if (value.replace(/\D/g, '').length < 7) return 'Telephone number must have at least 7 digits';
        return null;
    },
    
    message: (value) => {
        // Message is optional, but if provided should be reasonable length
        if (value.trim().length > 5000) return 'Message must be less than 5000 characters';
        return null;
    },
    
    consent: (value) => {
        if (!value) return 'You must agree to the privacy consent to proceed';
        return null;
    }
};

// Validate a single field
function validateField(fieldName) {
    const field = formFields[fieldName];
    const errorElement = errorMessages[fieldName];
    const validator = validators[fieldName];
    
    let value = fieldName === 'consent' ? field.checked : field.value;
    const error = validator(value);
    
    // Update UI
    if (error) {
        field.classList.add('error');
        errorElement.textContent = error;
        return false;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        return true;
    }
}

// Add real-time validation
Object.keys(formFields).forEach(fieldName => {
    const field = formFields[fieldName];
    
    if (fieldName === 'consent') {
        field.addEventListener('change', () => validateField(fieldName));
    } else {
        field.addEventListener('blur', () => validateField(fieldName));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(fieldName);
            }
        });
    }
});

// Form submission
form?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous message
    formMessage.textContent = '';
    formMessage.className = '';
    
    // Validate all fields
    let isValid = true;
    Object.keys(formFields).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showFormMessage('Please fix the errors above and try again', 'error');
        return;
    }
    
    // Prepare form data
    const formData = {
        companyName: formFields.companyName.value.trim(),
        contactPerson: formFields.contactPerson.value.trim(),
        email: formFields.email.value.trim(),
        phone: formFields.phone.value.trim(),
        message: formFields.message.value.trim(),
        consent: formFields.consent.checked,
        timestamp: new Date().toISOString()
    };
    
    // Log form data (for development/debugging)
    console.log('Form submitted with data:', formData);
    
    // ===================================
    // FORM ENDPOINT CONFIGURATION
    // ===================================
    // 
    // This form currently validates frontend but does not automatically send data.
    // To connect to a form service, choose one of the following options:
    //
    // OPTION 1: Netlify Forms (Recommended for Netlify hosting)
    //   - Simply change the form action attribute to: action="/form" method="POST" name="contact"
    //   - Netlify will handle form submissions automatically
    //
    // OPTION 2: Formspree (Works with any hosting)
    //   1. Go to https://formspree.io/
    //   2. Create a new form and get your form ID
    //   3. Replace [FORM_ID] in the action attribute: action="https://formspree.io/f/[FORM_ID]" method="POST"
    //
    // OPTION 3: Email.js (Requires JavaScript configuration)
    //   1. Install Email.js: npm install @emailjs/browser
    //   2. Initialize in this file with your service ID and template ID
    //   3. Replace the code below with the Email.js send function
    //
    // OPTION 4: Custom Backend
    //   1. Update the action attribute to your backend endpoint: action="https://yourapi.com/submit"
    //   2. Ensure backend handles CORS if on different domain
    //   3. Backend should validate and process the data
    //
    // CURRENT STATUS: Form validates successfully but shows a local success message.
    // In production, implement one of the above options to send data to your service.
    
    // Simulate form submission (remove or replace with actual submission)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Clear error states
        Object.keys(formFields).forEach(fieldName => {
            formFields[fieldName].classList.remove('error');
            errorMessages[fieldName].textContent = '';
        });
        
        // Show success message
        showFormMessage('Thank you for your message. We will respond to your enquiry shortly.', 'success');
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 500);
});

// Show form message
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

// ===================================
// 5. SMOOTH SCROLLING ENHANCEMENT
// ===================================
// CSS handles smooth scrolling with scroll-behavior: smooth
// This section adds any additional smooth scroll enhancements if needed

// Optional: Scroll spy for active navigation (enhance in future if needed)
document.addEventListener('DOMContentLoaded', () => {
    // Check if smooth scroll is supported
    const html = document.documentElement;
    if ('scrollBehavior' in html.style) {
        // Native smooth scroll is supported
        console.log('Smooth scroll is supported');
    }
});

// ===================================
// 6. ACCESSIBILITY ENHANCEMENTS
// ===================================

// Enhance keyboard navigation for buttons
document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('keydown', (e) => {
        // Allow Enter and Space to activate buttons
        if ((element.tagName === 'BUTTON' || element.className.includes('btn')) && 
            (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            element.click();
        }
    });
});

// Add visible focus indicator enhancement
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ===================================
// 7. PERFORMANCE & UTILITIES
// ===================================

// Log initialization
console.log('Website initialized successfully');
console.log('Current language: English');
console.log('Form validation: Active');

// Check for browser compatibility warnings
if (!document.querySelectorAll) {
    console.warn('This website requires a modern browser');
}

// ===================================
// 8. FORM DATA SUBMISSION TEMPLATE
// ===================================
// 
// UNCOMMENT AND CUSTOMIZE ONE OF THESE TEMPLATES BASED ON YOUR SERVICE:

/* 
// TEMPLATE 1: Using Fetch API with custom backend
async function submitFormData(data) {
    try {
        const response = await fetch('https://your-api.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            console.log('Form submitted successfully');
            return true;
        } else {
            throw new Error('Server responded with error');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        return false;
    }
}

// TEMPLATE 2: Using EmailJS (requires @emailjs/browser package)
import emailjs from '@emailjs/browser';

emailjs.init('YOUR_PUBLIC_KEY');

function submitFormDataWithEmailJS(data) {
    emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
        company_name: data.companyName,
        contact_person: data.contactPerson,
        email: data.email,
        phone: data.phone,
        message: data.message
    }).then(
        (response) => {
            console.log('Email sent:', response.status);
        },
        (error) => {
            console.error('Email error:', error);
        }
    );
}

// TEMPLATE 3: HTML Form Submission (for Netlify or similar)
// Simply add to form element: action="/submit" method="POST" name="contact"
// Or for Formspree: action="https://formspree.io/f/YOUR_FORM_ID" method="POST"
*/
