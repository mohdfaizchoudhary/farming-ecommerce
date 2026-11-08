import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "#153D32",
        ivory: "#F6F8F3",
        harvest: "#E88445",
        charcoal: "#1C2924",
        sage: "#E8F0EA",
      },
    },
  },
  plugins: [],
} satisfies Config;