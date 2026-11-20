// "use client";

// import { useLayoutEffect } from "react";
// import { usePathname } from "next/navigation";

// export default function Template({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();

//   useLayoutEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return <div className="page-transition">{children}</div>;
// }





"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1], // Custom Apple-like spring curve
      }}
      className="min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
}