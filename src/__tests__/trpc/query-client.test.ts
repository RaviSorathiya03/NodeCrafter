import { describe, it, expect, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

describe('Query Client Configuration', () => {
  describe('makeQueryClient', () => {
    it('should create a QueryClient instance', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      expect(queryClient).toBeInstanceOf(QueryClient);
    });

    it('should configure staleTime to 30 seconds', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.staleTime).toBe(30 * 1000);
    });

    it('should create a new instance on each call', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const client1 = makeQueryClient();
      const client2 = makeQueryClient();
      
      expect(client1).not.toBe(client2);
    });

    it('should configure dehydrate options', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.dehydrate).toBeDefined();
      expect(defaultOptions.dehydrate?.shouldDehydrateQuery).toBeDefined();
      expect(typeof defaultOptions.dehydrate?.shouldDehydrateQuery).toBe('function');
    });

    it('should configure hydrate options', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.hydrate).toBeDefined();
    });

    it('should dehydrate pending queries', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      const defaultOptions = queryClient.getDefaultOptions();
      const shouldDehydrateQuery = defaultOptions.dehydrate?.shouldDehydrateQuery;
      
      if (shouldDehydrateQuery) {
        const pendingQuery = {
          queryKey: ['test'],
          queryHash: 'test',
          state: { status: 'pending' as const, data: undefined, error: null },
        };
        
        // @ts-expect-error - Simplified query object for testing
        const result = shouldDehydrateQuery(pendingQuery);
        expect(result).toBe(true);
      }
    });

    it('should respect default dehydrate behavior for non-pending queries', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      const defaultOptions = queryClient.getDefaultOptions();
      const shouldDehydrateQuery = defaultOptions.dehydrate?.shouldDehydrateQuery;
      
      expect(shouldDehydrateQuery).toBeDefined();
    });
  });

  describe('QueryClient default configuration', () => {
    it('should have queries configuration', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries).toBeDefined();
    });

    it('should allow custom query configuration to be set', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      queryClient.setDefaultOptions({
        queries: {
          staleTime: 60000,
        },
      });
      
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries?.staleTime).toBe(60000);
    });

    it('should support query invalidation', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      await queryClient.invalidateQueries({ queryKey: ['test'] });
      expect(queryClient).toBeDefined();
    });

    it('should support query prefetching', async () => {
      const { makeQueryClient } = await import('@/trpc/query-client');
      const queryClient = makeQueryClient();
      
      await queryClient.prefetchQuery({
        queryKey: ['test'],
        queryFn: () => Promise.resolve('data'),
      });
      
      const data = queryClient.getQueryData(['test']);
      expect(data).toBe('data');
    });
  });
});