import type { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface BadgeProps extends ComponentProps<'span'> {}

export function Badge({ className, ...props }: BadgeProps) {
	// desestruturar para poder pegar o className em uma variavel separada para nao sobrescrever os classNames que ja tem
	return (
		<span
			className={twMerge(
				'px-3 py-1 rounded-lg border font-mono text-sm font-semibold border-zinc-600 bg-zinc-800 text-zinc-100',
				className,
			)} /// unir os className
			{...props}
		/>
		// nao precisei colocar children porque o children ja é uma prop
	)
}
