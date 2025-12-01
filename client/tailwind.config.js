/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            colors: {
                primary: {
                    50: '#f0f9fa',
                    100: '#dcf2f4',
                    200: '#bce6eb',
                    300: '#8ed3dc',
                    400: '#59b8c8',
                    500: '#1eb2c2', // Cyan/Teal Base
                    600: '#1691a3',
                    700: '#157485',
                    800: '#035c95', // Dark Blue Base (User provided)
                    900: '#134e5e',
                    950: '#0b3440',
                },
                slate: {
                    850: '#1e293b', // Custom dark slate for sidebar
                }
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
                'card': '0 8px 30px rgba(0,0,0,0.04)',
                'card-hover': '0 20px 40px rgba(0,0,0,0.08)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}
