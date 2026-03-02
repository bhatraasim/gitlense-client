/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#eca413",
                "background-light": "#f8f7f6",
                "background-dark": "#0a0907",
                "accent-dark": "#1a160f",
                "slate-text": "#a1a1aa",
                "white-text": "#f4f4f5",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "serif": ["Playfair Display", "serif"]
            },
            borderRadius: { "DEFAULT": "0.5rem", "lg": "0.75rem", "xl": "1.25rem", "2xl": "1.5rem", "3xl": "2rem", "full": "9999px" },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries')
    ],
}
