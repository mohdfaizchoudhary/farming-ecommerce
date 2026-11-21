"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const REVEAL_DURATION = 2100;
const FARM_VIDEO =
  "https://videos.pexels.com/video-files/35256218/14936478_2560_1440_50fps.mp4";
const FARM_POSTER =
  "https://images.pexels.com/videos/35256218/pexels-photo-35256218.jpeg?auto=compress&w=1260&h=750&dpr=1";

type RevealDirection = "open" | "close";

declare global {
  interface Window {
    __recVideo?: (time: number) => number;
  }
}

const paperLines = [
  { d: "M-90 914C106 750 122 630 315 580S568 543 730 352 997 88 1220-71", width: 1.2, opacity: 0.62 },
  { d: "M-80 985C116 817 157 715 348 652S609 578 772 399 1053 136 1274-12", width: 2.1, opacity: 0.74 },
  { d: "M-95 844C104 702 179 603 373 570S625 492 801 324 1072 84 1308-85", width: 3.1, opacity: 0.58 },
  { d: "M-82 1050C119 875 222 757 416 701S677 615 847 448 1114 193 1350 28", width: 1.7, opacity: 0.8 },
  { d: "M-110 773C86 655 222 543 413 514S673 437 854 270 1122 25 1392-112", width: 2.7, opacity: 0.64 },
  { d: "M-96 1110C109 928 274 802 465 751S727 654 897 498 1168 240 1435 79", width: 3.9, opacity: 0.56 },
  { d: "M-75 726C119 612 260 492 451 459S708 381 882 216 1147-25 1434-166", width: 1.5, opacity: 0.82 },
  { d: "M-105 1008C94 840 295 698 488 650S751 553 922 389 1194 132 1474-22", width: 2.4, opacity: 0.67 },
  { d: "M-87 875C114 719 324 574 522 528S780 447 953 285 1225 30 1510-125", width: 1.9, opacity: 0.77 },
  { d: "M-116 1160C90 973 337 830 538 778S801 682 972 531 1240 279 1526 118", width: 3.5, opacity: 0.6 },
  { d: "M-88 795C112 656 352 501 553 454S812 365 985 207 1256-47 1542-196", width: 2.9, opacity: 0.7 },
  { d: "M-102 1062C99 889 379 730 578 680S838 586 1010 432 1283 174 1567 11", width: 1.3, opacity: 0.84 },
  { d: "M-91 933C109 780 400 620 601 574S860 484 1032 327 1303 70 1590-90", width: 3.3, opacity: 0.57 },
  { d: "M-115 1210C91 1014 420 856 620 806S879 720 1050 573 1325 318 1611 159", width: 2.2, opacity: 0.73 },
  { d: "M-84 848C118 702 438 537 638 491S897 399 1069 244 1340-14 1626-172", width: 1.8, opacity: 0.66 },
];

