"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
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
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);
  const imageZoomTweenRef = useRef<gsap.core.Tween | null>(null);
  const interactionTimeoutRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const interactionPausedRef = useRef(false);
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
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(indicatorRef.current, { scaleX: 0, transformOrigin: "left center" });
    }, rootRef);

    return () => {
      timelineRef.current?.kill();
      detailsTweenRef.current?.kill();
      progressTweenRef.current?.kill();
      imageZoomTweenRef.current?.kill();
      if (interactionTimeoutRef.current !== null) {
        window.clearTimeout(interactionTimeoutRef.current);
      }
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
      { autoAlpha: 1, y: 0, duration: 0.55, delay: 0.95, stagger: 0.07, ease: "power3.out" },
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
    progressTweenRef.current?.kill();
    imageZoomTweenRef.current?.kill();

    if (reducedMotion) {
      gsap.set(backgroundRefs.current, { zIndex: 0 });
      gsap.set(nextBackground, { autoAlpha: 0, scale: 1, zIndex: 1, clipPath: "inset(0 0 0 0)" });
      gsap.set(progressRef.current, { scaleX: 0 });

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
        .to(indicatorRef.current, { scaleX: 0, duration: 0.2, ease: "none" }, 0);
      return;
    }

    gsap.set(backgroundRefs.current, { zIndex: 0 });
    gsap.set(progressRef.current, { scaleX: 0 });
    gsap.set(nextBackground, {
      autoAlpha: 1,
      zIndex: 1,
      clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
      scale: 1.04,
    });

    const timeline = gsap.timeline({
      onStart: () => {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      },
      onComplete: () => {
        gsap.set(currentBackground, { autoAlpha: 0, zIndex: 0, clipPath: "inset(0 0 0 0)" });
        gsap.set(nextBackground, { zIndex: 0, clipPath: "inset(0 0 0 0)" });
        gsap.set(detailsRef.current, { autoAlpha: 0, y: -12 });
        detailsTweenRef.current = gsap.to(detailsRef.current, {
          autoAlpha: 1,
          y: 0,
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
      .to(detailsRef.current, { autoAlpha: 0, y: 14, duration: 0.25, ease: "power1.in" }, 0)
      .to(indicatorRef.current, { scaleX: 0, duration: 0.7, ease: "power2.inOut" }, 0);
  }, []);

  const moveSlide = useCallback(
    (direction: number) => {
      const nextIndex = (activeIndexRef.current + direction + slides.length) % slides.length;
      goToSlide(nextIndex);
    },
    [goToSlide],
  );

  useEffect(() => {
    if (isAutoplayPaused || document.hidden) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(progressRef.current, { scaleX: 0 });
      const timer = window.setTimeout(() => moveSlide(1), 3000);
      return () => window.clearTimeout(timer);
    }

    const activeBackground = backgroundRefs.current[activeIndex];
    gsap.set(progressRef.current, { scaleX: 0 });
    progressTweenRef.current = gsap.to(progressRef.current, {
      scaleX: 1,
      duration: 3,
      ease: "none",
      onComplete: () => {
        if (!document.hidden) moveSlide(1);
      },
    });
    imageZoomTweenRef.current = gsap.to(activeBackground, {
      scale: 1.075,
      duration: 3,
      delay: isAnimatingRef.current ? 0.95 : 0,
      ease: "none",
    });

    if (document.hidden || isHoveredRef.current || interactionPausedRef.current) {
      progressTweenRef.current.pause();
      imageZoomTweenRef.current.pause();
    }

    return () => {
      progressTweenRef.current?.kill();
      imageZoomTweenRef.current?.kill();
    };
  }, [activeIndex, isAutoplayPaused, moveSlide]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const shouldPause =
        document.hidden || isHoveredRef.current || interactionPausedRef.current;
      setIsAutoplayPaused(shouldPause);
      if (shouldPause) {
        progressTweenRef.current?.pause();
        imageZoomTweenRef.current?.pause();
      } else {
        progressTweenRef.current?.play();
        imageZoomTweenRef.current?.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const syncAutoplayPause = useCallback(() => {
    const shouldPause =
      document.hidden || isHoveredRef.current || interactionPausedRef.current;
    setIsAutoplayPaused(shouldPause);
    if (shouldPause) {
      progressTweenRef.current?.pause();
      imageZoomTweenRef.current?.pause();
    } else {
      progressTweenRef.current?.play();
      imageZoomTweenRef.current?.play();
    }
  }, []);

  const pauseForInteraction = useCallback(() => {
    interactionPausedRef.current = true;
    if (interactionTimeoutRef.current !== null) {
      window.clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = window.setTimeout(() => {
      interactionPausedRef.current = false;
      interactionTimeoutRef.current = null;
      syncAutoplayPause();
    }, 6000);
    syncAutoplayPause();
  }, [syncAutoplayPause]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    pauseForInteraction();
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;

    const distance = endX - startX;
    if (Math.abs(distance) > 48) {
      moveSlide(distance < 0 ? 1 : -1);
    }
  };

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
      data-autoplay-paused={isAutoplayPaused}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        syncAutoplayPause();
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        syncAutoplayPause();
      }}
      onPointerDownCapture={pauseForInteraction}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
              <motion.button
                key={item.id}
                ref={(node) => {
                  previewRefs.current[index] = node;
                }}
                type="button"
                className="zeno-preview-card"
                style={{ backgroundImage: `url("${item.image}")` }}
                onClick={() => {
                  pauseForInteraction();
                  goToSlide(slideIndex);
                }}
                aria-label={`Show ${item.categoryLabel}: ${item.alt}`}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.025 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              >
                {previewContent}
              </motion.button>
            );
          })}
        </div>
      </div>

      <Link href="/categories" className="zeno-side-label">
        EXPLORE CATEGORIES
      </Link>

      <div className="zeno-pagination">
        <motion.button
          type="button"
          className="zeno-arrow"
          aria-label="Previous slide"
          onClick={() => {
            pauseForInteraction();
            moveSlide(-1);
          }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
        <motion.button
          type="button"
          className="zeno-arrow"
          aria-label="Next slide"
          onClick={() => {
            pauseForInteraction();
            moveSlide(1);
          }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
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




// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ArrowRight,
//   ChevronLeft,
//   ChevronRight,
//   ShieldCheck,
//   Truck,
//   ThermometerSnowflake,
//   Award,
// } from "lucide-react";

// const HERO_SLIDES = [
//   {
//     id: 1,
//     badge: "7 Specialized Storefronts • One Unified Cart",
//     titlePrefix: "From Ethical Farms to",
//     titleHighlight: "Pure Daily Living.",
//     description:
//       "Shop certified livestock, farm-fresh eggs, cold-chain meats, ready-to-cook delicacies, clinical nutrition, botanical skincare, and pet essentials—delivered with batch-level traceability.",
//     primaryCta: { label: "Explore Catalogue", href: "/products" },
//     secondaryCta: { label: "Bulk & Farm Enquiries", href: "/wholesale" },
//   },
//   {
//     id: 2,
//     badge: "0–4°C Cold-Chain • Farm-to-Kitchen Freshness",
//     titlePrefix: "Hygienic Cuts &",
//     titleHighlight: "Ready-to-Cook Feasts.",
//     description:
//       "Antibiotic-free fresh chicken, farm brown eggs, and chef-crafted momos, seekh kebabs, and nuggets sealed immediately after chilling for peak freshness.",
//     primaryCta: { label: "Shop Fresh Meat & Eggs", href: "/category/raw-meat" },
//     secondaryCta: { label: "View Ready-to-Cook", href: "/category/ready-to-cook" },
//   },
//   {
//     id: 3,
//     badge: "Vet Certified Livestock & Hatching Eggs",
//     titlePrefix: "Trusted Poultry &",
//     titleHighlight: "Livestock Supply.",
//     description:
//       "Vaccinated day-old chicks, fertile Kadaknath & layer hatching eggs, and certified farm rabbits with complete batch and health documentation.",
//     primaryCta: { label: "Browse Livestock", href: "/category/farming-livestock" },
//     secondaryCta: { label: "Wholesale Orders", href: "/wholesale" },
//   },
// ];

// export default function HomeHero() {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
//     }, 6000);
//     return () => clearInterval(timer);
//   }, []);

//   const nextSlide = () =>
//     setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
//   const prevSlide = () =>
//     setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

//   const slide = HERO_SLIDES[currentSlide];

//   return (
//     <section className="relative overflow-hidden bg-[#F7F5EF]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-8">
//         <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#123C32] text-[#F7F5EF] p-6 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
//           {/* Ambient Animated Glow Orbs */}
//           <motion.div
//             animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.32, 0.2] }}
//             transition={{ duration: 8, repeat: Infinity }}
//             className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D9A65A] blur-3xl pointer-events-none"
//           />
//           <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

//           <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
//             {/* Left Animated Slider Content */}
//             <div className="lg:col-span-7">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={slide.id}
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//                   className="space-y-6"
//                 >
//                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7F5EF]/10 border border-[#D9A65A]/40 text-[#D9A65A] text-xs sm:text-sm font-semibold">
//                     <span>{slide.badge}</span>
//                   </div>

//                   <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
//                     {slide.titlePrefix}{" "}
//                     <span className="text-gradient-gold">
//                       {slide.titleHighlight}
//                     </span>
//                   </h1>

//                   <p className="text-base sm:text-lg text-[#F7F5EF]/80 max-w-2xl leading-relaxed">
//                     {slide.description}
//                   </p>

//                   <div className="flex flex-wrap items-center gap-4 pt-2">
//                     <Link
//                       href={slide.primaryCta.href}
//                       className="inline-flex items-center gap-2 bg-[#D9A65A] text-[#202824] font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl hover:bg-[#e5b56d] transition-all shadow-lg hover:shadow-[#D9A65A]/30"
//                     >
//                       {slide.primaryCta.label} <ArrowRight className="w-5 h-5" />
//                     </Link>
//                     <Link
//                       href={slide.secondaryCta.href}
//                       className="inline-flex items-center gap-2 bg-[#F7F5EF]/10 hover:bg-[#F7F5EF]/20 text-[#F7F5EF] font-semibold px-6 py-3.5 sm:py-4 rounded-2xl border border-[#F7F5EF]/20 transition-all"
//                     >
//                       {slide.secondaryCta.label}
//                     </Link>
//                   </div>
//                 </motion.div>
//               </AnimatePresence>

//               {/* Slider Dots & Arrow Controls */}
//               <div className="flex items-center justify-between sm:justify-start gap-6 mt-8 pt-6 border-t border-[#F7F5EF]/10">
//                 <div className="flex items-center gap-2">
//                   {HERO_SLIDES.map((s, idx) => (
//                     <button
//                       key={s.id}
//                       onClick={() => setCurrentSlide(idx)}
//                       aria-label={`Slide ${idx + 1}`}
//                       className={`h-2.5 rounded-full transition-all duration-300 ${
//                         currentSlide === idx
//                           ? "w-8 bg-[#D9A65A]"
//                           : "w-2.5 bg-[#F7F5EF]/30 hover:bg-[#F7F5EF]/60"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={prevSlide}
//                     aria-label="Previous slide"
//                     className="w-9 h-9 rounded-full bg-[#F7F5EF]/10 hover:bg-[#D9A65A] hover:text-[#202824] flex items-center justify-center transition-colors"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={nextSlide}
//                     aria-label="Next slide"
//                     className="w-9 h-9 rounded-full bg-[#F7F5EF]/10 hover:bg-[#D9A65A] hover:text-[#202824] flex items-center justify-center transition-colors"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Right Floating Trust & Cold-Chain Bento */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.94 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.7, delay: 0.2 }}
//               className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4"
//             >
//               {[
//                 {
//                   icon: ThermometerSnowflake,
//                   title: "Cold-Chain",
//                   desc: "0–4°C Temp Tracked",
//                 },
//                 {
//                   icon: ShieldCheck,
//                   title: "Batch Verified",
//                   desc: "Expiry & Health Logs",
//                 },
//                 {
//                   icon: Truck,
//                   title: "Express Dispatch",
//                   desc: "Slot-Based Delivery",
//                 },
//                 {
//                   icon: Award,
//                   title: "100% Traceable",
//                   desc: "Direct Farm & Lab",
//                 },
//               ].map((item, i) => (
//                 <motion.div
//                   key={item.title}
//                   whileHover={{ y: -4 }}
//                   transition={{ delay: i * 0.05 }}
//                   className="p-4 sm:p-5 rounded-2xl bg-[#F7F5EF]/10 backdrop-blur-md border border-[#F7F5EF]/15 space-y-2"
//                 >
//                   <div className="w-10 h-10 rounded-xl bg-[#D9A65A]/20 text-[#D9A65A] flex items-center justify-center">
//                     <item.icon className="w-5 h-5" />
//                   </div>
//                   <h3 className="font-bold text-sm sm:text-base text-white">
//                     {item.title}
//                   </h3>
//                   <p className="text-xs text-[#F7F5EF]/70">{item.desc}</p>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }