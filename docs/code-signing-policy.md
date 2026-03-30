# Code Signing Policy

## Overview

This project uses free code signing provided by **SignPath.io**, with a certificate issued by the **SignPath Foundation**.

We are committed to providing secure and trustworthy software to our users through cryptographic code signing of all release binaries.

## Team Roles and Members

The following roles are responsible for managing code signing and releases:

- **Maintainers & Committers**: [halfacandan](https://github.com/halfacandan)
- **Release Approvers**: [halfacandan](https://github.com/halfacandan)

## Privacy Policy

In order to use this tool, you must [Join a ladder on poeladder.com](https://poeladder.com/guide#Joining_a_Ladder). Please see [PoE Ladder's Privacy Policy](https://poeladder.com/faqs#How_does_the_site_use_data_taken_from_my_Path_of_Exile_Account) for further details.

### Additional Privacy Considerations

This application may fetch data from:
- **poeladder.com**: User account and progression data is retrieved only when explicitly requested by the user via the application interface
- **GitHub**: Release information may be checked during updates (as configured in electron-store)

No personal data are collected, stored, or transmitted by this application.

### Third-Party Dependencies

This project includes the following open-source dependencies:
- **Electron**: [MIT License](https://github.com/electron/electron/blob/main/LICENSE)
- **electron-builder**: [MIT License](https://github.com/electron-userland/electron-builder/blob/master/LICENSE)
- **electron-store**: [MIT License](https://github.com/sindresorhus/electron-store/blob/main/license)

Users should review the privacy policies of these projects as needed.


## Artifact Configuration & Metadata Requirements

All signed Windows binaries (installer and uninstaller) are configured with the following metadata:

### Product Name
- **Product Name**: PoE Ladder Desktop
- **Internal Name**: poe-ladder-desktop

### Version Management
- **Product Version**: Matches the version specified in `package.json`
- **File Version**: Synchronized with each build release

### File Metadata Restrictions
All signed artifacts enforce the following restrictions:
- Executable installers must include valid product name metadata
- Version attributes must be consistent across all signed binaries in a release
- Only release artifacts built through the automated GitHub Actions pipeline are signed
- Upstream open-source project binaries (Electron, etc.) are not re-signed but may be included in signed packages

## Signing Process

Releases are automatically signed through the GitHub Actions CI/CD pipeline when code is pushed to the main branch. The process:

1. Code is committed and pushed to the `main` branch
2. GitHub Actions workflow triggers the build process
3. Binaries are compiled and packaged
4. SignPath.io signs the Windows installer and uninstaller
5. Signed artifacts are released to GitHub Releases

This automated process ensures consistency and security in all releases.

## Questions and Feedback

For questions about this code signing policy, please open an issue on the [GitHub repository](https://github.com/halfacandan/PoELadderDesktop).
