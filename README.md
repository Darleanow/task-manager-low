# For devs

## Setup your environment

Make sure you have `node`, `npm`, `mysql`, `git` installed, make also sure you're on windows.

You can then run the `setup_backend.ps1` script, make sure to read the [Setup backend instructions](./Setup.md) before running it as you need to provide your mysql configuration.

Then, you can enter the following command to create clean branches from `origin/develop`:

```bash
git config --global alias.cleanbranch '!f() { git checkout origin/develop && git fetch && git pull origin develop && git checkout -b "$@" && git push -u origin "$@"; }; f'
```

**Basically, this alias does the following**:

- Checks out origin/develop: This ensures you are starting from the latest state of the develop branch.

- Fetches and Pulls from origin/develop: This updates your local develop branch with the latest changes from the remote.

- Creates a New Branch: It creates a new branch with the name you provide.

- Pushes the New Branch to Remote: It then pushes the newly created branch to the remote repository (origin) and sets up tracking, so origin/<branch-name> is linked to your local branch.

**Usage**:
`git cleanbranch feature/new-feature`
