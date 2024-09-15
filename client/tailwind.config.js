/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            // To add background images for us to use in our project using TailwindCSS
            backgroundImage: {
                'auth-background': "url('/src/images/auth_background.jpg')"
            }
        },
    },
    plugins: []
}