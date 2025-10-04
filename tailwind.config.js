/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Chad Keith Portfolio Color Scheme - Red/Black/White
				chad: {
					red: {
						50: '#fef2f2',
						100: '#fee2e2',
						200: '#fecaca',
						300: '#fca5a5',
						400: '#f87171',
						500: '#ef4444',
						600: '#dc2626',
						700: '#b91c1c',
						800: '#991b1b',
						900: '#7f1d1d',
						DEFAULT: '#ff0000',
						primary: '#ff0000',
						secondary: '#dc2626',
						tertiary: '#991b1b'
					},
					black: {
						50: '#fafafa',
						100: '#f4f4f5',
						200: '#e4e4e7',
						300: '#d4d4d8',
						400: '#a1a1aa',
						500: '#71717a',
						600: '#52525b',
						700: '#3f3f46',
						800: '#27272a',
						900: '#18181b',
						DEFAULT: '#000000',
						primary: '#000000',
						secondary: '#18181b',
						tertiary: '#27272a'
					},
					white: {
						DEFAULT: '#ffffff',
						primary: '#ffffff',
						secondary: '#fafafa',
						tertiary: '#f4f4f5'
					}
				},
				// Standard Shadcn colors maintained for compatibility
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#ff0000',
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT: '#18181b',
					foreground: '#ffffff',
				},
				accent: {
					DEFAULT: '#dc2626',
					foreground: '#ffffff',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'tetris-fall': {
					'0%': { 
						transform: 'translateY(-100vh) rotate(0deg)',
						opacity: '0'
					},
					'50%': {
						opacity: '1'
					},
					'100%': { 
						transform: 'translateY(0) rotate(360deg)',
						opacity: '1'
					}
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000',
						opacity: '1'
					},
					'50%': { 
						boxShadow: '0 0 2px #ff0000, 0 0 5px #ff0000, 0 0 8px #ff0000',
						opacity: '0.8'
					}
				},
				'cursor-float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'tetris-fall': 'tetris-fall 1.5s ease-out forwards',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'cursor-float': 'cursor-float 2s ease-in-out infinite'
			},
			fontFamily: {
				'futura': ['Futura', 'Century Gothic', 'Trebuchet MS', 'Arial', 'sans-serif'],
				'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace']
			}
		},
	},
	plugins: [require('tailwindcss-animate')],
}