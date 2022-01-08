import { config } from '@/config'
import { createApiHandler } from '@/lib/api.server'
import { signupBodySchema, signupUser } from '@/lib/auth.server'

export default createApiHandler(async (req, res) => {
  if (config.enableSignup && req.method === 'POST') {
    const { name, email, password } = await signupBodySchema.parseAsync(req.body)

    await signupUser(name, email, password)

    res.json({ success: true })
  }
})
