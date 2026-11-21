
"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { topLevelCategories } from "@/lib/catalog";

const categoryImages: Record<string, string> = {
  "poultry-buy-sell":
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85",
  "hatching-eggs":
    "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=85",
  "layer-birds":
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=85",
  "buying-birds":
    "https://5.imimg.com/data5/EW/NP/ZR/SELLER-94020283/28377520-536011313446523-9149966712049674354-n-jpg-500x500.jpg",
  "chicken-sale":
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85",
  rabbit:
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=85",
  "farming-livestock":
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=85",
  "eggs-foods":
    "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=85",
  "ready-to-cook":
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85",
  "raw-meat":
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85",
  supplements:
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=85",
  "skincare-beauty":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
  "pet-products":
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85",
};

const farmCategories = topLevelCategories.map((category) => ({
  name: category.name,
  detail: category.description,
  href: `/category/${category.slug}`,
  image: categoryImages[category.slug],
}));

const CARD_WIDTH = 230;
const CARD_GAP = 22;
const STEP = CARD_WIDTH + CARD_GAP;

export default function ReelmarkHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const showCard = (index: number) => {
    activeCardRef.current = index;
    setActiveCard(index);
  };

  const closeCard = () => {
    activeCardRef.current = null;
    setActiveCard(null);
  };

  useEffect(() => {
    setPortalReady(true);

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeCard === null) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCard();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeCard]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let lastTime = 0;
    let paused = false;

    const loop = (time: number) => {
      if (!lastTime) lastTime = time;

      const delta = Math.min(time - lastTime, 40);
      lastTime = time;

      if (
        !paused &&
        activeCardRef.current === null &&
        !dragRef.current.active &&
        !reducedMotion
      ) {
        offsetRef.current += delta * 0.035;
      }

      const totalWidth = farmCategories.length * STEP;

      if (offsetRef.current >= totalWidth) {
        offsetRef.current -= totalWidth;
      }

      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    const handleVisibility = () => {
      paused = document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = true;
    dragRef.current.moved = false;
    dragRef.current.startX = event.clientX;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastTime = performance.now();
    dragRef.current.velocity = 0;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag.active) return;

    const now = performance.now();
    const deltaX = drag.moved
      ? event.clientX - drag.lastX
      : event.clientX - drag.startX;
    const deltaTime = Math.max(now - drag.lastTime, 1);

    if (!drag.moved && Math.abs(deltaX) <= 4) {
      drag.lastX = event.clientX;
      drag.lastTime = now;
      return;
    }

    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    offsetRef.current -= deltaX;
    drag.velocity = deltaX / deltaTime;

    drag.lastX = event.clientX;
    drag.lastTime = now;
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;

    if (!drag.active) return;

    drag.active = false;

    if (drag.moved) {
      const momentum = Math.max(-900, Math.min(900, drag.velocity * 180));
      offsetRef.current -= momentum;
    }

    drag.velocity = 0;
    window.setTimeout(() => {
      dragRef.current.moved = false;
    }, 0);
  };

  return (
    <section
      ref={sectionRef}
      className={`farm-reel-section${isVisible ? " is-visible" : ""}`}
    >
      <div className="farm-reel-glow farm-reel-glow-one" />
      <div className="farm-reel-glow farm-reel-glow-two" />

      <div className="farm-reel-container">
        <div className="farm-reel-heading">
          <span className="farm-reel-eyebrow">
            <span className="farm-reel-eyebrow-dot" />
            THE FARM MARKETPLACE
          </span>

          <h2>
            Everything Your Farm
            <br />
            <span>Needs, In One Place.</span>
          </h2>

          <p>
            Discover trusted products, livestock, equipment and services
            to make your farming journey smarter and easier.
          </p>
        </div>

        <div className="farm-reel-viewport">
          <div
            className="farm-reel-track"
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onLostPointerCapture={handlePointerUp}
          >
            {[...farmCategories, ...farmCategories].map((category, index) => (
              <button
                type="button"
                className="farm-reel-card"
                key={`${category.name}-${index}`}
                aria-haspopup="dialog"
                aria-label={`Open ${category.name} category details`}
                style={{
                  "--reveal-delay": `${(index % farmCategories.length) * 55}ms`,
                } as CSSProperties}
                onClick={(event) => {
                  if (dragRef.current.moved) return;
                  showCard(index % farmCategories.length);
                }}
              >
                <div className="farm-reel-card-image">
                  <img
                    src={category.image}
                    alt={category.name}
                    draggable={false}
                    loading={index < 5 ? "eager" : "lazy"}
                  />

                  <div className="farm-reel-card-overlay" />

                  <span className="farm-reel-card-number">
                    {String((index % farmCategories.length) + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className="farm-reel-card-arrow">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12h14M13 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="farm-reel-card-content">
                    <span className="farm-reel-card-label">
                      EXPLORE CATEGORY
                    </span>

                    <h3>{category.name}</h3>

                    <p>{category.detail}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="farm-reel-bottom">
          <div className="farm-reel-bottom-note">
            <span className="farm-reel-live-dot" />
            <span>Discover. Connect. Grow.</span>
          </div>

          <a href="/categories" className="farm-reel-cta">
            Explore All Categories
            <span className="farm-reel-cta-icon">↗</span>
          </a>

          <span className="farm-reel-drag-note">
            DRAG TO EXPLORE <span>← →</span>
          </span>
        </div>
      </div>

      {portalReady && activeCard !== null && createPortal(
        <div
          className="farm-reel-popup-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeCard();
          }}
        >
          <div
            className="farm-reel-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="farm-reel-popup-title"
          >
            <button
              type="button"
              className="farm-reel-popup-close"
              aria-label="Close category preview"
              onClick={closeCard}
            >
              ×
            </button>
            <img
              className="farm-reel-popup-image"
              src={farmCategories[activeCard].image}
              alt={farmCategories[activeCard].name}
            />
            <div className="farm-reel-popup-copy">
              <span className="farm-reel-card-label">FARM MARKETPLACE</span>
              <h3 id="farm-reel-popup-title">
                {farmCategories[activeCard].name}
              </h3>
              <p>{farmCategories[activeCard].detail}</p>
              <a href={farmCategories[activeCard].href}>
                Explore category <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
