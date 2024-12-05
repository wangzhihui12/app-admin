declare namespace FileTypes {
  interface IFile<T> extends CommonTypes.IId, CommonTypes.IDeviceId, Pick<CommonTypes.ITime, 'created_at'> {
    originalname: string
    mimetype: string
    filename: string
    path: string
    size: number
    destination: string
    type: T
  }
  type FileUpload<T> = Omit<IFile<T>, 'id'>
  type FindeFiles<T = any> = Partial<Pick<IFile<T>, 'filename' | 'type' | 'device_id'>> & CommonTypes.IQueryBase
}
