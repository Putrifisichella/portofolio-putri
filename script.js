(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    initNavbarScrollState();
    initMobileMenu();
    initActiveSectionIndicator();
    initScrollReveal();
    initCaseStudyModal();
    initHeroTyping();
  });

  /* ---------------------------------------------------------
     Navbar background state on scroll
  --------------------------------------------------------- */
  function initNavbarScrollState() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const setState = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    setState();
    window.addEventListener("scroll", setState, { passive: true });
  }

  /* ---------------------------------------------------------
     Mobile hamburger menu
  --------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      menu.hidden = isOpen;
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------------------------------------------------------
     Active section indicator in navbar
  --------------------------------------------------------- */
  function initActiveSectionIndicator() {
    const navLinks = document.querySelectorAll("[data-nav]");
    if (!navLinks.length) return;

    const sections = Array.from(navLinks)
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!sections.length) return;

    const linkForSection = (id) =>
      document.querySelector(`.navbar__links a[href="#${id}"]`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = linkForSection(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            document
              .querySelectorAll(".navbar__links a.is-active")
              .forEach((el) => el.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------------------------------------------------
     Scroll reveal for sections (fade + translateY)
  --------------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      ".section__title, .about__body, .skills__grid, .project-card, .process__list, .timeline, .resume-cta__inner, .contact__grid"
    );

    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    targets.forEach((el) => el.setAttribute("data-reveal", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------
     Project case study modal
  --------------------------------------------------------- */
  const CASE_STUDIES = {
    bem: {
      title: "Sistem Pendaftaran Online Kegiatan BEM FASILKOM UNSIKA",
      overview:
        "Sistem pendaftaran kegiatan berbasis web untuk BEM Fasilkom UNSIKA, dirancang dan dikembangkan sendiri dari tahap perencanaan hingga implementasi menggunakan metodologi SDLC Waterfall.",
      problem:
        "Pendaftaran kegiatan kampus perlu dikelola secara terpusat agar panitia dan peserta memiliki alur registrasi, manajemen kegiatan, dan riwayat pendaftaran yang jelas.",
      solution:
        "Website dengan alur registrasi akun, login, CRUD kegiatan, manajemen kegiatan dan peserta, pendaftaran kegiatan, hingga riwayat pendaftaran — mencakup sisi antarmuka maupun logika di baliknya.",
      role: "Individu — front-end dan back-end.",
      process:
        "Mengikuti tahapan SDLC Waterfall: analisis kebutuhan, perancangan antarmuka dan alur pengguna, implementasi, hingga pengujian sistem pendaftaran.",
      technology: ["HTML", "CSS", "JavaScript", "Bootstrap", "MySQL"],
      features: [
        "Registrasi akun dan login",
        "CRUD kegiatan serta manajemen peserta",
        "Pendaftaran kegiatan dan riwayat pendaftaran",
      ],
      result: "[TAMBAHKAN HASIL PROYEK]",
      github: "https://github.com/Putrifisichella/bem-event",
      demo: "",
    },
    edutrack: {
      title: "EduTrack.id",
      overview:
        "Platform edukasi yang dikembangkan selama program magang Web Developer di PT Vinix Seven Aurum, bersama tim pengembangan beranggotakan 3 orang.",
      problem:
        "Desain UI/UX platform sudah dirancang di Figma oleh tim, dan perlu diterjemahkan menjadi antarmuka front-end yang fungsional serta responsif di desktop maupun mobile.",
      solution:
        "Mengonversi desain Figma menjadi antarmuka web menggunakan HTML, CSS, JavaScript, dan Bootstrap, serta mengimplementasikan beberapa fitur front-end sesuai spesifikasi desain yang telah ditentukan.",
      role: "Front-End Developer (magang), dalam tim beranggotakan 3 orang.",
      process:
        "Menerima desain dan spesifikasi dari tim, mengimplementasikan 3–4 fitur front-end, menerapkan responsive design, dan berkolaborasi menggunakan Git/GitHub selama proses pengembangan.",
      technology: ["Figma", "HTML", "CSS", "JavaScript", "Bootstrap"],
      features: [
        "Implementasi 3–4 fitur front-end sesuai spesifikasi desain Figma",
        "Tampilan responsif untuk desktop dan mobile",
        "Kolaborasi tim pengembangan menggunakan Git dan GitHub",
      ],
      result: "Menerima umpan balik positif dari mentor terkait implementasi antarmuka front-end yang dikerjakan selama magang.",
      github: "https://github.com/Putrifisichella/lms-edutrack.id",
      demo: "",
    },
  };

  function initCaseStudyModal() {
    const modal = document.getElementById("caseModal");
    const content = document.getElementById("modalContent");
    const main = document.getElementById("main");
    const header = document.querySelector(".navbar");
    const footer = document.querySelector(".footer");
    if (!modal || !content) return;

    let lastFocused = null;

    const setBackgroundInert = (isInert) => {
      // `inert` keeps focus and assistive tech out of the background
      // while the dialog is open. Falls back silently on old browsers.
      [main, header, footer].forEach((el) => {
        if (el) el.inert = isInert;
      });
    };

    const getFocusable = () =>
      Array.from(
        modal.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

    const trapFocus = (e) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const openModal = (id) => {
      const data = CASE_STUDIES[id];
      if (!data) return;

      content.innerHTML = buildCaseStudyMarkup(data);
      lastFocused = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      setBackgroundInert(true);
      modal.querySelector(".modal__close").focus();
    };

    const closeModal = () => {
      modal.hidden = true;
      document.body.style.overflow = "";
      setBackgroundInert(false);
      if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll("[data-open-case]").forEach((btn) => {
      btn.addEventListener("click", () =>
        openModal(btn.getAttribute("data-open-case"))
      );
    });

    modal.querySelectorAll("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") closeModal();
      trapFocus(e);
    });
  }

  function buildCaseStudyMarkup(data) {
    const featureItems = data.features.map((f) => `<li>${escapeHTML(f)}</li>`).join("");
    const techItems = data.technology.map((t) => `<li>${escapeHTML(t)}</li>`).join("");

    const isRealUrl = (url) => typeof url === "string" && /^https?:\/\//.test(url);

    const githubLink = isRealUrl(data.github)
      ? `<a class="link-btn" href="${escapeAttr(data.github)}" target="_blank" rel="noopener">GitHub</a>`
      : `<span class="link-btn link-btn--disabled">GitHub belum tersedia</span>`;

    const demoLink = isRealUrl(data.demo)
      ? `<a class="link-btn" href="${escapeAttr(data.demo)}" target="_blank" rel="noopener">Live Demo</a>`
      : `<span class="link-btn link-btn--disabled">Demo belum tersedia</span>`;

    return `
      <h3 id="modalTitle">${escapeHTML(data.title)}</h3>

      <h4>Overview</h4>
      <p>${escapeHTML(data.overview)}</p>

      <h4>Masalah</h4>
      <p>${escapeHTML(data.problem)}</p>

      <h4>Solusi</h4>
      <p>${escapeHTML(data.solution)}</p>

      <h4>Peran Saya</h4>
      <p>${escapeHTML(data.role)}</p>

      <h4>Proses</h4>
      <p>${escapeHTML(data.process)}</p>

      <h4>Teknologi</h4>
      <ul class="project-card__stack">${techItems}</ul>

      <h4>Fitur Utama</h4>
      <ul>${featureItems}</ul>

      <h4>Hasil</h4>
      <p>${escapeHTML(data.result)}</p>

      <div class="modal__links">
        ${githubLink}
        ${demoLink}
      </div>
    `;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  /* ---------------------------------------------------------
     Jendela kode di hero: animasi mengetik sekali saja, tidak loop
  --------------------------------------------------------- */
  function initHeroTyping() {
    const codeEl = document.querySelector(".code-window__body code");
    const windowEl = document.querySelector(".code-window");
    if (!codeEl || !windowEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const fullHTML = codeEl.innerHTML;
    const fullText = codeEl.textContent;
    codeEl.textContent = "";

    let i = 0;
    const speed = 12; // ms per character — fast, not decorative

    const tick = () => {
      i += 3;
      if (i >= fullText.length) {
        codeEl.innerHTML = fullHTML;
        windowEl.classList.add("is-typed");
        return;
      }
      codeEl.textContent = fullText.slice(0, i);
      requestAnimationFrame(() => setTimeout(tick, speed));
    };

    requestAnimationFrame(() => setTimeout(tick, 300));
  }
})();