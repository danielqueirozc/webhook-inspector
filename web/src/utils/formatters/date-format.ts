import { formatDistanceToNow } from 'date-fns'

export function DateFormat(date: Date): string {
	return formatDistanceToNow(date, { addSuffix: true })
}
