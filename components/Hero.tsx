"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Typed from "typed.js";

type HeroProps = {
  name?: string;
  tagline?: string;
  onExplore: () => void;
  isTransitioning?: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
  pulseOffset: number;
};

function createParticle(width: number, height: number, reduceMotion: boolean): Particle {
  const random = (min: number, max: number) => Math.random() * (max - min) + min;
  const motionFactor = reduceMotion ? 0.35 : 1.85;

  return {
    x: random(0, width),
    y: random(0, height),
    vx: random(-0.22, 0.22) * motionFactor,
    vy: random(-0.18, 0.18) * motionFactor,
    size: random(0.45, 1.05),
    alpha: random(0.45, 1),
    pulse: random(0.85, 1.2),
    pulseSpeed: random(0.25, 0.65),
    pulseOffset: random(0, Math.PI * 2),
  };
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const pointer = { x: 0, y: 0, active: false };
    const maxConnectionDistance = 140;
    const maxRepulsionDistance = 175;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrameId = 0;
    let lastTime = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const totalParticles = Math.max(180, Math.min(240, Math.floor((width * height) / 2200)));
      particles = Array.from({ length: totalParticles }, () => createParticle(width, height, reduceMotion));
    };

    const draw = (time: number) => {
      const delta = lastTime ? Math.min(2.5, (time - lastTime) / 16.67) : 1;
      lastTime = time;

      context.clearRect(0, 0, width, height);

      const speedScale = reduceMotion ? 0.35 : 1;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const orbitX = Math.sin((time / 1650) + particle.pulseOffset + index * 0.08) * (reduceMotion ? 0.05 : 1.08);
        const orbitY = Math.cos((time / 2050) + particle.pulseOffset + index * 0.06) * (reduceMotion ? 0.04 : 0.82);

        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy) || 1;

          if (distance < maxRepulsionDistance) {
            const force = (maxRepulsionDistance - distance) / maxRepulsionDistance;
            particle.vx += (dx / distance) * force * 0.016 * speedScale;
            particle.vy += (dy / distance) * force * 0.016 * speedScale;
          }
        }

        particle.x += particle.vx * delta * speedScale + orbitX * delta;
        particle.y += particle.vy * delta * speedScale + orbitY * delta;
        particle.vx *= 0.992;
        particle.vy *= 0.992;

        if (particle.x <= 0 || particle.x >= width) {
          particle.vx *= -1;
        }

        if (particle.y <= 0 || particle.y >= height) {
          particle.vy *= -1;
        }

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      }

      for (let index = 0; index < particles.length; index += 1) {
        for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
          const first = particles[index];
          const second = particles[otherIndex];
          const distance = Math.hypot(first.x - second.x, first.y - second.y);

          if (distance > maxConnectionDistance) {
            continue;
          }

          const alpha = (1 - distance / maxConnectionDistance) * 0.32;

          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.strokeStyle = `rgba(126, 168, 255, ${alpha})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }

      for (const particle of particles) {
        const pulse = 1 + Math.sin((time / 1000) * particle.pulseSpeed + particle.pulseOffset) * 0.22;

        context.beginPath();
        context.fillStyle = `rgba(79, 140, 255, ${particle.alpha * 0.12})`;
        context.arc(particle.x, particle.y, particle.size * 3.8 * pulse, 0, Math.PI * 2);
        context.fill();

        context.beginPath();
        context.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
        context.fill();
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseleave", handlePointerLeave);

    animationFrameId = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full opacity-100" />;
}

export function Hero({
  name = "BENKHAIR NAJIR",
  tagline = "Computer Engineer & Web Developer",
  onExplore,
  isTransitioning = false,
}: HeroProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const nameRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = nameRef.current;

    if (!element) {
      return;
    }

    if (reduceMotion) {
      element.textContent = name;
      return;
    }

    element.textContent = "";

    const typed = new Typed(element, {
      strings: [name],
      typeSpeed: 110,
      startDelay: 320,
      backSpeed: 0,
      backDelay: 1800,
      loop: false,
      showCursor: true,
      cursorChar: "|",
      smartBackspace: false,
      contentType: "text",
    });

    return () => {
      typed.destroy();
    };
  }, [name, reduceMotion]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.06, filter: "blur(18px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      >
        <ParticleBackground />
      </motion.div>

      <motion.div
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(43,69,140,0.58),rgba(10,16,34,0.98)_50%,rgba(5,8,16,1)_100%)]"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(4,8,16,0.06)_55%,rgba(4,8,16,0.32)_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.15, ease: "easeOut", delay: 0.05 }}
      />
      <motion.div
        className="absolute left-1/2 top-10 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#456fd8]/20 blur-3xl"
        initial={{ opacity: 0, scale: 0.85, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: [0, -16, 0] }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], y: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
      />

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center lg:px-10"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h1
          className="mt-8 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          <span className="block text-xs sm:text-sm font-medium uppercase tracking-[0.4em] sm:tracking-[0.45em] text-muted">
            Welcome, I am
          </span>
          <span className="mt-4 inline-flex min-h-[1.1em] items-baseline justify-center">
            <span
              ref={nameRef}
              className="inline-block whitespace-nowrap bg-gradient-to-r from-white via-[#7ea8ff] to-accent bg-clip-text text-transparent"
              aria-label={name}
            />
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl md:text-2xl font-medium text-foreground/90"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
        >
          {tagline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
        >
          <button
            type="button"
            onClick={onExplore}
            disabled={isTransitioning}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-accent/25 transition duration-300 hover:-translate-y-1 hover:bg-[#6b9cff] disabled:cursor-wait disabled:opacity-80"
          >
            Hire me!
            <ArrowRight className="h-4 w-4" />
          </button>

        </motion.div>
      </motion.div>
    </section>
  );
}
