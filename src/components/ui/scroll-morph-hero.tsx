"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type AnimationPhase = "scatter" | "line" | "circle";

type FarmImage = {
  src: string;
  alt: string;
  label: string;
};

type CardTarget = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
};

type CirclePosition = {
  x: number;
  y: number;
  rotation: number;
};

type ArcLayout = {
  radius: number;
  centerY: number;
  startAngle: number;
  angleStep: number;
  spreadAngle: number;
  scale: number;
};

const IMAGE_WIDTH = 60;
const IMAGE_HEIGHT = 85;
const MAX_SCROLL = 3000;

const FARM_IMAGES: FarmImage[] = [
  {
    src: "https://images.pexels.com/photos/19972937/pexels-photo-19972937.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Hens gathered in a farm coop",
    label: "Farm-raised hens",
  },
  {
    src: "https://images.pexels.com/photos/17064389/pexels-photo-17064389.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Chickens gathered around a feeder",
    label: "Poultry care",
  },
  {
    src: "https://images.pexels.com/photos/27083552/pexels-photo-27083552.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "A flock of chickens on a poultry farm",
    label: "Healthy flocks",
  },
  {
    src: "https://images.pexels.com/photos/17765441/pexels-photo-17765441.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Chickens roaming inside a farm",
    label: "Farm life",
  },
  {
    src: "https://images.pexels.com/photos/12246335/pexels-photo-12246335.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "A chicken walking across a farmyard",
    label: "Free-range birds",
  },
  {
    src: "https://images.pexels.com/photos/18749480/pexels-photo-18749480.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Close-up of hens in a rural setting",
    label: "Poultry breeds",
  },
  {
    src: "https://images.pexels.com/photos/35877071/pexels-photo-35877071.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "A rooster in a poultry farm",
    label: "Farm birds",
  },
  {
    src: "https://images.pexels.com/photos/30248442/pexels-photo-30248442.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Chickens foraging together outdoors",
    label: "Natural foraging",
  },
  {
    src: "https://images.pexels.com/photos/16667124/pexels-photo-16667124.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Young chicks gathered in a brooder",
    label: "Day-old chicks",
  },
  {
    src: "https://images.pexels.com/photos/40913268/pexels-photo-40913268.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Chickens in a rustic barn",
    label: "Traditional farming",
  },
  {
    src: "https://images.pexels.com/photos/15645658/pexels-photo-15645658.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "A chicken resting on a farm floor",
    label: "Farmstead care",
  },
  {
    src: "https://images.pexels.com/photos/18181961/pexels-photo-18181961.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Chickens roaming outdoors",
    label: "Outdoor poultry",
  },
  {
    src: "https://images.pexels.com/photos/32537968/pexels-photo-32537968.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "A group of fluffy young chicks",
    label: "New beginnings",
  },
  {
    src: "https://images.pexels.com/photos/14944648/pexels-photo-14944648.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Baby chicks huddled together",
    label: "Healthy chicks",
  },
  {
    src: "https://images.pexels.com/photos/37150855/pexels-photo-37150855.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Chicks inside a farm pen",
    label: "Chick rearing",
  },
  {
    src: "https://images.pexels.com/photos/37341692/pexels-photo-37341692.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Fluffy chicks resting on grass",
    label: "Naturally nurtured",
  },
  {
    src: "https://images.pexels.com/photos/34591429/pexels-photo-34591429.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Two fluffy chicks outdoors",
    label: "Growing together",
  },
  {
    src: "https://images.pexels.com/photos/39239037/pexels-photo-39239037.jpeg?auto=compress&cs=tinysrgb&w=320&h=450&fit=crop",
    alt: "Chicks feeding in a farm coop",
    label: "Careful feeding",
  },
  {
    src: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=320&q=85",
    alt: "Fresh eggs arranged for hatching",
    label: "Hatching eggs",
  },
  {
    src: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=320&q=85",
    alt: "A collection of farm eggs",
    label: "Farm-fresh eggs",
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function FlipCard({
  image,
  index,
  target,
  phase,
  circlePosition,
  arcLayout,
  morph,
  scrollRotation,
  parallax,
  reduceMotion,
}: {
  image: FarmImage;
  index: number;
  target: CardTarget;
  phase: AnimationPhase;
  circlePosition: CirclePosition;
  arcLayout: ArcLayout;
  morph: MotionValue<number>;
  scrollRotation: MotionValue<number>;
  parallax: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const liveTarget = useTransform(
    [morph, scrollRotation, parallax],
    ([morphValue, rotationValue, parallaxValue]: number[]) => {
      const progress = clamp(rotationValue / 360, 0, 1);
      const arcAngle =
        arcLayout.startAngle +
        index * arcLayout.angleStep -
        progress * arcLayout.spreadAngle * 0.8;
      const arcRadians = (arcAngle * Math.PI) / 180;
      const arcX = Math.cos(arcRadians) * arcLayout.radius + parallaxValue;
      const arcY = Math.sin(arcRadians) * arcLayout.radius + arcLayout.centerY;
      const circleWeight = 1 - morphValue;

      return {
        x: circlePosition.x * circleWeight + arcX * morphValue,
        y: circlePosition.y * circleWeight + arcY * morphValue,
        rotate: circlePosition.rotation * circleWeight + (arcAngle + 90) * morphValue,
        scale: circleWeight + arcLayout.scale * morphValue,
      };
    },
  );
  const x = useTransform(liveTarget, (value) => value.x);
  const y = useTransform(liveTarget, (value) => value.y);
  const rotate = useTransform(liveTarget, (value) => value.rotate);
  const scale = useTransform(liveTarget, (value) => value.scale);

  return (
    <motion.div
      animate={phase === "circle" ? undefined : {
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 40, damping: 15 }
      }
      style={{
        ...(phase === "circle" ? { x, y, rotate, scale, opacity: 1 } : {}),
        position: "absolute",
        top: "50%",
        left: "50%",
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        marginLeft: -IMAGE_WIDTH / 2,
        marginTop: -IMAGE_HEIGHT / 2,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group cursor-pointer"
      aria-label={`${image.label}, image ${index + 1}`}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{
          duration: reduceMotion ? 0 : 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        whileHover={reduceMotion ? undefined : { rotateY: 180 }}
      >
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl bg-[#E4E8DE] shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            sizes="60px"
            unoptimized
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1D1D1D]/10 transition-colors group-hover:bg-transparent" />
        </div>
        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[#B58A4A]/40 bg-[#294B36] p-2 text-center shadow-lg"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          aria-hidden="true"
        >
          <span className="text-[7px] font-bold uppercase tracking-[.18em] text-[#D8BD83]">
            SMS Farmstead
          </span>
          <span className="mt-1 text-[9px] font-medium text-white">{image.label}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollMorphHero() {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const virtualScroll = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(scene);
    setContainerSize({
      width: scene.offsetWidth,
      height: scene.offsetHeight,
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setIntroPhase("circle");
      return;
    }

    const lineTimer = window.setTimeout(() => setIntroPhase("line"), 500);
    const circleTimer = window.setTimeout(() => setIntroPhase("circle"), 2500);
    return () => {
      window.clearTimeout(lineTimer);
      window.clearTimeout(circleTimer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateVirtualScroll = (delta: number) => {
      const next = clamp(scrollRef.current + delta, 0, MAX_SCROLL);
      if (next === scrollRef.current) return false;
      scrollRef.current = next;
      virtualScroll.set(next);
      return true;
    };

    const handleWheel = (event: WheelEvent) => {
      if (!updateVirtualScroll(event.deltaY)) return;
      event.preventDefault();
    };

    let touchStartY = 0;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const handleTouchMove = (event: TouchEvent) => {
      const touchY = event.touches[0]?.clientY;
      if (touchY === undefined) return;
      const delta = touchStartY - touchY;
      touchStartY = touchY;
      if (!updateVirtualScroll(delta)) return;
      event.preventDefault();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(
    morphProgress,
    reduceMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 40, damping: 20 },
  );
  const scrollRotate = useTransform(virtualScroll, [600, MAX_SCROLL], [0, 360]);
  const smoothScrollRotate = useSpring(
    scrollRotate,
    reduceMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 40, damping: 20 },
  );
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduceMotion) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 65);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, reduceMotion]);

  const scatterPositions = useMemo(
    () =>
      FARM_IMAGES.map((_, index) => {
        const angle = index * 2.399963;
        const radius = 220 + (index % 5) * 90;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * (radius * 0.72),
          rotation: Math.sin(angle * 1.7) * 70,
          scale: 0.72,
          opacity: 0.9,
        };
      }),
    [],
  );

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);
  const introOpacity = useTransform(smoothMorph, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative -mt-[112px] h-[110svh] min-h-[620px] w-full overflow-hidden bg-[#F2F2F1] text-[#1D1D1D] sm:-mt-[120px] min-[901px]:-mt-[121px]"
      aria-label="SMS Farmstead poultry collection"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,255,255,0.9),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(41,75,54,0.32)_0.6px,transparent_0.6px)] [background-size:18px_18px]" />

      <div
        ref={sceneRef}
        className="absolute inset-x-0 bottom-0 top-[112px] flex flex-col items-center justify-center overflow-hidden sm:top-[120px] min-[901px]:top-[121px]"
        style={{ perspective: "1000px" }}
      >
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4">
          <motion.div
            className="flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            style={{ opacity: introPhase === "circle" ? introOpacity : undefined }}
            transition={{ duration: reduceMotion ? 0 : 1 }}
          >
            <h1 className="text-3xl font-semibold tracking-[-.06em] text-[#294B36] sm:text-5xl">
              SMS FARMSTEAD
            </h1>
            <p className="mt-3 max-w-md px-5 text-sm text-[#3A3A3A] sm:text-base">
              Kadaknath poultry, carefully nurtured from the very beginning.
            </p>
            <span className="mt-7 text-[10px] font-bold tracking-[.24em] text-[#8D6B35]">
              SCROLL TO EXPLORE
            </span>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="pointer-events-none absolute top-[4%] z-10 flex flex-col items-center px-4 text-center"
        >
          <h2 className="mb-3 text-2xl font-semibold tracking-[-.04em] text-[#294B36] sm:text-4xl">
            Raised with care. Rooted in quality.
          </h2>
          <p className="max-w-xl text-xs leading-relaxed text-[#3A3A3A] sm:text-sm">
            Discover healthy Kadaknath chicks, carefully selected hatching eggs and
            trusted poultry suppliers from SMS Farmstead Ventures.
          </p>
        </motion.div>

        <div className="relative flex h-full w-full items-center justify-center">
          {FARM_IMAGES.map((image, index) => {
            const spacing = 70;
            const lineWidth = FARM_IMAGES.length * spacing;
            const target: CardTarget = introPhase === "line"
              ? {
                  x: index * spacing - lineWidth / 2 + spacing / 2,
                  y: 0,
                  rotation: 0,
                  scale: 1,
                  opacity: 1,
                }
              : { ...scatterPositions[index] };
            const isMobile = containerSize.width < 768;
            const minDimension = Math.min(containerSize.width, containerSize.height);
            const circleRadius = Math.min(minDimension * 0.35, 350);
            const circleAngle = (index / FARM_IMAGES.length) * 360;
            const circleRadians = (circleAngle * Math.PI) / 180;
            const spreadAngle = isMobile ? 100 : 130;
            const halfSpreadRadians = (spreadAngle / 2) * Math.PI / 180;
            const arcRadius = Math.min(
              containerSize.height * 1.25,
              (containerSize.width * 0.46) / Math.sin(halfSpreadRadians),
            );
            const arcApexY = containerSize.height * (isMobile ? 0.3 : 0.22);

            return (
              <FlipCard
                key={`${image.src}-${index}`}
                image={image}
                index={index}
                target={target}
                phase={introPhase}
                circlePosition={{
                  x: Math.cos(circleRadians) * circleRadius,
                  y: Math.sin(circleRadians) * circleRadius,
                  rotation: circleAngle + 90,
                }}
                arcLayout={{
                  radius: arcRadius,
                  centerY: arcApexY + arcRadius,
                  startAngle: -90 - spreadAngle / 2,
                  angleStep: spreadAngle / (FARM_IMAGES.length - 1),
                  spreadAngle,
                  scale: isMobile ? 1.35 : 1.7,
                }}
                morph={smoothMorph}
                scrollRotation={smoothScrollRotate}
                parallax={smoothMouseX}
                reduceMotion={reduceMotion}
              />
            );
          })}
        </div>
      </div>
      <span className="sr-only">
        Scroll within this section to morph the farm image cards into an arc. At the end,
        normal page scrolling continues to the rest of the homepage.
      </span>
    </section>
  );
}
