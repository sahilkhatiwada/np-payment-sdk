# Continuous Integration (CI) Setup

This document describes the comprehensive CI/CD pipeline setup for the np-payment-sdk project.

## Overview

Our CI pipeline ensures code quality, security, and reliability through automated checks on every push and pull request.

## CI Workflows

### 1. Main CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches

**Jobs:**

#### Quality Check
- TypeScript type checking
- ESLint linting
- Security vulnerability scanning

#### Testing
- Runs tests across Node.js versions 18.x, 20.x, and 22.x
- Generates code coverage reports
- Uploads coverage to Codecov

#### Build Verification
- Builds the TypeScript project
- Verifies build artifacts
- Uploads build output as artifacts

#### Security & Dependencies
- Checks for outdated dependencies
- Runs comprehensive CI checks

### 2. CodeQL Security Analysis (`.github/workflows/codeql.yml`)

**Triggers:**
- Push to main branches
- Pull requests
- Weekly scheduled runs (Mondays at 2 AM)

**Features:**
- Static code analysis for security vulnerabilities
- JavaScript/TypeScript code scanning
- Automated security alerts

### 3. Dependabot (`.github/dependabot.yml`)

**Features:**
- Weekly dependency updates
- GitHub Actions updates
- Automated pull requests for security patches
- Proper labeling and assignment

## NPM Scripts

### Development Scripts
```bash
npm run build          # Build TypeScript to JavaScript
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Code Quality Scripts
```bash
npm run lint           # Run ESLint
npm run lint:fix       # Run ESLint with auto-fix
npm run type-check     # TypeScript type checking
npm run quality-check  # Run all quality checks
```

### CI/CD Scripts
```bash
npm run ci-check       # Complete CI validation
npm run pre-commit     # Pre-commit hook checks
npm run security-check # Security vulnerability audit
npm run check-deps     # Check for outdated dependencies
```

### Utility Scripts
```bash
npm run clean          # Clean build and coverage directories
```

## Pre-commit Hooks

We use Husky v9+ (modern format) to run pre-commit hooks that:
- Fix linting issues automatically
- Run TypeScript type checking
- Execute tests before allowing commits
- Uses the modern Husky configuration (no shell script headers)

## Coverage Requirements

The project maintains the following minimum coverage thresholds:
- **Branches:** 70%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up pre-commit hooks (Husky v9+ modern format):**
   ```bash
   npm run prepare
   ```

3. **Run quality checks:**
   ```bash
   npm run quality-check
   ```

4. **Run tests with coverage:**
   ```bash
   npm run test:coverage
   ```

## CI Status Badges

Add these badges to your README.md:

```markdown
[![CI](https://github.com/sahilkhatiwada/np-payment-sdk/workflows/CI/badge.svg)](https://github.com/sahilkhatiwada/np-payment-sdk/actions)
[![CodeQL](https://github.com/sahilkhatiwada/np-payment-sdk/workflows/CodeQL/badge.svg)](https://github.com/sahilkhatiwada/np-payment-sdk/actions)
[![codecov](https://codecov.io/gh/sahilkhatiwada/np-payment-sdk/branch/main/graph/badge.svg)](https://codecov.io/gh/sahilkhatiwada/np-payment-sdk)
```

## Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally:**
   - Check Node.js version compatibility
   - Ensure all dependencies are properly locked in package-lock.json

2. **Coverage threshold failures:**
   - Add more tests for uncovered code
   - Adjust thresholds in jest.config.js if necessary

3. **Linting errors:**
   - Run `npm run lint:fix` to auto-fix issues
   - Check ESLint configuration in eslint.config.js

4. **Security vulnerabilities:**
   - Run `npm audit fix` to fix automatically
   - Update dependencies manually if needed

## Best Practices

1. **Always run pre-commit checks locally:**
   ```bash
   npm run pre-commit
   ```

2. **Keep dependencies updated:**
   - Review Dependabot PRs regularly
   - Test thoroughly after dependency updates

3. **Monitor CI status:**
   - Fix failing builds immediately
   - Don't merge PRs with failing CI

4. **Security first:**
   - Address security alerts promptly
   - Regular security audits

## Contributing

Before submitting a PR:
1. Ensure all CI checks pass locally
2. Add tests for new features
3. Update documentation as needed
4. Follow the existing code style
