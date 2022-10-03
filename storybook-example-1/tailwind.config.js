/* eslint-env node */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx,mdx}'],
  theme: {
    minHeight: {
      // eslint-disable-next-line
      default: '200px'
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem'
      }
    },
    screens: {
      xs: '640px',
      tablet: '768px',
      sm: '768px',
      md: '1024px',
      lg: '1280px',
      xl: '1536px'
    },
    fontFamily: {
      sans: ['Nunito Sans', 'sans-serif']
    },
    extend: {
      maxWidth: {
        small: '1300px',
        medium: '1762px',
        large: '1920px'
      },
      colors: {
        primary: '#D31716',
        'primary-light': '#dc4545',
        'primary-dark': '#a91212',
        finance: '#1D69FD',
        'finance-light': '#4a87fd',
        'finance-dark': '#1754ca',
        promote: '#6B21A8',
        orange: '#FA4814',
        success: '#16A34A',
        warning: '#EA580C',
        info: '#38BDF8',
        error: '#E11D48',
        neutral: '#F5F6F4',
        'light-neutral': '#E3E5E3',
        superinfo: '#2180DD',
        superneutral: '#8D8A8A',
        dark: '#2F2F2F',
        'dark-fade': '#696969',
        'light-grey': '#D2D2D2'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')]
};
