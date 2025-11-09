import { Badge } from "./ui/badge";

export function WebhhookDetailHeader() {
  return (
    	<header className="space-y-4 border-b border-zinc-700 p-6">
        <div className="flex items-center gap-6">
          <Badge>POST</Badge>
          <span className="text-lg font-medium text-zinc-300">
            /video/status
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-2 text-sm text-zinc-400'>
            <span>From Ip</span>
            <span className='font-mono underline underline-offset-4'>123.456.789.012</span>
          </div>
          <span className='w-px h-4 bg-zinc-700' />
          <div className='flex items-center gap-2 text-sm text-zinc-400'>
            <span>at</span>
            <span>April 18th, 14pm</span>
          </div>
        </div>
      </header>
  )
}