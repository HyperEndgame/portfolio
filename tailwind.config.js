export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['Silkscreen', 'monospace'],
        pixel: ['"Pixelify Sans"', 'monospace'],
      },
      colors: { splash: '#ffff55', mcgray: '#aaaaaa' },
    },
  },
  plugins: [],
}
