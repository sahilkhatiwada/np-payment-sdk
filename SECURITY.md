# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email the maintainer directly at: [sahilkhatiwada@example.com]
3. Include detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Known Security Issues

### Current Dependencies with Vulnerabilities

The following dependencies have known security vulnerabilities that are currently being tracked:

#### Critical Vulnerabilities
- **request** (transitive dependency)
  - Status: No fix available
  - Impact: Used in test dependencies only
  - Mitigation: Not used in production code

#### Moderate Vulnerabilities
- **tough-cookie** < 4.1.3
  - Issue: Prototype Pollution vulnerability
  - Status: No fix available from upstream
  - Impact: Used in test dependencies only
  - Mitigation: Not used in production code

### Security Measures

1. **Dependency Scanning**: Automated dependency vulnerability scanning via Dependabot
2. **Code Analysis**: Static code analysis via CodeQL
3. **Regular Audits**: Weekly security audits in CI/CD pipeline
4. **Minimal Dependencies**: We keep production dependencies to a minimum

### Security Best Practices

When using this SDK:

1. **Environment Variables**: Never commit API keys or secrets to version control
2. **HTTPS Only**: Always use HTTPS in production
3. **Input Validation**: Validate all user inputs before processing
4. **Error Handling**: Don't expose sensitive information in error messages
5. **Regular Updates**: Keep the SDK updated to the latest version

### Reporting Security Issues

We take security seriously. If you find a security issue:

1. Email us immediately
2. Provide detailed reproduction steps
3. Include the affected version
4. Suggest a fix if possible

### Security Response Timeline

- **Initial Response**: Within 24 hours
- **Assessment**: Within 72 hours
- **Fix Development**: Within 1 week for critical issues
- **Release**: As soon as fix is tested and verified

## Security Contact

For security-related inquiries, contact:
- Email: [security@example.com]
- GPG Key: [Optional - provide GPG key for encrypted communication]

## Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities. Contributors will be acknowledged in our security advisories (with permission).
