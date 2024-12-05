import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"
import { Socket } from "socket.io"
import { WsAccess, WsAccessCode } from "../enums"
import { TokenExpiredError } from "@nestjs/jwt"

@Injectable()
export class WsConnParamPipe implements PipeTransform<any, any> {
  transform(client: Socket, metadata: ArgumentMetadata): any {
    // 创建一个新对象，以避免直接修改原始值
    const transformedValue = { ...client }
    const auth = client.handshake?.auth ?? client.handshake?.headers
    const ValidateData: WsTypes.LoginValidate<WsAccess> = { isValidate: true, errMsg: WsAccess.IsOnline, errorCode: WsAccessCode.IsOnline }
    if (!auth) {
      ValidateData.isValidate = false
      ValidateData.errMsg = WsAccess.NotAllowed
      ValidateData.errorCode = WsAccessCode.NotAllowed
    }
    const { token, deviceId } = auth
    // 注册用户
    if (!token) {
      ValidateData.isValidate = false
      ValidateData.errMsg = WsAccess.InValidToken
      ValidateData.errorCode = WsAccessCode.InValidToken
    }
    if (!deviceId) {
      ValidateData.isValidate = false
      ValidateData.errMsg = WsAccess.InvalidDeviceId
      ValidateData.errorCode = WsAccessCode.InvalidDeviceId
    }
    return {transformedValue,ValidateData}
  }
}