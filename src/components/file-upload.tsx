'use client'

import { Paperclip, X } from 'lucide-react'
import { useRef } from 'react'
import { Button } from './ui/button'

type FileUploadProps = {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClearFile: () => void
  disabled?: boolean
}

export function FileUpload({
  onFileSelect,
  selectedFile,
  onClearFile,
  disabled,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'audio/mpeg',
        'audio/wav',
        'video/mp4',
        'video/webm',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]

      if (!allowedTypes.includes(file.type)) {
        alert(
          'Unsupported file type. Supported: PDF, Images, Audio, Video, Text, DOCX, XLSX'
        )
        return
      }

      onFileSelect(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className='flex items-center gap-2'>
      <input
        ref={fileInputRef}
        type='file'
        onChange={handleFileChange}
        className='hidden'
        accept='.pdf,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.mp4,.webm,.txt,.docx,.xlsx'
        disabled={disabled}
      />

      {selectedFile ? (
        <div className='flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-xs'>
          <Paperclip className='w-3 h-3' />
          <span className='max-w-[150px] truncate'>{selectedFile.name}</span>
          <span className='text-muted-foreground'>
            ({formatFileSize(selectedFile.size)})
          </span>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={onClearFile}
            className='h-5 w-5 p-0 ml-1'
            disabled={disabled}
          >
            <X className='w-3 h-3' />
          </Button>
        </div>
      ) : (
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={handleButtonClick}
          disabled={disabled}
          className='h-9 w-9 p-0'
        >
          <Paperclip className='w-4 h-4' />
        </Button>
      )}
    </div>
  )
}
