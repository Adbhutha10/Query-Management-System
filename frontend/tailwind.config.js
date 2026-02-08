// tailwind.config.js
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2872A1',
                    dark: '#1e5a82',
                    light: '#5ba3d1',
                },
                secondary: {
                    DEFAULT: '#CBDDE9',
                    light: '#F0F9FF',
                },
                text: {
                    main: '#0f172a',
                    muted: '#64748b',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
            },
            fontFamily: {
                heading: ['Outfit', 'sans-serif'],
                body: ['Plus Jakarta Sans', 'sans-serif'],
            }
        },
    },
    plugins: [],
}