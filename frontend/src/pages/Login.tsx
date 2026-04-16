/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import type { JSX } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService"; // ✅ adjust path if needed

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

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

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    };

    const particles: Particle[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        color: [THEME.primary, THEME.secondary, THEME.accent][
          Math.floor(Math.random() * 3)
        ],
      });
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🔹 DRAW PARTICLES
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.beginPath();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 🔹 CONNECT LINES
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = THEME.primary;
      ctx.lineWidth = 0.8;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1; // ✅ RESET IMPORTANT

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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

// --- Login Page Component ---

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await login({
      username: username,
      password: password,
    });

    // 🔥 Extract token
    const token = res.data.token;

    // ✅ Store token
    localStorage.setItem("token", token);
    console.log("Login successful, token stored:", token);
    const returnedUsername = res.data.username || username;
    localStorage.setItem("username", returnedUsername);

    navigate("/dashboard");
  } catch (err: any) {
    console.error(err);
    alert("Invalid login");
  }
};

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

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 20,
          background: "rgba(255, 255, 255, 0.8)",
          border: `1px solid rgba(71, 9, 56, 0.15)`,
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: 14,
          fontWeight: 500,
          color: THEME.primary,
          cursor: "pointer",
          transition: "all 0.2s",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.background =
            "rgba(255, 255, 255, 0.95)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.background =
            "rgba(255, 255, 255, 0.8)";
        }}
      >
        ← Back
      </button>

      {/* Login Container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            borderRadius: 20,
            border: `1px solid rgba(71, 9, 56, 0.1)`,
            padding: "48px 40px",
            width: "100%",
            maxWidth: 420,
            animation: "slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "2rem",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: THEME.accent,
                margin: "0 0 12px 0",
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: THEME.secondary,
                margin: 0,
              }}
            >
              Let's ship something great together
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ marginBottom: 24 }}>
 
            {/* Username */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: THEME.primary,
                  marginBottom: 8,
                }}
              >
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: `1px solid rgba(71, 9, 56, 0.15)`,
                  borderRadius: 8,
                  fontSize: "0.95rem",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = THEME.accent;
                  (e.target as HTMLInputElement).style.boxShadow =
                    `0 0 0 3px rgba(92, 148, 189, 0.1)`;
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    "rgba(71, 9, 56, 0.15)";
                  (e.target as HTMLInputElement).style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  color: THEME.primary,
                  marginBottom: 8,
                }}
              >
                Password
              </label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    paddingRight: 40,
                    border: `1px solid rgba(71, 9, 56, 0.15)`,
                    borderRadius: 8,
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = THEME.accent;
                    (e.target as HTMLInputElement).style.boxShadow =
                      `0 0 0 3px rgba(92, 148, 189, 0.1)`;
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor =
                      "rgba(71, 9, 56, 0.15)";
                    (e.target as HTMLInputElement).style.boxShadow = "none";
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    color: THEME.secondary,
                  }}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                fontSize: "0.9rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  color: THEME.secondary,
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    width: 16,
                    height: 16,
                    cursor: "pointer",
                    accentColor: THEME.accent,
                  }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => console.log("Forgot password")}
                style={{
                  background: "none",
                  border: "none",
                  color: THEME.accent,
                  cursor: "pointer",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.textDecoration =
                    "underline";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.textDecoration = "none";
                }}
              >
                Forgot?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: `linear-gradient(135deg, ${THEME.accent}, ${THEME.secondary})`,
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1.02)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  `0 8px 20px rgba(92, 148, 189, 0.3)`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1)";
                (e.target as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              Sign in
            </button>
          </form>


        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}