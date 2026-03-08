/* ============================================================
   RHOVIC GABIJAN — PORTFOLIO JAVASCRIPT
   Features: Typewriter, Scroll animations, Skill bars,
             Navbar scroll, Back-to-top, Contact form
   ============================================================ */

"use strict";

/* ── DOM Ready ──────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initTypewriter();
  initScrollAnimations();
  initSkillBars();
  initBackToTop();
  initSmoothNavLinks();
});

/* ============================================================
   NAVBAR — add .scrolled class on scroll
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  // Roles that cycle through
  const roles = [
    '"Computer Engineering Student"',
    '"Python Developer"',
    '"Web Developer"',
    '"Student Leader"',
    '"Problem Solver"',
  ];

  let roleIndex = 0;
  let charIndex  = 0;
  let isDeleting  = false;
  const typingSpeed   = 80;
  const deletingSpeed = 40;
  const pauseDuration = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // Typing forward
      el.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        // Pause then start deleting
        isDeleting = true;
        setTimeout(type, pauseDuration);
        return;
      }
      setTimeout(type, typingSpeed);
    } else {
      // Deleting
      el.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex  = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, deletingSpeed);
    }
  }

  // Small initial delay so the page has loaded
  setTimeout(type, 600);
}

/* ============================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================================ */
function initScrollAnimations() {
  // Add fade-up class to elements we want to animate
  const targets = document.querySelectorAll(
    ".skill-card, .project-card, .cert-card, .timeline-item, " +
    ".achievement-item, .about-text, .about-avatar-wrap, " +
    ".contact-card, .soft-skill-tag, .info-item"
  );

  targets.forEach((el) => el.classList.add("fade-up"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ============================================================
   SKILL BARS — animate width on scroll into view
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll(".skill-fill");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute("data-width") + "%";
          // Small delay so CSS transition fires properly
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================================================
   SMOOTH SCROLL for NAV LINKS (closes mobile menu)
   ============================================================ */
function initSmoothNavLinks() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;

      e.preventDefault();

      // Close Bootstrap mobile navbar if open
      const navbar = document.getElementById("navMenu");
      if (navbar && navbar.classList.contains("show")) {
        const toggler = document.querySelector(".navbar-toggler");
        if (toggler) toggler.click();
      }

      // Offset for fixed navbar height
      const navbarHeight = document.getElementById("navbar")?.offsetHeight || 70;
      const elementTop   = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementTop - navbarHeight - 12, behavior: "smooth" });
    });
  });
}

/* ============================================================
   CONTACT FORM HANDLER
   ============================================================ */
function handleContactForm() {
  const name    = document.getElementById("contactName")?.value.trim();
  const email   = document.getElementById("contactEmail")?.value.trim();
  const message = document.getElementById("contactMsg")?.value.trim();
  const feedback = document.getElementById("form-feedback");

  // Basic validation
  if (!name || !email || !message) {
    showFeedback(feedback, "⚠️  Please fill in all fields.", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showFeedback(feedback, "⚠️  Please enter a valid email address.", "error");
    return;
  }

  // Simulate sending (replace with real backend/EmailJS as needed)
  const btn = document.querySelector(".contact-form .btn-neon-blue");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Sending...";
  }

  setTimeout(() => {
    showFeedback(
      feedback,
      "✅  Message sent! I'll get back to you soon.",
      "success"
    );
    // Reset form
    document.getElementById("contactName").value  = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactMsg").value   = "";
    if (btn) {
      btn.disabled    = false;
      btn.innerHTML   = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  }, 1200);
}

/* ============================================================
   COPY EMAIL TO CLIPBOARD
   ============================================================ */
function copyEmail() {
  const emails = "gabijanrhovic15@gmail.com, gabijan.rhovic.mangapuro@gmail.com";

  navigator.clipboard.writeText(emails).then(() => {
    const feedback = document.getElementById("copy-feedback");
    if (feedback) {
      feedback.textContent = "📋 Email copied!";
      setTimeout(() => {
        feedback.textContent = "";
      }, 2000);
    }
  });
}

/* ── Helpers ────────────────────────────────────────────────── */
function showFeedback(el, msg, type) {
  if (!el) return;
  el.textContent  = msg;
  el.className    = "form-feedback " + type;

  // Auto-clear after 5s
  setTimeout(() => {
    el.textContent = "";
    el.className   = "form-feedback";
  }, 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
