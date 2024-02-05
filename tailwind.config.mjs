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
			}
      },
	},
	plugins: [],
}
