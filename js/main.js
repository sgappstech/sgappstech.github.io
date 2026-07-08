/* ===================== HEADER SHADOW ON SCROLL ===================== */
const siteHeader = document.querySelector("header");

if(siteHeader){
  const onScroll = () => {
    if(window.scrollY > 10){
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
}

/* ===================== MOBILE NAV TOGGLE ===================== */
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("header nav");

if(navToggle && navMenu){
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });
}

/* ===================== PARTICLE ANIMATION (hero sections) ===================== */
document.querySelectorAll(".particles-canvas").forEach(canvas => {
  const ctx = canvas.getContext("2d");
  let width, height, particles;

  const colors = ["rgba(59,130,246,", "rgba(139,92,246,"];

  const resize = () => {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  };

  const createParticles = () => {
    const count = Math.min(55, Math.floor((width * height) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
  };

  const step = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + "0.55)";
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = "rgba(59,130,246," + (0.14 * (1 - dist / 120)) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  };

  resize();
  createParticles();
  step();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
});

/* ===================== SCROLL REVEAL ===================== */
const revealEls = document.querySelectorAll(".reveal");

if(revealEls.length){
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -10% 0px" });

  revealEls.forEach(el => revealObserver.observe(el));

  // Safety net: if any reveal element hasn't appeared shortly after load
  // (e.g. very tall content, unusual layouts), just show it — content
  // should never stay hidden waiting on a scroll animation.
  setTimeout(() => {
    document.querySelectorAll(".reveal:not(.visible)").forEach(el => {
      el.classList.add("visible");
    });
  }, 1500);
}

/* ===================== ANIMATED COUNTERS ===================== */
const counters = document.querySelectorAll(".counter");

if(counters.length){
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;

      const counter = entry.target;
      counter.innerText = "0";

      const updateCounter = () => {
        const target = +counter.getAttribute("data-target");
        const current = +counter.innerText;
        const increment = target / 80;

        if(current < target){
          counter.innerText = Math.ceil(current + increment);
          setTimeout(updateCounter, 20);
        } else {
          counter.innerText = target;
        }
      };

      updateCounter();
      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => counterObserver.observe(counter));
}

/* ===================== FAQ ACCORDION ===================== */
document.querySelectorAll(".faq-item").forEach(item => {
  item.addEventListener("click", (e) => {
    if(e.target.tagName === "A") return; // let links inside answers work normally
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(el => el.classList.remove("open"));
    if(!wasOpen) item.classList.add("open");
  });
});
