/* ==============================
   Funcionalidades JS
   - Preloader
   - Año dinámico en footer
   - Navbar responsive
   - Dark/Light mode con localStorage
   - Carrusel Hero
   - Galería con filtros + Lightbox
   - Slider de testimonios (auto + manual)
   - Validación de formulario
   - ScrollReveal simple (IntersectionObserver)
   - Botón "Volver arriba"
   ============================== */

// Preloader
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => pre.style.display = "none", 350);
});

// Año footer
document.getElementById("year").textContent = new Date().getFullYear();

// Navbar responsive
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
navToggle?.addEventListener("click", () => navMenu.classList.toggle("open"));
navMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navMenu.classList.remove("open")));

// Dark / Light mode
const root = document.documentElement;
const modeBtn = document.getElementById("modeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") root.classList.add("light");

function setIcon() {
  const i = modeBtn.querySelector("i");
  if (root.classList.contains("light")) { i.className = "fa-solid fa-sun"; }
  else { i.className = "fa-solid fa-moon"; }
}
setIcon();

modeBtn.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
  setIcon();
});

// Back to top
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 600) backToTop.classList.add("show");
  else backToTop.classList.remove("show");
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ScrollReveal-like
const revealEls = document.querySelectorAll(".reveal-up");
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* ===== Carrusel Hero ===== */
const heroCarousel = (() => {
  const track = document.querySelector("#heroCarousel .carousel__track");
  if (!track) return;
  const slides = Array.from(track.children);
  const prev = document.querySelector("#heroCarousel .prev");
  const next = document.querySelector("#heroCarousel .next");
  const dotsContainer = document.querySelector("#heroCarousel .carousel__dots");

  let index = 0;
  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    Array.from(dotsContainer.children).forEach((d, j) => d.classList.toggle("active", j === index));
  }

  // dots
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(b);
  });

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));

  // auto-play
  setInterval(() => goTo(index + 1), 6000);
})();

/* ===== Filtros + Lightbox (Galería) ===== */
(() => {
  const chips = document.querySelectorAll(".chip");
  const items = document.querySelectorAll(".masonry__item");

  chips.forEach(ch => {
    ch.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      ch.classList.add("active");
      const filter = ch.dataset.filter;
      items.forEach(it => {
        it.style.display = (filter === "all" || it.dataset.category === filter) ? "" : "none";
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCap = document.getElementById("lightboxCaption");
  const close = document.getElementById("lightboxClose");

  items.forEach(fig => {
    fig.addEventListener("click", () => {
      const img = fig.querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCap.textContent = fig.querySelector("figcaption")?.textContent || "";
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  function hideLightbox() {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.removeAttribute("src");
  }
  close.addEventListener("click", hideLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) hideLightbox(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") hideLightbox(); });
})();

/* ===== Slider Testimonios ===== */
(() => {
  const slider = document.getElementById("testiSlider");
  if (!slider) return;
  const slides = slider.querySelectorAll(".slide");
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");
  const dotsC = slider.querySelector(".slider__dots");
  let i = 0;

  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("active", k === i));
    dotsC.querySelectorAll("button").forEach((d, k) => d.classList.toggle("active", k === i));
  }

  slides.forEach((_, k) => {
    const b = document.createElement("button");
    if (k === 0) b.classList.add("active");
    b.addEventListener("click", () => show(k));
    dotsC.appendChild(b);
  });

  prev.addEventListener("click", () => show(i - 1));
  next.addEventListener("click", () => show(i + 1));

  setInterval(() => show(i + 1), 7000);
})();

/* ===== Validación de formulario ===== */
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

function setError(input, msg) {
  const group = input.closest(".form__group");
  group.querySelector(".error").textContent = msg || "";
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = form.nombre;
  const email = form.email;
  const asunto = form.asunto;
  const mensaje = form.mensaje;

  let ok = true;
  if (!nombre.value.trim()) { setError(nombre, "Ingresa tu nombre"); ok = false; } else setError(nombre);
  if (!validateEmail(email.value)) { setError(email, "Email no válido"); ok = false; } else setError(email);
  if (!asunto.value.trim()) { setError(asunto, "Indica un asunto"); ok = false; } else setError(asunto);
  if (!mensaje.value.trim()) { setError(mensaje, "Escribe tu mensaje"); ok = false; } else setError(mensaje);

  if (!ok) return;

  // Simulación de envío (no hay backend aquí)
  form.reset();
  formMsg.textContent = "¡Mensaje enviado! Te contactaremos pronto.";
  setTimeout(() => formMsg.textContent = "", 4000);
});
