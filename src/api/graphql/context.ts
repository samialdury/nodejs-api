import type { BaseContext } from '@apollo/server'

import type { Config } from '../../config.js'

export interface Context extends BaseContext {
    config: Config
}
