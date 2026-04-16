import { useEffect, useRef } from "react";
import type { JSX } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";

// --- Theme ---
const THEME = {
  text: "#0a0108",
  background: "#f5f2f5",
  primary: "#470938",
  secondary: "#1a3e59",
  accent: "#5c94bd",
} as const;

// --- Floating Animated Elements ---

function FloatingElements(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }>
  >([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const particles: {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        opacity: number;
        color: string;
      }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: [THEME.primary, THEME.secondary, THEME.accent][
          Math.floor(Math.random() * 3)
        ],
      });
    }
    particlesRef.current = particles;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = THEME.primary;
      ctx.lineWidth = 0.8;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

// --- Floating Text Elements ---

function FloatingText(): JSX.Element {
  const floatingWords = ["sprint", "ship", "build", "collaborate", "deliver"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {floatingWords.map((word, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            fontSize: "clamp(1.2rem, 3vw, 2.5rem)",
            fontWeight: 600,
            color: [THEME.primary, THEME.secondary, THEME.accent][idx % 3],
            opacity: 0.08,
            animation: `float-text ${15 + idx * 2}s infinite linear`,
            left: `${(idx * 20) % 100}%`,
            top: `${(idx * 17) % 100}%`,
            whiteSpace: "nowrap",
          }}
        >
          {word}
        </div>
      ))}
      <style>{`
        @keyframes float-text {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(30px) translateY(-30px); }
          100% { transform: translateX(0) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// --- Main Landing Component ---

export default function Landing(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: THEME.background,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Animated particle background */}
      <FloatingElements />

      {/* Floating text elements */}
      <FloatingText />

      {/* Overlay Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          textAlign: "center",
          padding: "2rem",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(178,80,104,0.10)",
            border: `0.5px solid rgba(178,80,104,0.30)`,
            borderRadius: 100,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 500,
            color: THEME.accent,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: THEME.accent,
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          Now in beta
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.8rem, 7vw, 5rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: THEME.accent,
            margin: 0,
            animation: "pulse-heading 3s ease-in-out infinite",
          }}
        >
          Sprint{" "}
          <em style={{ fontStyle: "italic", color: THEME.accent }}>
            Planner
          </em>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            marginTop: "1rem",
            fontSize: "1.05rem",
            fontWeight: 300,
            color: THEME.secondary,
            maxWidth: 380,
            lineHeight: 1.6,
          }}
        >
          Simple. Fast. Built for your team — so you can ship without the chaos.
        </p>

        {/* CTA Button */}
        <div style={{ display: "flex", gap: 12, marginTop: "2.2rem" }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: THEME.accent,
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              padding: "11px 24px",
              fontFamily: "inherit",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            Get started free
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse-heading {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
