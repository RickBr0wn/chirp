import { clerkClient } from '@clerk/nextjs'
import type { User } from '@clerk/nextjs/dist/types/server'
import type { Post } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

const filterUsersForClient = (user: User) => ({
  id: user.id,
  name: user.username,
  profileImageUrl: user.profileImageUrl,
})

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100 })

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
        limit: 100,
      })
    ).map(filterUsersForClient)

    console.log(users)

    return posts.map((post: Post) => {
      const author = users.find((user) => user.id === post.authorId)

      if (!author || !author.name) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Author not found',
        })
      }

      return {
        post,
        author: { ...author, name: author.name },
      }
    })
  }),
})
