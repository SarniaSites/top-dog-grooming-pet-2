/** Top Dog Grooming & Pet Care Services — Tailwind config
 *  Every colour is sampled from the business's own material and named by its job.
 */
module.exports = {
  content: ['./index.html', './thanks.html', './404.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // The one "click me" colour: Call, Enquire, links, focus rings.
        // The green of "DOG" and the heart in the logo (#3FA535 on the flyer), taken down to a 700 shade so white text passes AA.
        action: { DEFAULT: '#2B7A2A', dark: '#246B23', light: '#E3F0DD' },
        // Drawn lines, the horizon, ticks and the paw: the logo green at full strength.
        highlight: { DEFAULT: '#43A637', soft: '#8ACF6E' },
        // The sun and small markers: the warm orange of the dogs in the profile cartoon (#f5a559 in the logo palette).
        accent: { DEFAULT: '#F5A559', soft: '#FBE6CF', deep: '#C9772E' },
        // Text: the logo's black ground (#252729), tinted toward the brand green.
        ink: { DEFAULT: '#18211B', soft: '#4E5B52', faint: '#7D897F' },
        // Grounds: green-tinted off-whites (never pure white).
        surface: { DEFAULT: '#F4F6F0', paper: '#FBFCF9', deep: '#E7EEE2' },
        // Night-time sections: the logo black pushed toward green, for the boarding stop and the footer.
        night: { DEFAULT: '#102018', soft: '#1A3024', line: '#2C4637', text: '#B9C7BC' },
      },
      fontFamily: {
        // Gabarito: heavy geometric capitals close to the "TOP DOG" lettering in the logo.
        display: ['"Gabarito Variable"', '"Arial Black"', 'system-ui', 'sans-serif'],
        // Golos Text: quiet, open body face that stays readable at small sizes.
        sans: ['"Golos Text Variable"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        // Shantell Sans: the hand-written voice of the logo's "Happy Dogs, Care Always" line. Clock times and captions only.
        hand: ['"Shantell Sans Variable"', '"Comic Sans MS"', 'cursive'],
      },
      maxWidth: { site: '80rem' },
      screens: { xs: '400px' },
    },
  },
  plugins: [],
};
