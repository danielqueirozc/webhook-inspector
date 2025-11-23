import { createFileRoute } from '@tanstack/react-router'
import { WebhookDetail } from '../components/webhook-detail'
import { Suspense } from 'react'

export const Route = createFileRoute('/webhooks/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()

	return (
		<Suspense fallback={<div className="text-white text-lg">Loading...</div>}>
			<WebhookDetail id={id} />
		</Suspense>
	)
}
