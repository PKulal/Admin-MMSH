/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--color-bg))",
                card: "hsl(var(--color-card))",
                border: "hsl(var(--color-border))",
                primary: {
                    DEFAULT: "hsl(var(--color-primary))",
                    foreground: "hsl(var(--color-bg))",
                },
                muted: {
                    DEFAULT: "hsl(var(--color-bg))",
                    foreground: "hsl(var(--color-text-muted))",
                }
            },
        },
    },
    plugins: [],
}
