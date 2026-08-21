import { useRef, useState } from 'react'
import { ImageUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { storageService } from '@/services/storageService'
import { toast } from './Toast'

interface UploadPreviewProps {
  value: string | null
  onChange: (value: string | null) => void
  /** Storage bucket to upload into. If omitted, falls back to the old local-preview-only behavior. */
  bucket?: string
  folder?: string
  label?: string
  hint?: string
  className?: string
}

export function UploadPreview({
  value,
  onChange,
  bucket,
  folder,
  label = 'Imagem',
  hint = 'PNG ou JPG até 5MB.',
  className,
}: UploadPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!bucket) {
      onChange(URL.createObjectURL(file))
      return
    }

    setIsUploading(true)
    try {
      const url = await storageService.uploadImage(bucket, file, folder)
      onChange(url)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível enviar a imagem.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted">
          {value ? (
            <img src={value} alt="Pré-visualização" className="size-full object-cover" />
          ) : (
            <ImageUp className="size-6 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={isUploading} onClick={() => inputRef.current?.click()}>
              {isUploading ? 'Enviando...' : value ? 'Trocar imagem' : 'Selecionar imagem'}
            </Button>
            {value && !isUploading && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
                <X className="size-4" />
                Remover
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleFileChange}
          aria-label={label}
        />
      </div>
    </div>
  )
}
