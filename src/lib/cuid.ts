import { init } from '@paralleldrive/cuid2'

export const createPrimaryKeyId = init({
  length: 36,
})
