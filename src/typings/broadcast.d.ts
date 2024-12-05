import { Command } from '../common/enums'

declare namespace Broadcastypes {
  type MessageData<T extends Command> = T extends Command.RemoveLog ? Required<Pick<WsTypes.MessageData<Command.RemoveLog>, 'days'>> & Omit<MessageData<T>, 'days'> : T extends Command.RemoveRecord ? Required<Pick<WsTypes.MessageData<Command.RemoveRecord>, 'id'>> & Omit<MessageData<T>, 'id'> : T extends Command.GetStorage ? Required<Pick<WsTypes.MessageData<Command.GetStorage>, 'key'>> & Omit<MessageData<T>, 'key'> : T extends Command.SetPollingInterval ? Required<Pick<WsTypes.MessageData<Command.SetPollingInterval>, 'interval'>> & Omit<MessageData<T>, 'interval'> : WsTypes.MessageBody<T>
}
