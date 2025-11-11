import type { ComponentProps, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

interface IconButtonProps
	extends ComponentProps<'button'>,
		VariantProps<typeof iconButton> {
	// vai extender todas a propriedades que um botao receberia normalmente
	icon: ReactNode
}

const iconButton = tv({
	base: 'flex items-center justify-center rounded-lg hover:bg-zinc-700 transition-colors duration-150', // estilos que vai ser compartilhhados em todas as variants
	variants: {
		size: {
			sm: 'size-6',
			md: 'size-8',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

export function IconButton({
	icon,
	size,
	className,
	...props
}: IconButtonProps) {
	return (
		<button
			className={iconButton({ size, className })}
			type="button"
			{...props}
		>
			{icon}
		</button>
	)
}
