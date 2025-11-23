import { Link } from '@tanstack/react-router'
import { IconButton } from './ui/icon-button'
import { Trash2Icon } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { DateFormat } from '../utils/formatters/date-format'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface WebhooksListItemProps {
	webhook: {
		id: string
		method: string
		pathname: string
		createdAt: Date
	}
	onWebhookCheckedChange: (webhookId: string) => void
	isWebhookChecked: boolean
}

export function WebhooksListItem({ webhook, onWebhookCheckedChange, isWebhookChecked }: WebhooksListItemProps) {

	const queryClient = useQueryClient()

	const { mutate: deleteWebhook } = useMutation({ // lida com acoes de mutacao de dados (criar, atualizar, deletar)
		mutationFn: async (id: string) => {
			await fetch(`http://localhost:3333/api/webhooks/${id}`, {
				method: 'DELETE',
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ // isso vai recarregar e atualizar o array sem o item deletado
				queryKey: ['webhooks'],
			})
		},
	}) 

	return (
		<div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
			<div className="flex items-start gap-3 px-4 py-2.5">
				<Checkbox onCheckedChange={() => onWebhookCheckedChange(webhook.id)} checked={isWebhookChecked} />

				<Link
					to="/webhooks/$id"
					params={{ id: webhook.id }}
					className="flex-1 flex min-w-0 items-start gap-3"
				>
					<span className="w-12 shrink-0 font-mono text-xs font-semibold text-zinc-300 text-right">
						{webhook.method}
					</span>
					<div className="flex-1 min-w-0">
						<p className="truncate text-xs text-zinc-200 leading-tight font-mono">
							{webhook.pathname}
						</p>
						<p className="text-xs text-zinc-500 font-medium mt-1">
							{DateFormat(new Date(webhook.createdAt))}
						</p>
					</div>
				</Link>
				<IconButton
					icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
					className="opacity-0 transition-opacity group-hover:opacity-100"
					onClick={() => deleteWebhook(webhook.id)}
				/>
			</div>
		</div>
	)
}
