declare namespace FieldTypes {
  interface IFiled extends CommonTypes.IId, CommonTypes.ITime {
    name: string
    type: string
  }
  type TFieldRequird = Pick<IFiled, 'name' | 'type'>
  type TFieldAdd = TFieldRequird & Partial<Omit<IFiled, 'name' | 'type'>>
  type TFieldQuery = Partial<Pick<IFiled, 'name' | 'type'>> & CommonTypes.IQueryBase
}
