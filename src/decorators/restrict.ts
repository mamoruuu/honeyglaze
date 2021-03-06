import chalk from 'chalk'
import { Snowflake } from 'discord.js'
import { ValidationError } from '..'
import { PREFIX } from '../constants'
import { commandBlackList, commandWhiteList } from '../lists/lists'
import { Logger } from '../utils/logger'

/**
 * Restricts the command evaluation to users with certain roles.
 *
 * ```ts
 * @Command()
 * @Allow(["745464790348202055", "745464790376580205"])
 * public hello(message: Message): void {
 *   message.reply('hello, world!')
 * }
 * ```
 * @param roleIdList - role id list to restrict the command for
 */
export function Restrict(roleIdList: Snowflake[]): MethodDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target: any, propertyKey: string | symbol): void {
    const commandName = propertyKey.toString()
    const allowedRoles = commandWhiteList.get(commandName)
    if (allowedRoles) {
      Logger.warn(
        `There's no sense to allow and restrict the ${commandName} command simultaneously!`,
      )
      if (allowedRoles.some(role => roleIdList.includes(role))) {
        throw new ValidationError(
          `You can't restrict and allow the "${commandName}" command at the same time!`,
        )
      }
    }
    commandBlackList.set(commandName, roleIdList)
    Logger.log(
      `${chalk.red('@RestrictFor ' + PREFIX + commandName)} ✋ ${chalk.grey(
        roleIdList.join(', '),
      )}`,
    )
  }
}
