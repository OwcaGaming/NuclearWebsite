const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");
const navLabel = navToggle?.querySelector(".sr-only");

function setNavigation(open) {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    primaryNav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    if (navLabel) navLabel.textContent = open ? "Close navigation" : "Open navigation";
}

navToggle?.addEventListener("click", () => {
    setNavigation(navToggle.getAttribute("aria-expanded") !== "true");
});

primaryNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavigation(false));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavigation(false);
});

const tabList = document.querySelector('[role="tablist"]');
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

function selectTab(tab, focus = false) {
    const panelId = tab.getAttribute("aria-controls");

    tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
        panel.hidden = panel.id !== panelId;
    });

    if (focus) tab.focus();
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectTab(tab));
});

tabList?.addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    if (nextIndex !== currentIndex) {
        event.preventDefault();
        selectTab(tabs[nextIndex], true);
    }
});

const observedSections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".primary-nav a"));

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${visible.target.id}`;
            if (active) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0.05, 0.35] });

    observedSections.forEach((section) => sectionObserver.observe(section));
}

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const requiredFields = ["name", "email", "topic", "message"];

const errorCopy = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    topic: "Please select an area of interest.",
    message: "Please provide a short outline of your challenge."
};

function validateField(field) {
    const errorNode = document.getElementById(`${field.id}Error`);
    let valid = field.value.trim().length > 0;

    if (field.type === "email") {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    }

    field.classList.toggle("error", !valid);
    field.setAttribute("aria-invalid", String(!valid));
    if (errorNode) errorNode.textContent = valid ? "" : errorCopy[field.id];
    return valid;
}

requiredFields.forEach((id) => {
    const field = document.getElementById(id);
    field?.addEventListener("blur", () => validateField(field));
    field?.addEventListener("input", () => {
        if (field.classList.contains("error")) validateField(field);
    });
});

form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = requiredFields.map((id) => document.getElementById(id)).filter(Boolean);
    const valid = fields.map(validateField).every(Boolean);

    if (!valid) {
        if (formStatus) formStatus.textContent = "Please complete the highlighted fields.";
        fields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
        return;
    }

    const name = document.getElementById("name").value.trim();
    const company = document.getElementById("company").value.trim();
    const email = document.getElementById("email").value.trim();
    const topic = document.getElementById("topic").value;
    const message = document.getElementById("message").value.trim();
    const subject = `ProCM enquiry — ${topic}${company ? ` — ${company}` : ""}`;
    const body = [
        "Hello Mr. Van Oudenaarde,",
        "",
        message,
        "",
        "Contact details",
        `Name: ${name}`,
        `Organisation: ${company || "Not provided"}`,
        `Email: ${email}`,
        `Area of interest: ${topic}`
    ].join("\n");

    if (formStatus) formStatus.textContent = "Opening your mail application…";
    window.location.href = `mailto:janvo@procm.eu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
