# Developer Setup Guide

## Environment Setup

Before you begin, ensure that your Windows environment is properly set up with the necessary tools. Here's a checklist:

- **Node.js**: Required for running JavaScript on the server-side.
- **npm**: Node's package manager, used for managing JavaScript dependencies.
- **MySQL**: A relational database management system.
- **Git**: Version control system for tracking changes in source code.

### Initial Steps

1. **Install Required Software**:
   - Ensure `node`, `npm`, `mysql`, and `git` are installed on your system.
   - Verify the installations by running `node -v`, `npm -v`, `mysql --version`, and `git --version` in your command prompt.

2. **Run Setup Script**:
   - Execute the `setup_backend.ps1` PowerShell script to configure the backend.
   - **Important**: Before running the script, please read the [Setup Backend Instructions](./Setup.md) thoroughly. You will need to provide your MySQL configuration details during the setup.

## Git Configuration for Efficient Branch Management

To streamline the process of working with Git branches, especially when dealing with updates from the `develop` branch, use the following Git alias.

### Setting Up the `cleanbranch` Alias

```bash
git config --global alias.cleanbranch '!f() { git checkout origin/develop && git fetch && git pull origin develop && git checkout -b "$@" && git push -u origin "$@"; }; f'
```

#### What This Alias Does

- **Checks out `origin/develop`**:
  - Ensures you start from the latest state of the `develop` branch.
- **Fetches and Pulls from `origin/develop`**:
  - Updates your local `develop` branch with the latest changes from the remote.
- **Creates a New Branch**:
  - Generates a new branch with the name you specify.
- **Pushes the New Branch to Remote**:
  - Pushes the new branch to `origin` and sets up tracking, linking `origin/<branch-name>` with your local branch.

#### Usage Example

To create and push a new feature branch:
```bash
git cleanbranch feature/new-feature
```

This command creates a new branch named `feature/new-feature`, based on the latest updates from `develop`, and pushes it to the remote repository.

---