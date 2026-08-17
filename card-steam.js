(() => {
  "use strict";

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvases = [...document.querySelectorAll(".card-steam")];
  if (!canvases.length) return;

  const engines = canvases
    .map((canvas) => {
      const context = canvas.getContext("2d", { alpha: true });
      if (!context) return null;

      const engine = {
        canvas,
        context,
        width: 0,
        height: 0,
        ratio: 1,
        visible: false,
        particles: [],
      };

      const reset = (particle, warm = false) => {
        const age = warm ? Math.random() : 0;
        particle.life = age;
        particle.duration = 3.2 + Math.random() * 2.1;
        particle.x =
          engine.width * 0.51 +
          (Math.random() - 0.5) * Math.min(92, engine.width * 0.24);
        particle.y =
          engine.height * 0.47 -
          age * engine.height * (0.3 + Math.random() * 0.2);
        particle.vx = (Math.random() - 0.5) * 10;
        particle.vy = -(20 + Math.random() * 23);
        particle.size = 18 + Math.random() * Math.min(40, engine.width * 0.1);
        particle.phase = Math.random() * Math.PI * 2;
      };

      const resize = () => {
        const box = canvas.getBoundingClientRect();
        engine.width = Math.max(1, Math.round(box.width));
        engine.height = Math.max(1, Math.round(box.height));
        engine.ratio = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(engine.width * engine.ratio);
        canvas.height = Math.round(engine.height * engine.ratio);
        context.setTransform(engine.ratio, 0, 0, engine.ratio, 0, 0);
        engine.particles.length = 0;
        const count = engine.width < 500 ? 28 : 38;
        for (let index = 0; index < count; index += 1) {
          const particle = {};
          reset(particle, true);
          engine.particles.push(particle);
        }
      };

      engine.reset = reset;
      engine.resize = resize;
      resize();
      new ResizeObserver(resize).observe(canvas);
      return engine;
    })
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const engine = engines.find(({ canvas }) => canvas === entry.target);
        if (engine) engine.visible = entry.isIntersecting;
      });
    },
    { threshold: 0.02 },
  );
  engines.forEach(({ canvas }) => observer.observe(canvas));

  let previous = performance.now();
  const frame = (time) => {
    const delta = Math.min(0.034, Math.max(0.001, (time - previous) / 1000));
    previous = time;

    engines.forEach((engine) => {
      if (!engine.visible) return;
      const { context, width, height } = engine;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";

      engine.particles.forEach((particle) => {
        particle.life += delta / particle.duration;
        if (particle.life >= 1 || particle.y < -particle.size) {
          engine.reset(particle);
        }

        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        const progress = particle.life;
        const fade = Math.sin(Math.PI * progress);
        const wave = Math.sin(time * 0.001 + particle.phase + progress * 5);
        const x = particle.x + wave * (7 + progress * 15);
        const radius = particle.size * (0.62 + progress * 1.28);
        const alpha = fade * (0.035 + (1 - progress) * 0.035);
        const gradient = context.createRadialGradient(
          x,
          particle.y,
          radius * 0.08,
          x,
          particle.y,
          radius,
        );
        gradient.addColorStop(0, `rgba(247,246,241,${alpha})`);
        gradient.addColorStop(0.4, `rgba(222,221,216,${alpha * 0.55})`);
        gradient.addColorStop(1, "rgba(210,210,208,0)");

        context.save();
        context.translate(x, particle.y);
        context.scale(0.72 + progress * 0.3, 1.32);
        context.translate(-x, -particle.y);
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, particle.y, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
    });

    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
})();
