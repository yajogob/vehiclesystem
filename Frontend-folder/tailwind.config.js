/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'light': {
          'primary-bg': '#FFFFFF', //TODO: for primary background color
          'primary': '#C4B568', // TODO: change accordingly
          'secondary': '#000000', // TODO: change accordingly
          // ...
        },
        'dark': {
          'primary-bg': '#100E08', //TODO: for primary background color
          'primary': '#c3c3c3', // TODO: for primary text color
          'secondary': '#FFFFFF', // TODO: change accordingly
          // ...
        },
      },
      fontSize: {
        base: '1rem', //10px
        sm: '1.2rem', //12px
        lg: '1.4rem', //14px
        xl: '1.6rem', //16px
        '2xl': '1.8rem', //18px
        '3xl': '2.4rem', //24px
      }
    },
  },
  plugins: [],
}
