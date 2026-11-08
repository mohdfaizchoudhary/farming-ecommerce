"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const slides = [
{
  id: "rabbit",
  eyebrow: "For rabbit breeders & farms",
  title: "A better way to",
  title2: "grow your rabbit farming business.",
  description: "Explore rabbit breeds, compare seller details and connect with trusted breeders to find the right rabbits, supplies and opportunities for your farm.",
  href: "/category/rabbit-farming",
  ctaLabel: "Explore rabbit farming",
  categoryLabel: "Rabbit farming",
  image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1800&q=90",
  alt: "Healthy rabbits in a farm environment",
},
  {
    id: "layer-birds",
    eyebrow: "For poultry keepers",
    title: "Find the birds",
    title2: "that fit your farm.",
    description: "Browse layer bird and poultry listings, then connect with suppliers to confirm the details.",
    href: "/category/layer-birds",
    ctaLabel: "Explore layer birds",
    categoryLabel: "Layer birds",
    image: "https://5.imimg.com/data5/EW/NP/ZR/SELLER-94020283/28377520-536011313446523-9149966712049674354-n-jpg-500x500.jpg",
    alt: "Healthy chickens in a green farm setting",
  },
  {
    id: "chick-sales",
    eyebrow: "For the next generation",
    title: "Give your chicks",
    title2: "a head start.",
    description: "Discover chick listings and review batch, breed and availability information with sellers.",
    href: "/category/chick-sale",
    ctaLabel: "Explore chick sales",
    categoryLabel: "Chick sales",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT30Vb3-Agd4Lgg3xULf7Xj8ZBYZ7gE4e5PvOCqy9Up4eA20L9q8xTlfmNS&s=10",
    alt: "Young chicks gathered on a poultry farm",
  },
  {
    id: "fresh-chicken",
    eyebrow: "For poultry buyers",
    title: "Fresh poultry for",
    title2: "your kitchen.",
    description: "Browse poultry listings and connect with sellers to check product details and availability.",
    href: "/category/chicken-sale",
    ctaLabel: "Explore chicken listings",
    categoryLabel: "Fresh chicken",
    image: "https://bisonmart.in/wp-content/uploads/2025/09/karungozhi.webp",
    alt: "Fresh chicken prepared for a poultry listing",
  },
  {
    id: "fertile-eggs",
    eyebrow: "For your next hatch",
    title: "Choose the right",
    title2: "hatching egg batch.",
    description: "Compare egg listings and ask suppliers about breed, collection date and batch availability.",
    href: "/category/hatching-eggs",
    ctaLabel: "Browse egg batches",
    categoryLabel: "Egg batches",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYRyiw-1eJX8eBVlvML5ZnWyr2YAcRZwarq7zcdZNAX1TdlWMstfA68jDe&s=10",
    alt: "A batch of eggs for hatching",
  },
{
  id: "rabbit-and-chick-supply",
  eyebrow: "For growing farms & breeders",
  title: "Find a trusted",
  title2: "rabbit & chick supplier.",
  description: "Explore rabbit and chick supply listings, compare seller details and connect directly with trusted suppliers to meet your farm's needs.",
  href: "/category/rabbit-and-chick-supply",
  ctaLabel: "Explore farm supplies",
  categoryLabel: "Rabbits & Chicks",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFvTU-aa1X4TgK6ftR6hLSD-5yE4jeJsStCDeDLauzsvWBbQEC5zIbNRRz&s=10",
  alt: "Healthy poultry chicks and farm animals available from trusted suppliers",
},
];

