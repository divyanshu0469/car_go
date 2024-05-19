/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      boxShadow: {
        'bottom': '1px 1px 6px 1px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        // 'sign-up-logo': "url('./public/sign_up_bg.svg')",
      },
      fontFamily: {
        lato: ['"Lato"'],
      },
      colors: {
        'lightBlue': "#00aff5",
        'darkBlue': "#054752",
      }
    },
  },
  plugins: [
    import('flowbite/plugin')
  ],
}

