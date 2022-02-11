module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
            '0%': {
                opacity: '0'
            },
            '100%': {
                opacity: '100'
            },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      transitionProperty: {
        'height': 'height'
      },
      boxShadow: {
        'light': '0 0 4px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}