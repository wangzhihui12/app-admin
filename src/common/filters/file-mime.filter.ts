import { UnsupportedMediaTypeException } from '@nestjs/common'

export function FileMimeTypeFilter(...mimes: string[]) {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (mimes.some(mime => file.mimetype.includes(mime))) {
      callback(null, true)
    } else {
      callback(new UnsupportedMediaTypeException('文件类型错误'), false)
    }
  }
}
