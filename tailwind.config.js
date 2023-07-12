/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.jsx"],
  theme: {
    extend: {
      colors: {
        "background": '#fff',
        "red": {
          DEFAULT: '#ff1450'
        },
        'blue': {
          DEFAULT: '#0078ff',
          900: '#004bc8'
        },
        'yellow': {
          DEFAULT: '#ffbe00',
          '600': '#fe9700',
          '800': '#d29422',
          '900': '#b88019',
        },
        "black": {
          DEFAULT: '#282832'
        },
        "white": {
          DEFAULT: '#ffffff',
          100: '#f2f2f2',
          200: '#efefef'
        },
        'gray': {
          50: '#d9d9d9',
          100: '#929292'
        },
        'green': {
          DEFAULT: '#14ae5c'
        },
      },
      boxShadow: {
        'custom': '0px 0px 12px rgba(40, 40, 50, 0.4);'
      },
      screens: {
        'md': '769px',
        'phone': '480px',
        'sm-phone': '320px'
      }
    },
    plugins: [],
  }

}
