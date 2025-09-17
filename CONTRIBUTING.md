# Contributing to Serpstat MCP Server

Thank you for your interest in contributing to the Serpstat MCP Server JS! We welcome contributions from the community and are excited to see what you'll bring to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git
- Valid Serpstat API token (for testing)
- Basic understanding of TypeScript and MCP (Model Context Protocol)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/serpstat-mcp-server-js.git
   cd serpstat-mcp-server-js
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/SerpstatGlobal/serpstat-mcp-server-js.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Serpstat API token
   ```

5. **Build and test**
   ```bash
   npm run build
   npm test
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes** - Fix existing issues
- **New features** - Add new MCP tools or enhance existing ones
- **Documentation** - Improve README, add examples, write tutorials
- **Tests** - Add test coverage for existing functionality
- **Performance improvements** - Optimize API calls, reduce latency
- **Code quality** - Refactoring, type safety improvements

### Before You Start

1. **Check existing issues** - Look for existing issues or discussions
2. **Create an issue first** - For significant changes, create an issue to discuss the approach
3. **Keep changes focused** - One feature/fix per pull request
4. **Follow project conventions** - Use existing patterns and styles

## Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/amazing-new-tool
# or
git checkout -b fix/api-error-handling
# or  
git checkout -b docs/update-examples
```

### 2. Make Your Changes

- Write clean, well-commented code
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run specific tests
npm test -- --testNamePattern="your-test-name"

# Run linting
npm run lint

# Build to ensure no compilation errors
npm run build
```

### 4. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add keyword difficulty analysis tool"
git commit -m "fix: handle rate limit errors gracefully"
git commit -m "docs: update installation instructions"
git commit -m "test: add unit tests for domain tools"
```

**Commit message format:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Adding or updating tests
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/amazing-new-tool
```

Then create a pull request on GitHub with:
- Clear title describing the change
- Detailed description of what was changed and why
- Reference to any related issues
- Screenshots/examples if applicable

## Coding Standards

### TypeScript Guidelines

- **Use strict TypeScript** - Enable strict mode in tsconfig.json
- **Define proper types** - Avoid `any`, create interfaces for API responses
- **Use Zod for validation** - All input parameters should use Zod schemas
- **Export types** - Make types available for reuse

```typescript
// Good: Proper typing with Zod validation
export const getDomainInfoSchema = z.object({
  domains: z.array(z.string().min(1)),
  se: z.string().default('g_us'),
  filters: z.object({
    limit: z.number().min(1).max(1000).optional()
  }).optional()
});

export type GetDomainInfoParams = z.infer<typeof getDomainInfoSchema>;
```

### Code Style

- **Use Prettier** - Code formatting is handled automatically
- **ESLint compliance** - Follow the existing ESLint configuration
- **Consistent naming** - Use camelCase for variables, PascalCase for types
- **Clear function names** - Use descriptive names that explain what the function does

```typescript
// Good
async function validateAndExecuteDomainAnalysis(params: DomainAnalysisParams): Promise<DomainData[]>

// Bad
async function doStuff(p: any): Promise<any>
```

### File Organization

```
src/
├── handlers/           # MCP tool handlers
│   ├── domain_tools.ts
│   ├── keyword_tools.ts
│   └── backlink_tools.ts
├── services/          # Serpstat API services
│   ├── serpstat_client.ts
│   └── api_types.ts
├── types/             # Shared TypeScript types
├── utils/             # Utilities (config, logger, validation)
└── __tests__/         # Test files mirroring src structure
```

## Testing Guidelines

### Writing Tests

- **Test new functionality** - All new features must have tests
- **Use Jest** - Follow existing Jest patterns
- **Mock external APIs** - Mock Serpstat API calls in tests
- **Test edge cases** - Include error handling and validation tests

```typescript
// Example test structure
describe('getDomainInfo', () => {
  it('should return domain information for valid input', async () => {
    // Arrange
    const mockApiResponse = { /* mock data */ };
    jest.spyOn(serpstatClient, 'post').mockResolvedValue(mockApiResponse);
    
    // Act
    const result = await getDomainInfo({ domains: ['example.com'], se: 'g_us' });
    
    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it('should handle API errors gracefully', async () => {
    // Test error scenarios
  });
});
```

### Test Categories

- **Unit tests** - Test individual functions and methods
- **Integration tests** - Test MCP tool handlers end-to-end
- **Validation tests** - Test Zod schema validation
- **Error handling tests** - Test API error scenarios

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/__tests__/services/keyword_tools.test.ts

# Run tests with coverage
npm test -- --coverage
```

## Documentation

### Code Documentation

- **JSDoc comments** - Document public functions and complex logic
- **README updates** - Update README.md for new features
- **Type documentation** - Document complex types and interfaces

```typescript
/**
 * Retrieves comprehensive domain information including SEO metrics
 * @param params - Domain analysis parameters
 * @param params.domains - Array of domain names to analyze
 * @param params.se - Search engine code (default: 'g_us')
 * @returns Promise resolving to array of domain data
 * @throws {ValidationError} When input parameters are invalid
 * @throws {SerpstatAPIError} When Serpstat API returns an error
 */
export async function getDomainInfo(params: GetDomainInfoParams): Promise<DomainData[]>
```

### Examples and Usage

- **Update usage examples** - Add examples for new tools
- **Error handling examples** - Show how to handle different error types
- **Configuration examples** - Provide clear setup instructions

## Issue Guidelines

### Reporting Bugs

Use our bug report template and include:
- Clear reproduction steps
- Environment information (Node.js version, OS, MCP client)
- Error messages and logs
- Expected vs actual behavior

### Suggesting Features

- Check existing issues and discussions first
- Provide clear use cases and examples
- Consider implementation complexity and maintenance burden
- Align with project goals (SEO analysis via MCP)

### Questions and Support

- Use GitHub Discussions for questions
- Check existing documentation first
- For Serpstat API issues, contact Serpstat support directly

## Community

### Communication Channels

- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - Questions, ideas, general discussion
- **Pull Requests** - Code review and collaboration

### Review Process

1. **Automated checks** - CI must pass (tests, linting, build)
2. **Code review** - At least one maintainer review required
3. **Testing** - Verify functionality works as expected
4. **Documentation** - Check that docs are updated if needed

### Getting Help

- Read existing documentation and code
- Search existing issues and discussions
- Ask specific questions with context
- Be patient and respectful

## Recognition

Contributors are recognized in several ways:
- Listed in package.json contributors field
- Mentioned in release notes for significant contributions
- GitHub contributor statistics

## Development Tips

### Working with Serpstat API

- **Respect rate limits** - Most plans have 1 RPS limit
- **Use mock data in tests** - Avoid hitting API during development
- **Handle errors gracefully** - API may return various error types
- **Cache responses locally** - For development/testing efficiency

### MCP Integration

- **Follow MCP spec** - Ensure compatibility with MCP protocol
- **Test with multiple clients** - Claude Desktop, Gemini CLI, etc.
- **Validate tool schemas** - Ensure proper parameter validation
- **Handle transport errors** - stdio transport can fail

### Performance Considerations

- **Minimize API calls** - Batch requests where possible
- **Efficient data structures** - Use appropriate types for large datasets
- **Memory management** - Handle large API responses efficiently
- **Logging optimization** - Use appropriate log levels

## Questions?

If you have questions about contributing, feel free to:
- Open a GitHub Discussion
- Comment on relevant issues
- Reach out to maintainers

Thank you for contributing to Serpstat MCP Server JS! 🚀
