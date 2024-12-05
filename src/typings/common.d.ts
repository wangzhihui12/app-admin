/**
 * 公共命名空间声明
 */
declare namespace CommonTypes {
  /**
   * 定义一个基本的响应对象接口
   */
  type IResponseBase = {
    /**
     * 状态码
     */
    code?: number
    /**
     * 响应信息
     */
    message?: string | string[]

    /**
     * 请求接口路径
     */
    url?: string
    error?: any
    /**
     * 时间戳
     */
    timestamp?: number
  }

  type IPage = {
    /**
     * 总条数
     */
    total: number
    /**
     * 页码
     */
    pageIndex: number
    /**
     * 当前页条数
     */
    pageSize: number
  }

  /**
   * 扩展分页对象接口，包括总条数
   */
  type IPagenation = Partial<IPage>

  /**
   
  /**
   * 响应数据接口，继承自分页对象接口，包含业务数据
   */
  interface IResData<T = any> extends IPagenation, IResponseBase {
    /**
     * 业务数据
     */
    data?: T
  }
  /**
   * 全局响应体接口，继承自分页对象、响应基本对象和响应数据接口
   */
  type IResponse<T> = IResData<T> & IResponseBase
  /**
   * 扩展分页对象接口，用于传入查询参数，包含附加属性
   */
  // interface IPageIn extends IPageBase {
  //   [key: string]: any
  // }
  type IPageIn = Omit<IPagenation, 'total'> & TObj
  /**
   * 定义一个基本的查询对象接口
   */
  interface IQueryBase {
    /**
     * 跳过数量
     */
    skip?: number
    /**
     * 获取数量
     */
    take?: number
  }
  /**
   * 定义一个响应体生成函数类型
   *
   * @param data -接口响应的数据
   * @returns 处理后返回给前端的响应体
   */
  type TBodyResponse = (data: IResData) => IResponse<IResData<unknown>>

  type Optional<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>
  type PartialOne<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
  type TObj = { [key: string]: any }

  interface IDeviceId {
    device_id: number
  }
  interface IId {
    id: number
  }
  interface ITime {
    created_at: Date | string

    updated_at: Date | string
  }

  interface ISn {
    sn: string
  }

  interface IUser  {
    user: string
    mobile: string
    merchant_name: string
  }
}
