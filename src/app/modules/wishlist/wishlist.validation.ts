import { z } from 'zod'

const wishlistSchema = z.object({
  body: z.object({
    bikeId: z.string({ required_error: 'Bike ID is required' }),
    action: z.enum(['add', 'remove'], { required_error: 'Action is required' })
  })
})

export const WishlistValidation = {
  wishlistSchema
}