export function SmsFarmsteadRevealHero() {
  const heroRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLSpanElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationsRef = useRef<Animation[]>([]);
  const runIdRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showSoundWaves, setShowSoundWaves] = useState(true);

  const settleReveal = useCallback((open: boolean) => {
    const hero = heroRef.current;
    if (!hero) return;

    hero.classList.toggle("is-open", open);
    setIsOpen(open);
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];

    if (!open) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        if (video.readyState >= 1) video.currentTime = 0;
      }
    }
  }, []);

  const playReveal = useCallback(
    (direction: RevealDirection): Promise<void> => {
      const hero = heroRef.current;
      const wordmark = wordmarkRef.current;
      const pill = pillRef.current;
      if (!hero || !wordmark || !pill) return Promise.resolve();

      runIdRef.current += 1;
      const runId = runIdRef.current;
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];

      const mobile = window.matchMedia("(max-width: 720px)").matches;
      const fontSize = Number.parseFloat(window.getComputedStyle(wordmark).fontSize);
      const finalPillWidth = window.innerWidth - 40;
      const finalPillHeight = mobile ? finalPillWidth / 1.85 : fontSize * 1.81;
      const directionOptions = {
        duration: REVEAL_DURATION,
        fill: "both" as FillMode,
        direction: direction === "close" ? "reverse" as PlaybackDirection : "normal" as PlaybackDirection,
      };
      const animate = (element: Element | null, frames: Keyframe[]) => {
        if (!element) return;
        animationsRef.current.push(element.animate(frames, directionOptions));
      };

      if (mobile) {
        animate(pill, [
          { height: "1.5px", clipPath: "inset(0 50%)", offset: 0, easing: "cubic-bezier(.5,0,.3,1)" },
          { height: "1.5px", clipPath: "inset(0)", offset: 0.14, easing: "cubic-bezier(.5,0,.3,1)" },
          { height: `${finalPillHeight * 0.1}px`, clipPath: "inset(0)", offset: 0.3, easing: "cubic-bezier(.45,0,.3,1)" },
          { height: `${finalPillHeight * 0.55}px`, clipPath: "inset(0)", offset: 0.58, easing: "cubic-bezier(.4,0,.2,1)" },
          { height: `${finalPillHeight}px`, clipPath: "inset(0)", offset: 1 },
        ]);
      } else {
        animate(pill, [
          { width: `${fontSize * 0.012}px`, clipPath: "inset(50% 0)", offset: 0, easing: "cubic-bezier(.5,0,.3,1)" },
          { width: `${fontSize * 0.012}px`, clipPath: "inset(0)", offset: 0.14, easing: "cubic-bezier(.5,0,.3,1)" },
          { width: `${fontSize * 0.16}px`, clipPath: "inset(0)", offset: 0.3, easing: "cubic-bezier(.45,0,.3,1)" },
          { width: `${fontSize * 1.81}px`, clipPath: "inset(0)", offset: 0.58, easing: "cubic-bezier(.4,0,.2,1)" },
          { width: `${fontSize * 3.62}px`, clipPath: "inset(0)", offset: 1 },
        ]);
      }

      animate(wordmark, [
        { gap: mobile ? "0.03em" : "0.026em", offset: 0, easing: "cubic-bezier(.5,0,.3,1)" },
        { gap: mobile ? "0.03em" : "0.026em", offset: 0.14, easing: "cubic-bezier(.45,0,.3,1)" },
        { gap: mobile ? "0.05em" : "0.05em", offset: 0.58, easing: "cubic-bezier(.4,0,.2,1)" },
        { gap: mobile ? "0.1em" : "0.085em", offset: 1 },
      ]);
      animate(paperRef.current, [
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: 0.45 },
        { opacity: 1, offset: 0.78 },
        { opacity: 1, offset: 1 },
      ]);
      animate(hairlineRef.current, [
        { opacity: 1, offset: 0, easing: "cubic-bezier(.5,0,.3,1)" },
        { opacity: 1, offset: 0.14, easing: "cubic-bezier(.45,0,.3,1)" },
        { opacity: 0, offset: 0.3 },
        { opacity: 0, offset: 1 },
      ]);
      animate(linesRef.current, [
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: 0.45 },
        { opacity: 1, offset: 0.78 },
        { opacity: 1, offset: 1 },
      ]);
      animate(navRef.current, [
        { opacity: 0, transform: "translateY(-140%)", visibility: "hidden", offset: 0 },
        { opacity: 0, transform: "translateY(-140%)", visibility: "hidden", offset: 0.5, easing: "cubic-bezier(.2,.8,.2,1)" },
        { opacity: 1, transform: "translateY(0)", visibility: "visible", offset: 0.86 },
        { opacity: 1, transform: "translateY(0)", visibility: "visible", offset: 1 },
      ]);
      animate(footerRef.current, [
        { opacity: 0, transform: "translateY(160%)", visibility: "hidden", offset: 0 },
        { opacity: 0, transform: "translateY(160%)", visibility: "hidden", offset: 0.52 },
        { opacity: 1, transform: "translateY(0)", visibility: "visible", offset: 0.9 },
        { opacity: 1, transform: "translateY(0)", visibility: "visible", offset: 1 },
      ]);
      animate(ruleRef.current, [
        { transform: "scaleX(0)", offset: 0.4 },
        { transform: "scaleX(1)", offset: 0.95 },
        { transform: "scaleX(1)", offset: 1 },
      ]);
      animate(controlsRef.current, [
        { opacity: 0, visibility: "hidden", offset: 0 },
        { opacity: 0, visibility: "hidden", offset: 0.8 },
        { opacity: 1, visibility: "visible", offset: 0.9 },
        { opacity: 1, visibility: "visible", offset: 1 },
      ]);

      if (direction === "open") {
        const video = videoRef.current;
        if (video) {
          void video.play().catch((error: unknown) => {
            console.error("Could not start the SMS Farmstead hero video.", error);
          });
        }
      }

      const runningAnimations = [...animationsRef.current];
      return Promise.all(
        runningAnimations.map((animation) => animation.finished.catch(() => undefined)),
      ).then(() => {
        if (runIdRef.current === runId) settleReveal(direction === "open");
      });
    },
    [settleReveal],
  );

  const replayReveal = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settleReveal(true);
      videoRef.current?.pause();
      return;
    }
    void playReveal("close").then(() => playReveal("open"));
  }, [playReveal, settleReveal]);

  useEffect(() => {
    let cancelled = false;
    const timers = new Set<number>();
    const isRecording = new URLSearchParams(window.location.search).get("rec") === "1";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = async () => {
      await document.fonts.ready;
      if (cancelled) return;

      if (prefersReducedMotion) {
        settleReveal(true);
        videoRef.current?.pause();
        return;
      }

      const runCycle = () => {
        void playReveal("open");
        if (!isRecording) return;

        const collapseTimer = window.setTimeout(() => {
          timers.delete(collapseTimer);
          if (cancelled) return;
          void playReveal("close").then(() => {
            if (cancelled) return;
            const nextCycleTimer = window.setTimeout(() => {
              timers.delete(nextCycleTimer);
              runCycle();
            }, 2800);
            timers.add(nextCycleTimer);
          });
        }, 4900);
        timers.add(collapseTimer);
      };

      runCycle();
    };

    void start();
    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
      runIdRef.current += 1;
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
    };
  }, [playReveal, settleReveal]);

  useEffect(() => {
    const handleResize = () => {
      runIdRef.current += 1;
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
      settleReveal(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [settleReveal]);

  useEffect(() => {
    const recVideo = (time: number) => {
      const video = videoRef.current;
      const duration = video && Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : 5;
      const requestedTime = Number.isFinite(time) ? time : 0;
      const frameTime = ((requestedTime % duration) + duration) % duration + 1 / 120;
      if (video && video.readyState >= 1) {
        video.pause();
        video.currentTime = ((frameTime % duration) + duration) % duration;
      }
      return frameTime;
    };

    window.__recVideo = recVideo;
    return () => {
      if (window.__recVideo === recVideo) delete window.__recVideo;
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className={`sms-farmstead-hero${isOpen ? " is-open" : ""}`}
      aria-label="SMS Farmstead Ventures"
    >
      <div ref={paperRef} className="sms-reveal-paper" aria-hidden="true" />
      <svg
        ref={linesRef}
        className="sms-reveal-lines"
        viewBox="0 0 1440 960"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {paperLines.map((line) => (
          <path
            key={line.d}
            d={line.d}
            strokeWidth={line.width}
            opacity={line.opacity}
          />
        ))}
      </svg>

      <nav ref={navRef} className="sms-reveal-nav" aria-label="Farmstead navigation">
        <div className="sms-reveal-nav-links">
          <Link href="/">Home</Link>
          <Link href="/#about">About</Link>
          <Link href="/products">Products</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
        <div className="sms-reveal-nav-socials" aria-label="Social links">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </div>
      </nav>

      <h1 ref={wordmarkRef} className="sms-reveal-wordmark" aria-label="SMS Farmstead Ventures">
        <span>SMS</span>
        <span ref={pillRef} className="sms-reveal-pill" aria-hidden="true">
          <video
            ref={videoRef}
            className="sms-reveal-video"
            src={FARM_VIDEO}
            poster={FARM_POSTER}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
          <span ref={hairlineRef} className="sms-reveal-hairline" />
          <span ref={controlsRef} className="sms-reveal-controls">
            <svg className="sms-reveal-breeze" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 8h11.5a2.5 2.5 0 1 0-2.4-3.2M2 12h16a2.5 2.5 0 1 1-2.4 3.2M5 16h6.5" />
            </svg>
            <button
              type="button"
              className="sms-reveal-speaker"
              aria-label={showSoundWaves ? "Hide sound waves" : "Show sound waves"}
              aria-pressed={showSoundWaves}
              onClick={() => setShowSoundWaves((visible) => !visible)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 10v4h3l4 3V7l-4 3H4Z" />
                {showSoundWaves && <path className="sms-reveal-sound-waves" d="M15 9a4 4 0 0 1 0 6m2-8a7 7 0 0 1 0 10" />}
              </svg>
            </button>
          </span>
        </span>
        <span className="sms-reveal-brand-right">
          FARMSTEAD
          <span className="sms-reveal-brand-suffix">VENTURES</span>
        </span>
      </h1>

      <footer ref={footerRef} className="sms-reveal-footer">
        <p>
          Explore healthy Kadaknath chicks, carefully selected hatching eggs and premium
          poultry products. Discover the beauty of quality farming with SMS Farmstead
          Ventures.
        </p>
        <span ref={ruleRef} className="sms-reveal-rule" aria-hidden="true" />
        <button type="button" className="sms-reveal-replay" onClick={replayReveal}>
          Let&apos;s Grow
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 15 15 5M6 5h9v9" />
          </svg>
        </button>
      </footer>
    </section>
  );
}

export default SmsFarmsteadRevealHero;
