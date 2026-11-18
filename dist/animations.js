/**
 * WEDDING INVITATION ANIMATION CONTROLLER (animations.js)
 * Lightweight Vanilla JS (IntersectionObserver + Scroll Parallax + Confetti)
 * Mobile-First 390px, 60fps animations
 */

document.addEventListener("DOMContentLoaded", () => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  // 1. Top Scroll Progress Bar (Sky-blue accent)
  const progressBar = document.createElement("div");
  progressBar.id = "scroll-progress-bar";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });

  // 2. IntersectionObserver for Scroll Reveals (.reveal, .reveal-left, .reveal-right, .pop, etc.)
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        // Stagger Miami destination letters
        if (entry.target.classList.contains("stagger-miami")) {
          const letters = entry.target.querySelectorAll(".miami-letter");
          letters.forEach((l, idx) => {
            setTimeout(() => l.classList.add("active"), idx * 120);
          });
        }

        // Stagger children with .reveal-child or .pop-swatch or .story-line
        const children = entry.target.querySelectorAll(".reveal-child, .pop-swatch, .story-line");
        children.forEach((child, idx) => {
          setTimeout(() => child.classList.add("active"), idx * 80);
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .pop, .boarding-pass-card, .stagger-miami, .divider-line, .divider-dot, [data-reveal-group]").forEach(el => {
    revealObserver.observe(el);
  });

  // 3. Hero Section (Arch with palms, Drifting Petals, Tap Spawn, Parallax)
  const heroOpening = document.querySelector("[data-opening-canvas='true']");
  if (heroOpening) {
    // Add Ken Burns slow zoom class to background media
    const themeMedia = heroOpening.querySelector("[data-opening-theme-media='true']");
    if (themeMedia) {
      themeMedia.classList.add("hero-ken-burns");
    }

    // Drifting petals container
    const petalContainer = document.createElement("div");
    petalContainer.className = "hero-petal-container";
    for (let i = 0; i < 7; i++) {
      const petal = document.createElement("div");
      petal.className = "drifting-petal";
      petal.style.left = `${Math.random() * 85 + 5}%`;
      petal.style.animationDelay = `${i * 1.3}s`;
      petal.style.animationDuration = `${7 + Math.random() * 4}s`;
      petalContainer.appendChild(petal);
    }
    heroOpening.appendChild(petalContainer);

    // Tap anywhere on hero to spawn small hearts/petals
    heroOpening.addEventListener("click", (e) => {
      const rect = heroOpening.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < 3; i++) {
        const particle = document.createElement("div");
        particle.className = "tap-particle";
        particle.innerHTML = i % 2 === 0 ? "🌸" : "💖";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.fontSize = `${16 + Math.random() * 8}px`;
        particle.style.setProperty("--tx", `${(Math.random() - 0.5) * 60}px`);
        particle.style.setProperty("--rot", `${(Math.random() - 0.5) * 60}deg`);
        heroOpening.appendChild(particle);

        setTimeout(() => particle.remove(), 1200);
      }
    });

    // Subtle parallax on hero background while scrolling
    window.addEventListener("scroll", () => {
      if (themeMedia && window.scrollY < 800) {
        themeMedia.style.transform = `translateY(${window.scrollY * 0.22}px)`;
      }
    }, { passive: true });
  }

  // 4. Hero Names Reveal ("Isabella", "and", "Lucas", Date)
  function triggerHeroNames() {
    document.querySelectorAll(".hero-name-isabella").forEach(el => el.classList.add("revealed"));
    document.querySelectorAll(".hero-name-and").forEach(el => el.classList.add("revealed"));
    document.querySelectorAll(".hero-name-lucas").forEach(el => el.classList.add("revealed"));
    document.querySelectorAll(".hero-subtitle").forEach(el => el.classList.add("revealed"));
    document.querySelectorAll(".hero-date-badge").forEach(el => el.classList.add("revealed"));
  }
  window.triggerHeroNames = triggerHeroNames;

  // Trigger when envelope opens, or right away if already open
  const envCover = document.getElementById("envelope-cover");
  if (envCover) {
    const handleEnvOpen = () => {
      setTimeout(triggerHeroNames, 2500);
    };
    envCover.addEventListener("click", handleEnvOpen, { once: true });
    envCover.addEventListener("touchstart", handleEnvOpen, { passive: true, once: true });
  } else {
    triggerHeroNames();
  }

  // 5. Timeline Vine Drawing on Scroll (stroke-dashoffset sync)
  const timelineSvg = document.querySelector("[data-demo-block='timeline'] svg");
  const vinePath = timelineSvg?.querySelector("path");
  if (vinePath) {
    vinePath.classList.add("timeline-vine-path");
    const pathLength = vinePath.getTotalLength ? vinePath.getTotalLength() : 480;
    vinePath.style.strokeDasharray = pathLength;
    vinePath.style.strokeDashoffset = pathLength;

    window.addEventListener("scroll", () => {
      const rect = timelineSvg.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const visiblePercent = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight + rect.height * 0.4)));
        vinePath.style.strokeDashoffset = pathLength * (1 - visiblePercent);
      }
    }, { passive: true });
  }

  // 6. Confetti on RSVP Submission + "Thank you" fade-in
  const rsvpForm = document.querySelector("[data-demo-block='rsvp'] form") || document.querySelector("form");
  if (rsvpForm) {
    const btn = rsvpForm.querySelector("button[type='submit']") || rsvpForm.querySelector("button");
    if (btn) {
      btn.removeAttribute("disabled");
    }
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      runConfettiBurst();

      if (btn) {
        btn.innerHTML = "✨ Thank You! RSVP Confirmed ✨";
        btn.style.backgroundColor = "#2e7d32";
        btn.style.color = "#ffffff";
        btn.style.transition = "all 0.4s ease";
        btn.disabled = true;
      }
    });
  }

  // Lightweight 60fps Canvas Confetti
  function runConfettiBurst() {
    let canvas = document.getElementById("confetti-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "confetti-canvas";
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#e29578", "#83c5be", "#ffddd2", "#5cadd6", "#722f37", "#fdf0d5", "#e9c46a"];
    const pieces = [];
    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 16 - 6,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let start = performance.now();
    function animate(time) {
      const elapsed = time - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.rSpeed;
        p.opacity = Math.max(0, 1 - (elapsed / 2200));

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        ctx.restore();
      });

      if (elapsed < 2200) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove();
      }
    }
    requestAnimationFrame(animate);
  }
});
