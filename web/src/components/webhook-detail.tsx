import { useSuspenseQuery } from '@tanstack/react-query'
import { webhookDetailsSchema } from '../http/schemas/wbhooks'
import { WebhookDetailHeader } from './webhhook-detail-header'
import { SectionTitle } from './section-title'
import { SectionDataTable } from './section-data-table'
import { CodeBlock } from './ui/code-block'

interface WebhookDetailProps {
	id: string
}

export function WebhookDetail({ id }: WebhookDetailProps) {
	const { data } = useSuspenseQuery({
		queryKey: ['webhook', id],
		queryFn: async () => {
			const response = await fetch(`https://webhook-inspector-d4n5.onrender.com/api/webhooks/${id}`)
			const data = await response.json()

			return webhookDetailsSchema.parse(data)
		},
	})

	const overviewData = [
		{ key: 'Method', value: data.method },
		{ key: 'Status Code', value: String(data.statusCode) },
		{ key: 'Content-Type', value: data.contentType || 'Application/json' },
		{ key: 'content-length', value: `${data.contentLength || 0} Bytes` },
	]

	const headers = Object.entries(data.headers).map(([key, value]) => {
		return { key, value: String(value) }
	})

	const queryParams = Object.entries(data.queryParams || {}).map(
		([key, value]) => {
			return { key, value: String(value) }
		},
	)

	return (
		<div className="flex flex-col h-full ">
			<WebhookDetailHeader
				method={data.method}
				pathname={data.pathname}
				ip={data.ip}
				createdAt={data.createdAt}
			/>
			<div className="flex-1 overflow-y-auto">
				<div className="space-y-4">
					<SectionTitle>Request Overview</SectionTitle>
					<SectionDataTable data={overviewData} />
				</div>

				<div className="space-y-6 p-6">
					<div className="space-y-4">
						<SectionTitle>Headers</SectionTitle>
						<SectionDataTable data={headers} />
					</div>

					{queryParams.length > 0 && (
						<div className="space-y-4">
							<SectionTitle>Query Parameters</SectionTitle>
							<SectionDataTable data={queryParams} />
						</div>
					)}

					{!!data.body && ( // !! = se eu tiver um data.body
						<div className="space-y-4">
							<SectionTitle>Request Body</SectionTitle>
							<CodeBlock code={data.body} />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
