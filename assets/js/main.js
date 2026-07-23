const themeToggle = document.getElementById('themeToggle');
const navToggle = document.getElementById('navToggle');
const navList = document.querySelector('.nav-list');
const languageButtons = document.querySelectorAll('.lang-btn');
const placeholder = document.getElementById('langPlaceholder');
const yearNode = document.getElementById('year');
if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

function getStoredTheme() {
    try {
        return localStorage.getItem('procm-theme');
    } catch (error) {
        return null;
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

const initialTheme = getStoredTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(initialTheme);

themeToggle?.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try {
        localStorage.setItem('procm-theme', nextTheme);
    } catch (error) {
        // Ignore storage errors and keep UI working.
    }
    applyTheme(nextTheme);
});

navToggle?.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-list a').forEach((link) => {
    link.addEventListener('click', () => {
        navList?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', (event) => {
    if (!navList || !navToggle) return;
    const clickedInsideNav = navList.contains(event.target) || navToggle.contains(event.target);
    if (!clickedInsideNav) {
        navList.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

function showLanguagePlaceholder(message, detail) {
    if (!placeholder) return;
    placeholder.hidden = false;
    placeholder.innerHTML = `
        <div class="toast" role="status" aria-live="polite">
            <div class="toast-header">
                <h2 id="langTitle">${message}</h2>
                <button class="lang-close" type="button" aria-label="Close notification">×</button>
            </div>
            <p>${detail}</p>
        </div>
    `;

    placeholder.querySelector('.lang-close')?.addEventListener('click', () => {
        hideLanguagePlaceholder();
        document.querySelector('[data-lang="en"]').classList.add('lang-active');
        document.querySelectorAll('.lang-btn').forEach((button) => {
            if (button.getAttribute('data-lang') !== 'en') {
                button.classList.remove('lang-active');
            }
        });
    });
}

function hideLanguagePlaceholder() {
    if (!placeholder) return;
    placeholder.hidden = true;
    placeholder.innerHTML = '';
}

languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
        languageButtons.forEach((item) => item.classList.remove('lang-active'));
        button.classList.add('lang-active');

        const selectedLang = button.getAttribute('data-lang');
        if (selectedLang === 'en') {
            hideLanguagePlaceholder();
        } else if (selectedLang === 'pl') {
            showLanguagePlaceholder('Polish version coming soon', 'The website is currently available in English only.');
        } else if (selectedLang === 'nl') {
            showLanguagePlaceholder('Dutch version coming soon', 'The website is currently available in English only.');
        }
    });
});


const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const formFields = {
    companyName: document.getElementById('companyName'),
    contactPerson: document.getElementById('contactPerson'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    reason: document.getElementById('reason'),
    message: document.getElementById('message'),
    consent: document.getElementById('consent')
};
const errorFields = {
    companyName: document.getElementById('companyNameError'),
    contactPerson: document.getElementById('contactPersonError'),
    email: document.getElementById('emailError'),
    phone: document.getElementById('phoneError'),
    reason: document.getElementById('reasonError'),
    message: document.getElementById('messageError'),
    consent: document.getElementById('consentError')
};

function setFieldError(name, message) {
    const field = formFields[name];
    const error = errorFields[name];
    if (!field || !error) return;

    if (message) {
        field.classList.add('error');
        error.textContent = message;
    } else {
        field.classList.remove('error');
        error.textContent = '';
    }
}

function validateField(name) {
    const field = formFields[name];
    if (!field) return true;

    if (name === 'companyName') {
        const value = field.value.trim();
        const error = value ? '' : 'Company name is required.';
        setFieldError(name, error);
        return !error;
    }

    if (name === 'contactPerson') {
        const value = field.value.trim();
        const error = value ? '' : 'Contact person name is required.';
        setFieldError(name, error);
        return !error;
    }

    if (name === 'email') {
        const value = field.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const error = value && isValid ? '' : 'Please enter a valid email address.';
        setFieldError(name, error);
        return !error;
    }

    if (name === 'phone') {
        const value = field.value.trim();
        const digits = value.replace(/\D/g, '').length;
        const error = value && digits >= 7 ? '' : 'Please enter a telephone number with at least 7 digits.';
        setFieldError(name, error);
        return !error;
    }

    if (name === 'reason') {
        const value = field.value;
        const error = value ? '' : 'Please select a reason for contact.';
        setFieldError(name, error);
        return !error;
    }

    if (name === 'message') {
        const value = field.value.trim();
        const error = value.length > 2500 ? 'Message must be shorter than 2500 characters.' : '';
        setFieldError(name, error);
        return !error;
    }

    if (name === 'consent') {
        const error = field.checked ? '' : 'Please confirm that you agree to the privacy consent.';
        setFieldError(name, error);
        return !error;
    }

    return true;
}

Object.entries(formFields).forEach(([name, field]) => {
    if (!field) return;
    if (name === 'consent') {
        field.addEventListener('change', () => validateField(name));
    } else {
        field.addEventListener('blur', () => validateField(name));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(name);
            }
        });
    }
});

form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!formMessage) return;

    formMessage.textContent = '';
    formMessage.className = 'form-message';

    const isValid = Object.keys(formFields).every((name) => validateField(name));
    if (!isValid) {
        formMessage.textContent = 'Please correct the highlighted fields and try again.';
        formMessage.className = 'form-message error';
        return;
    }

    const endpoint = form.getAttribute('data-endpoint') || '';
    if (!endpoint || endpoint.includes('[FORM_ENDPOINT_HERE]')) {
        formMessage.textContent = 'The form endpoint has not yet been configured. Please connect the form to the hosting provider\'s email handler before go-live.';
        formMessage.className = 'form-message error';
        return;
    }

    form.reset();
    Object.keys(formFields).forEach((name) => {
        const field = formFields[name];
        if (field) {
            field.classList.remove('error');
        }
    });
    Object.keys(errorFields).forEach((name) => {
        const error = errorFields[name];
        if (error) {
            error.textContent = '';
        }
    });

    formMessage.textContent = 'Thank you. Your enquiry is ready to be submitted.';
    formMessage.className = 'form-message success';
});