export default function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const backgroundRefs = useRef<Array<HTMLDivElement | null>>([]);
  const previewRefs = useRef<Array<HTMLElement | null>>([]);
  const copyRefs = useRef<Array<HTMLElement | null>>([]);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const detailsTweenRef = useRef<gsap.core.Tween | null>(null);
  const hasMountedRef = useRef(false);
  const copyHasMountedRef = useRef(false);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.set(backgroundRefs.current, {
        autoAlpha: 0,
        clipPath: "inset(0 0 0 0)",
        scale: 1.04,
      });
      gsap.set(backgroundRefs.current[0], { autoAlpha: 1, scale: 1 });
      gsap.set(progressRef.current, { scaleX: 1 / slides.length, transformOrigin: "left center" });
      gsap.set(indicatorRef.current, { scaleX: 1 / slides.length, transformOrigin: "left center" });
    }, rootRef);

    return () => {
      timelineRef.current?.kill();
      detailsTweenRef.current?.kill();
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const cards = previewRefs.current.filter((card): card is HTMLElement => card !== null);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(cards, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power2.out" },
    );
  }, [activeIndex]);

  useLayoutEffect(() => {
    if (!copyHasMountedRef.current) {
      copyHasMountedRef.current = true;
      return;
    }

    const copy = copyRefs.current.filter((element): element is HTMLElement => element !== null);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(copy, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      copy,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power3.out" },
    );
  }, [activeIndex]);

  const goToSlide = useCallback((nextIndex: number) => {
    if (isAnimatingRef.current || nextIndex === activeIndexRef.current) return;

    const currentIndex = activeIndexRef.current;
    const direction = nextIndex > currentIndex ? 1 : -1;
    const currentBackground = backgroundRefs.current[currentIndex];
    const nextBackground = backgroundRefs.current[nextIndex];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!currentBackground || !nextBackground || !detailsRef.current) return;

    isAnimatingRef.current = true;
    timelineRef.current?.kill();
    detailsTweenRef.current?.kill();

    if (reducedMotion) {
      gsap.set(backgroundRefs.current, { zIndex: 0 });
      gsap.set(nextBackground, { autoAlpha: 0, scale: 1, zIndex: 1, clipPath: "inset(0 0 0 0)" });

      timelineRef.current = gsap.timeline({
        onComplete: () => {
          gsap.set(currentBackground, { autoAlpha: 0, zIndex: 0 });
          gsap.set(nextBackground, { zIndex: 0 });
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
          detailsTweenRef.current = gsap.to(detailsRef.current, {
            autoAlpha: 1,
            duration: 0.15,
            ease: "none",
            onComplete: () => {
              isAnimatingRef.current = false;
            },
          });
        },
      })
        .to(currentBackground, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0)
        .to(nextBackground, { autoAlpha: 1, duration: 0.2, ease: "none" }, 0)
        .to(detailsRef.current, { autoAlpha: 0.35, duration: 0.1, ease: "none" }, 0)
        .to(progressRef.current, { scaleX: (nextIndex + 1) / slides.length, duration: 0.2, ease: "none" }, 0)
        .to(indicatorRef.current, { scaleX: (nextIndex + 1) / slides.length, duration: 0.2, ease: "none" }, 0);
      return;
    }

    gsap.set(backgroundRefs.current, { zIndex: 0 });
    gsap.set(nextBackground, {
      autoAlpha: 1,
      zIndex: 1,
      clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
      scale: 1.04,
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(currentBackground, { autoAlpha: 0, zIndex: 0, clipPath: "inset(0 0 0 0)" });
        gsap.set(nextBackground, { zIndex: 0, clipPath: "inset(0 0 0 0)" });
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        gsap.set(detailsRef.current, { autoAlpha: 0 });
        detailsTweenRef.current = gsap.to(detailsRef.current, {
          autoAlpha: 1,
          duration: 0.55,
          ease: "power2.out",
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        });
      },
    });
    timelineRef.current = timeline;

    timeline
      .to(
        currentBackground,
        {
          clipPath: direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
          duration: 0.85,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        nextBackground,
        {
          clipPath: "inset(0 0 0 0)",
          scale: 1,
          duration: 0.95,
          ease: "power3.inOut",
        },
        0,
      )
      .to(detailsRef.current, { autoAlpha: 0, duration: 0.25, ease: "power1.in" }, 0)
      .to(
        progressRef.current,
        {
          scaleX: (nextIndex + 1) / slides.length,
          duration: 0.7,
          ease: "power2.inOut",
        },
        0,
      )
      .to(
        indicatorRef.current,
        {
          scaleX: (nextIndex + 1) / slides.length,
          duration: 0.7,
          ease: "power2.inOut",
        },
        0,
      );
  }, []);

  const moveSlide = useCallback(
    (direction: number) => {
      const nextIndex = (activeIndexRef.current + direction + slides.length) % slides.length;
      goToSlide(nextIndex);
    },
    [goToSlide],
  );

  useEffect(() => {
    const timer = window.setInterval(() => moveSlide(1), 3000);
    return () => window.clearInterval(timer);
  }, [moveSlide]);

  const slide = slides[activeIndex];
  const previewSlides = Array.from(
    { length: Math.min(4, slides.length) },
    (_, index) => slides[(activeIndex + index) % slides.length],
  );

  return (
    <section
      ref={rootRef}
      className="zeno-gsap-slider"
      aria-label="Featured poultry categories"
    >
      <div ref={indicatorRef} className="zeno-indicator" aria-hidden="true" />
      <div className="zeno-background" aria-hidden="true">
        {slides.map((item, index) => (
          <div
            key={item.id}
            ref={(node) => {
              backgroundRefs.current[index] = node;
            }}
            className="zeno-background-slide"
            style={{ backgroundImage: `url("${item.image}")` }}
          />
        ))}
      </div>
      <div className="zeno-overlay" aria-hidden="true" />

      <div ref={detailsRef} className="zeno-details">
        <p ref={(node) => { copyRefs.current[0] = node; }} className="zeno-place-text" aria-live="polite">
          {slide.eyebrow}
        </p>
        <h1 className="zeno-headline">
          <span ref={(node) => { copyRefs.current[1] = node; }}>{slide.title}</span>
          <span ref={(node) => { copyRefs.current[2] = node; }}>{slide.title2}</span>
        </h1>
        <p ref={(node) => { copyRefs.current[3] = node; }} className="zeno-desc">
          {slide.description}
        </p>
        <div ref={(node) => { copyRefs.current[4] = node; }} className="zeno-actions">
          <Link className="zeno-cta" href={slide.href}>
            {slide.ctaLabel}
            <span className="zeno-cta-mark" aria-hidden="true">↗</span>
          </Link>
          <Link className="zeno-secondary-cta" href="/products">
            View all listings
          </Link>
        </div>
      </div>

      <div className="zeno-cards-window">
        <div className="zeno-cards-track">
          {previewSlides.map((item, index) => {
            const slideIndex = slides.findIndex((entry) => entry.id === item.id);
            const previewContent = (
              <span className="zeno-preview-copy">
                <span className="zeno-preview-eyebrow">{item.categoryLabel}</span>
                <span className="zeno-preview-title">{item.title2}</span>
              </span>
            );

            if (item.id === slide.id) {
              return (
                <div
                  key={item.id}
                  ref={(node) => {
                    previewRefs.current[index] = node;
                  }}
                  className="zeno-preview-card zeno-preview-card-static zeno-preview-card-active"
                  style={{ backgroundImage: `url("${item.image}")` }}
                  aria-hidden="true"
                >
                  {previewContent}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                ref={(node) => {
                  previewRefs.current[index] = node;
                }}
                type="button"
                className="zeno-preview-card"
                style={{ backgroundImage: `url("${item.image}")` }}
                onClick={() => goToSlide(slideIndex)}
                aria-label={`Show ${item.categoryLabel}: ${item.alt}`}
              >
                {previewContent}
              </button>
            );
          })}
        </div>
      </div>

      <Link href="/categories" className="zeno-side-label">
        EXPLORE CATEGORIES
      </Link>

      <div className="zeno-pagination">
        <button type="button" className="zeno-arrow" aria-label="Previous slide" onClick={() => moveSlide(-1)}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="zeno-arrow" aria-label="Next slide" onClick={() => moveSlide(1)}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="zeno-progress-container" aria-hidden="true">
          <div className="zeno-progress-background">
            <div ref={progressRef} className="zeno-progress-foreground" />
          </div>
        </div>
        <span className="zeno-slide-number" aria-label={`Slide ${activeIndex + 1} of ${slides.length}`}>
          {activeIndex + 1}
        </span>
      </div>
    </section>
  );
}
