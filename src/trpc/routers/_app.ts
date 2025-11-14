import { createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
export const appRouter = createTRPCRouter({
  newAi: protectedProcedure.mutation(async()=>{
    const {text} = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: 'Write a short poem about TRPC and Next.js integration with AI capabilities.'
    })

    return text;
  }),
  getusers: protectedProcedure.query(({ctx}) => {
      return prisma.user.findMany();
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;