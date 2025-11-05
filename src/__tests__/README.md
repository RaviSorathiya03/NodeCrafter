# Test Suite

This directory contains comprehensive unit tests for the tRPC setup in this Next.js application.

## Test Structure

- `setup.ts` - Global test configuration and mocks
- `trpc/` - Tests for tRPC initialization, routers, and utilities
  - `init.test.ts` - tRPC initialization and context
  - `query-client.test.ts` - React Query client configuration
  - `client.test.tsx` - Client-side tRPC provider
  - `routers/_app.test.ts` - App router and procedures
- `app/` - Tests for API routes
  - `api/trpc/route.test.ts` - tRPC API route handler

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- init.test.ts

# Run tests matching a pattern
npm test -- --grep "tRPC"
```

## Test Coverage

The test suite covers:

### 1. tRPC Initialization (`trpc/init.test.ts`)
- Context creation and caching with React's `cache()` function
- Router and procedure exports
- Configuration validation
- Procedure chaining capabilities
- Type safety verification

### 2. Query Client (`trpc/query-client.test.ts`)
- QueryClient instantiation
- Configuration options:
  - `staleTime` set to 30 seconds
  - Dehydration configuration for SSR
  - Hydration configuration
- Query management (invalidation, prefetching)
- Instance isolation between calls

### 3. App Router (`trpc/routers/_app.test.ts`)
- Router structure and procedures
- Database interaction through mocked Prisma client
- Error handling for database failures
- Data validation and structure verification
- Edge cases:
  - Empty results
  - Null values
  - Large datasets (1000+ records)
- Type safety with AppRouter type export

### 4. Client Provider (`trpc/client.test.tsx`)
- Provider rendering with multiple children
- Environment-specific behavior:
  - Browser: Reuses query client across renders
  - Server: Creates new query client per request
- URL generation:
  - Browser: Empty string (relative URLs)
  - Server with VERCEL_URL: Uses Vercel URL
  - Server without VERCEL_URL: Defaults to localhost:3000
- Module exports verification

### 5. API Route Handler (`app/api/trpc/route.test.ts`)
- GET/POST handler exports
- Handler unification (same function for both methods)
- Request handling:
  - Different paths
  - Query parameters
  - Headers
- Error propagation
- Configuration validation:
  - Correct endpoint path
  - Router integration
  - Context creation

## Mocking Strategy

### Prisma
Mocked at the module level using Vitest's `vi.mock()` to avoid database dependencies:
```typescript
const mockFindMany = vi.fn();
vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findMany: mockFindMany,
    },
  },
}));
```

### Next.js
Router and navigation mocked in `setup.ts` for all tests:
- `useRouter` - Mocked with common router methods
- `usePathname` - Returns root path
- `useSearchParams` - Returns empty URLSearchParams

### Server/Client Modules
- `server-only` - Mocked as empty object
- `client-only` - Mocked as empty object

This allows testing in both server and client contexts without errors.

## Best Practices

1. **Isolation**: Tests are isolated and don't depend on each other
2. **Focus**: Each test file focuses on a single module
3. **Cleanup**: Mocks are cleared before each test using `beforeEach`
4. **Coverage**: Both happy paths and error cases are covered
5. **Edge Cases**: Tests include:
   - Null/undefined values
   - Empty arrays
   - Large datasets
   - Malformed input
   - Network errors
6. **Descriptive Names**: Test names clearly communicate intent
7. **Type Safety**: Tests verify TypeScript type exports and inference

## Writing New Tests

When adding new tRPC procedures or routes:

1. Create a test file following the naming convention: `*.test.ts` or `*.test.tsx`
2. Place it in the appropriate directory under `src/__tests__/`
3. Mock external dependencies at the module level
4. Use `describe` blocks to group related tests
5. Clear mocks in `beforeEach` to ensure test isolation
6. Test happy paths, error cases, and edge cases
7. Verify type safety where applicable

Example test structure:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/some/module', () => ({
  someFunction: vi.fn(),
}));

describe('Feature Name', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Functionality Group', () => {
    it('should do something', async () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = await functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

## CI/CD Integration

To run tests in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## Troubleshooting

### Tests failing due to module imports
- Ensure all external modules are properly mocked
- Check that path aliases (`@/*`) are configured in `vitest.config.ts`

### Tests passing locally but failing in CI
- Clear node_modules and package-lock.json, then reinstall
- Ensure environment variables are set correctly

### Type errors in tests
- Make sure `@types/*` packages are installed
- Check TypeScript configuration in `tsconfig.json`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [tRPC Testing Guide](https://trpc.io/docs/server/testing)
- [Next.js Testing](https://nextjs.org/docs/testing)