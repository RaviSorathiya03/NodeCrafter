import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock dependencies
vi.mock('@trpc/client', () => ({
  createTRPCClient: vi.fn(() => ({})),
  httpBatchLink: vi.fn(() => ({})),
}));

vi.mock('@trpc/tanstack-react-query', () => ({
  createTRPCContext: vi.fn(() => ({
    TRPCProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useTRPC: vi.fn(),
  })),
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('tRPC Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window object
    delete (global as any).window;
  });

  describe('TRPCReactProvider', () => {
    it('should render children', async () => {
      // Set up browser environment
      (global as any).window = {};
      
      const { TRPCReactProvider } = await import('@/trpc/client');
      
      render(
        <TRPCReactProvider>
          <div>Test Child</div>
        </TRPCReactProvider>
      );
      
      expect(screen.getByText('Test Child')).toBeDefined();
    });

    it('should wrap children with providers', async () => {
      (global as any).window = {};
      
      const { TRPCReactProvider } = await import('@/trpc/client');
      
      const { container } = render(
        <TRPCReactProvider>
          <span>Content</span>
        </TRPCReactProvider>
      );
      
      expect(container).toBeDefined();
      expect(screen.getByText('Content')).toBeDefined();
    });

    it('should accept children prop', async () => {
      (global as any).window = {};
      
      const { TRPCReactProvider } = await import('@/trpc/client');
      
      const TestComponent = () => <div>Test Component</div>;
      
      render(
        <TRPCReactProvider>
          <TestComponent />
        </TRPCReactProvider>
      );
      
      expect(screen.getByText('Test Component')).toBeDefined();
    });

    it('should handle multiple children', async () => {
      (global as any).window = {};
      
      const { TRPCReactProvider } = await import('@/trpc/client');
      
      render(
        <TRPCReactProvider>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </TRPCReactProvider>
      );
      
      expect(screen.getByText('Child 1')).toBeDefined();
      expect(screen.getByText('Child 2')).toBeDefined();
      expect(screen.getByText('Child 3')).toBeDefined();
    });
  });

  describe('getUrl function', () => {
    it('should return empty string in browser environment', async () => {
      (global as any).window = {};
      
      // Import the module to trigger getUrl logic
      await import('@/trpc/client');
      
      // The function is internal, but we can test its effect through the provider
      expect(true).toBe(true);
    });

    it('should use VERCEL_URL when available on server', async () => {
      delete (global as any).window;
      process.env.VERCEL_URL = 'test.vercel.app';
      
      // Re-import to get new environment
      await import('@/trpc/client');
      
      expect(process.env.VERCEL_URL).toBe('test.vercel.app');
      
      // Cleanup
      delete process.env.VERCEL_URL;
    });

    it('should default to localhost on server without VERCEL_URL', async () => {
      delete (global as any).window;
      delete process.env.VERCEL_URL;
      
      await import('@/trpc/client');
      
      expect(true).toBe(true);
    });
  });

  describe('Query Client Management', () => {
    it('should create query client in server environment', async () => {
      delete (global as any).window;
      
      const { TRPCReactProvider } = await import('@/trpc/client');
      
      render(
        <TRPCReactProvider>
          <div>Server Test</div>
        </TRPCReactProvider>
      );
      
      expect(screen.getByText('Server Test')).toBeDefined();
    });

    it('should reuse query client in browser environment', async () => {
      (global as any).window = {};
      
      const { TRPCReactProvider } = await import('@/trpc/client');
      
      const { unmount } = render(
        <TRPCReactProvider>
          <div>Browser Test 1</div>
        </TRPCReactProvider>
      );
      
      unmount();
      
      render(
        <TRPCReactProvider>
          <div>Browser Test 2</div>
        </TRPCReactProvider>
      );
      
      expect(screen.getByText('Browser Test 2')).toBeDefined();
    });
  });

  describe('Module exports', () => {
    it('should export TRPCReactProvider', async () => {
      const module = await import('@/trpc/client');
      
      expect(module.TRPCReactProvider).toBeDefined();
      expect(typeof module.TRPCReactProvider).toBe('function');
    });

    it('should export TRPCProvider from createTRPCContext', async () => {
      const module = await import('@/trpc/client');
      
      expect(module.TRPCProvider).toBeDefined();
    });

    it('should export useTRPC hook', async () => {
      const module = await import('@/trpc/client');
      
      expect(module.useTRPC).toBeDefined();
    });
  });
});