import type { ComponentProps } from 'react'

interface SectionDataTableProps extends ComponentProps<'table'> {
	data: Array<{ key: string; value: string }>
}

export function SectionDataTable({
	className,
	data,
	...props
}: SectionDataTableProps) {
	return (
		<div
			{...props}
			className="overflow-hidden rounded-lg border border-zinc-700"
		>
			<table className="w-full">
				<tbody>
					{data.map((item) => {
						return (
							<tr
								key={item.key}
								className="border-b border-zinc-700 last:border-0"
							>
								<td className="p-3 text-sm font-medium text-zinc-400 bg-zinc-800/50 border-r border-zinc-700">
									{item.key}
								</td>
								<td className="p-3 text-sm font-mono text-zinc-300">
									{item.value}
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
