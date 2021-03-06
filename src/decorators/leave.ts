import { GuildMemberHook } from './../models/hooks'
import chalk from 'chalk'
import { Logger } from '../utils/logger'
import { leaveHooksList } from '../lists/lists'
import { getOrCreateClassInstance } from '../utils/get-class-instance'

/**
 * Adds a hook that runs when someone leaves the server.
 * It works either when they leave by their will or kicked by an admin
 *
 * Usage:
 *
 * ```ts
 * class Fun {
 *   @Leave()
 *   async greetNewcomer(guildMember: GuildMember): Promise<void> {
 *     console.log(`${guildMember.user.tag} just left the server (for good maybe)`)
 *   }
 * }
 * ```
 *
 * You should use it on class methods with arguments of `Discord.GuildMember` and `Discord.Client`. Both of them are optional.
 *
 * *NOTICE:* In order to get your join-hook working, you have to enable
 * "Server Members Intent" for your bot at https://discord.com/developers
 */
export function Leave(): MethodDecorator {
  return function <T = GuildMemberHook>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ) {
    const instance = getOrCreateClassInstance(propertyKey.toString(), target)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    leaveHooksList.push((descriptor.value as any).bind(instance))
    Logger.log(`${chalk.yellow('@Leave')} ${propertyKey.toString()} ✔️`)
  }
}
