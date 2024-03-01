/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors:{
				
				'accent': 'rgb(34, 197, 94)',
				'accent-light': 'rgb(134, 239, 172)',
				'accent-dark': 'rgb(20, 83, 45)',
				'tinder-red': 'rgb(153, 27, 27)',
				'tinder-orange': 'rgb(249, 115, 22)',
				'tinder-amber': 'rgb(217, 119, 6)',
				'accent-gradient': 'linear-gradient(45deg, rgb(34, 197, 94)), rgb(153, 27, 27) 25%, white 90%)',
			}, 
			 backgroundImage: {
        'opacity-gradient': 'linear-gradient(to top, #00000088 20%, transparent 50%)',
      }
      },
	},
	plugins: [
    function({ addUtilities }) {
     const newUtilities = {
			'.range-thumb::-webkit-slider-thumb': {
				'height': '7px',
				'width': '7px',
				'appearance': 'none',
				'background': '#4b5563',
				'borderRadius': '50%',
			},
			'.range-thumb::-webkit-slider-thumb:hover': {
				'background': 'rgb(134, 239, 172)',
				'cursor' : 'grab'
			},
			'.range-thumb::-moz-range-thumb': {
				'height': '7px',
				'width': '7px',
				'background': '#4b5563',
				'borderRadius': '50%',
			},
			'.range-thumb::-moz-range-thumb:hover': {
				'background': 'rgb(134, 239, 172)',
				'cursor' : 'grab'
			},
			'.range-track::-webkit-slider-runnable-track': {
				'height': '4px',
				'background': 'linear-gradient(to right, var(--tw-gradient-stops) var(--tw-value), #4b5563 0)',
			},
			'.range-track::-moz-range-track': {
				'height': '4px',
				'background': '#4b5563',
			},
			'.range-track::-moz-range-progress': {
				'background': '#4b5563',
			},
		}	
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}
