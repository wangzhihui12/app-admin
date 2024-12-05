import * as chalk from 'chalk' // 用于颜色化输出
import { utilities } from 'nest-winston'
import { join } from 'path'
import { createLogger, format, transports } from 'winston'
import winston = require('winston')
import * as DailyRotateFile from 'winston-daily-rotate-file'

const formaters = [format.timestamp(), format.errors({ stack: true }), format.splat(), format.json(), winston.format.ms()]

const cfgRotage = {
  dirname: join(__dirname, '..', '..', 'logs'),
  datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
  zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
  maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
  maxFiles: '14d' // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
}

export default createLogger({
  format: format.combine(
    ...formaters,
    utilities.format.nestLike('', {
      colors: false,
      prettyPrint: true
    })
  ),
  defaultMeta: { service: 'Winstion-Logger-Service' },
  transports: [
    // new DailyRotateFile({
    //   filename: 'logs/errors/error-%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
    //   level: 'error', // 日志类型，此处表示只记录错误日志。
    //   ...cfgRotage
    // }),
    new DailyRotateFile({
      filename: 'logs/warnings/warning-%DATE%.log',
      level: 'warn',
      ...cfgRotage
    }),
    new DailyRotateFile({
      filename: 'logs/app/app-%DATE%.log',
      ...cfgRotage
    }),
    new transports.Console({
      format: format.combine(
        ...formaters,
        utilities.format.nestLike('', {
          colors: true,
          prettyPrint: true
        })
      ),
      level: 'debug'
    })
  ]
})
