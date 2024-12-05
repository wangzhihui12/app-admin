import { WsAccess, WsAccessCode } from '../enums'

export class WsAccessException extends Error {
  constructor(
    public errMsg: WsAccess,
    public errorCode: WsAccessCode
  ) {
    super(errMsg)
  }
}
