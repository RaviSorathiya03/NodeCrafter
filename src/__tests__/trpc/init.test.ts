import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initTRPC } from '@trpc/server';

describe('tRPC Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTRPCContext', () => {
    it('should create a context with userId', async () => {
      const { createTRPCContext } = await import('@/trpc/init');
      const context = await createTRPCContext();
      
      expect(context).toBeDefined();
      expect(context).toHaveProperty('userId');
      expect(context.userId).toBe('user_123');
    });

    it('should be cached and return same instance on multiple calls', async () => {
      const { createTRPCContext } = await import('@/trpc/init');
      const context1 = await createTRPCContext();
      const context2 = await createTRPCContext();
      
      expect(context1).toBe(context2);
    });

    it('should return an object with correct structure', async () => {
      const { createTRPCContext } = await import('@/trpc/init');
      const context = await createTRPCContext();
      
      expect(typeof context).toBe('object');
      expect(Object.keys(context)).toEqual(['userId']);
    });
  });

  describe('tRPC exports', () => {
    it('should export createTRPCRouter', async () => {
      const { createTRPCRouter } = await import('@/trpc/init');
      
      expect(createTRPCRouter).toBeDefined();
      expect(typeof createTRPCRouter).toBe('function');
    });

    it('should export createCallerFactory', async () => {
      const { createCallerFactory } = await import('@/trpc/init');
      
      expect(createCallerFactory).toBeDefined();
      expect(typeof createCallerFactory).toBe('function');
    });

    it('should export baseProcedure', async () => {
      const { baseProcedure } = await import('@/trpc/init');
      
      expect(baseProcedure).toBeDefined();
      expect(baseProcedure).toHaveProperty('query');
      expect(baseProcedure).toHaveProperty('mutation');
    });

    it('should create router with procedures', async () => {
      const { createTRPCRouter, baseProcedure } = await import('@/trpc/init');
      
      const testRouter = createTRPCRouter({
        test: baseProcedure.query(() => 'test'),
      });
      
      expect(testRouter).toBeDefined();
      expect(testRouter._def).toBeDefined();
    });
  });

  describe('tRPC instance configuration', () => {
    it('should initialize tRPC without transformer by default', async () => {
      const { baseProcedure } = await import('@/trpc/init');
      
      // The procedure should work with plain objects
      const testProcedure = baseProcedure.query(() => ({ test: 'value' }));
      expect(testProcedure).toBeDefined();
    });

    it('should support procedure chaining', async () => {
      const { baseProcedure } = await import('@/trpc/init');
      
      const chainedProcedure = baseProcedure
        .input((val: unknown) => val as string)
        .query(({ input }) => input);
      
      expect(chainedProcedure).toBeDefined();
    });
  });
});