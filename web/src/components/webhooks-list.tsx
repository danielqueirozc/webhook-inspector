import { Loader2, Wand2 } from 'lucide-react'
import { WebHookListSchema } from '../http/schemas/wbhooks'
import { WebhooksListItem } from './webhooks-list-item'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { CodeBlock } from './ui/code-block'

export function WebhooksList() {
	const loadMoreRef = useRef<HTMLDivElement>(null)
	const observerRef = useRef<IntersectionObserver>(null)
	const [ checkedWebhooksIds, setCheckedWebhooksId ] = useState<string []>([])
	const [ generatedHandlerCode, setGeneratedHandlerCode ] = useState<string | null>(null)

	const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useSuspenseInfiniteQuery({
			queryKey: ['webhooks'], // como se fosse uma identificao unica de cada query
			queryFn: async ({ pageParam }) => {// funcao que vai executar para buscar os dados

				const url = new URL('https://webhook-inspector-d4n5.onrender.com/api/webhooks')
				if (pageParam) {
					url.searchParams.set('cursor', pageParam) // adiciona o cursor na url se existir pageParam
				}

				const response = await fetch(url)
				// console.log('response', response)
				const data = await response.json()
				console.log('data', data)

				return WebHookListSchema.parse(data) // valida os dados com o schema
			},
			getNextPageParam: (lastPage) => {
				// funcao que define como pegar a proxima pagina, lastPage representa a ultima pagina que foi carregada, nextCursor = parametro que diz se a tem uma proxima pagina ou nao
				return lastPage.nextCursor ?? undefined // se nao existir nextCursor, retorna undefined
			},
			initialPageParam: undefined as string | undefined, // parametro inicial para a primeira pagina, esta como undefined pq no inicio nao teremos "Paginas" e sim 1 pagina
		})

	const webhooks = data.pages.flatMap((page) => page.webhooks) // flatMap para transformar um array de arrays em um array unico

	useEffect(() => {
		// se caso o useEffect executar mais de uma vez, desconecta o observer antigo antes de criar um novo
		if (observerRef.current) {
			observerRef.current.disconnect() // desconecta o observer quando o componente for desmontado
		}

		// const observer =
			(observerRef.current = new IntersectionObserver(
				(entries) => {
					// entreies = todos os elementos que estao sendo observados
					const entry = entries[0] // pegando o primeiro elemento (no caso so tem 1 elemento sendo observado)

					if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
						// se o elemento estiver visivel na tela e tiver proxima pagina e ainda nao estou carregando a proxima pagina
						fetchNextPage() // busca a proxima pagina
					}
				},
				{
					threshold: 0.1, // threshold = 1 significa que o callback so vai ser disparado quando 10% do elemento estiver visivel na tela
				},
			))

		if (loadMoreRef.current) {
			observerRef.current.observe(loadMoreRef.current) // quando o loadMoreRef aparecer em tela o observer vai disparar o callback
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect() // desconecta o observer quando o componente for desmontado
			}
		}
	}, [hasNextPage, fetchNextPage, isFetchingNextPage]) // toda vez que hasNextPage ou fetchNextPage mudar, o useEffect vai ser executado novamente\

	function handleCheckWebhook(webhookId: string) {
		if (checkedWebhooksIds.includes(webhookId)) {
			setCheckedWebhooksId((prevWebhooks) => prevWebhooks.filter((prevWebhookId) => prevWebhookId !== webhookId)) // remove o id do array se ja estiver selecionado
		} else {
			setCheckedWebhooksId((prev) => [...prev, webhookId])
		}
	}

	async function handleGenerateHandler() {
		const response = await fetch('https://webhook-inspector-d4n5.onrender.com/api/generate', {
			method: 'POST',
			body: JSON.stringify({
				webhooksIds: checkedWebhooksIds,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		type GenerateResponse = {  code: string }

		const data: GenerateResponse = await response.json()
		
		setGeneratedHandlerCode(data.code)
	}

	const hasAnyWebhookChecked = checkedWebhooksIds.length > 0

	return (
			<>
				<div className="flex-1 overflow-y-auto">
					<div className="space-y-4 p-2">
						<button 
							onClick={handleGenerateHandler}
							disabled={!hasAnyWebhookChecked} 
							className='bg-indigo-400 mb-3 text-white w-full flex items-center justify-center font-medium text-sm py-2 gap-3 rounded-lg disabled:opacity-50'
						>
							<Wand2 className='size-4'/>
							Gerar handler
						</button>

						{webhooks.map((webhook) => (
							<WebhooksListItem 
								key={webhook.id} 
								webhook={webhook} 
								onWebhookCheckedChange={handleCheckWebhook} 
								isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}/>
						))}
					</div>

					{hasNextPage && (
						<div className="p-2" ref={loadMoreRef}>
							{isFetchingNextPage ?? (
								<div className="flex items-center justify-center py-4">
									<Loader2 className="size-5 animate-spin text-zinc-500" />
								</div>
							)}
						</div>
					)}
				</div>

				{!!generatedHandlerCode && (
					<Dialog.Root defaultOpen>
						<Dialog.Overlay className="fixed inset-0 bg-black/60"/>

						<Dialog.Content className='flex items-center justify-center fixed left-1/2 top-1/2 max-h-[85vh] w-[vw] -translate-x-1/2 -translate-y-1/2 z-40'>
							<div className="bg-zinc-900 w-[600px] p-4 rounded-lg border border-zinc-800 max-h-[400px] overflow-y-auto">
								<CodeBlock language='typescript' code={generatedHandlerCode} />
							</div>
						</Dialog.Content>
					</Dialog.Root>
				)}
			</>

	)
}
