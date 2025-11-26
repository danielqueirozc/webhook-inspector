import { Suspense, } from 'react'
import { CopyIcon } from 'lucide-react'
import { IconButton } from './ui/icon-button'
import { WebhooksList } from './webhooks-list'
import { toast } from 'sonner'
import { Toaster } from './ui/sonner'
import { WebHookSkeletonList } from './ui/webhook-skeleton'

export function Sidebar() {
	const url = 'https://webhook-inspector-d4n5.onrender.com/capture'

	function handleCopyToClipboard() {
		navigator.clipboard.writeText(url)
		toast.success('URL copiada para a sua área de transferência!')
	}

	return (
		<div className="flex flex-col h-screen">
			<div className="flex items-center justify-between border-b border-zinc-700 px-4 py-5">
				<div className="flex items-baseline">
					<span className="font-semibold text-zinc-100">webhook</span>
					<span className="font-normal text-zinc-400">.inspect</span>
				</div>
			</div>

			<div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-800 px-4 py-2.5">
				<div className="flex-1 min-w-0 flex items-center gap-1 text-xs font-mono text-zinc-300">
					<span className="truncate">{url}</span>
				</div>
				<IconButton 
					onClick={handleCopyToClipboard}
					icon={<CopyIcon className="size-4" />} 
				/>
			</div>

			<Suspense 
				fallback={(
				<div className="w-full">
					<WebHookSkeletonList />
				</div>
				)}
			>
				<WebhooksList />
			</Suspense>

			<Toaster position="top-center" />
		</div>
	)
}
