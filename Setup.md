# Setup

## Database setup

There is a script `setup_backend.ps1` that will set you up (Database) on windows and export a .env for you to have the app ready to use, simple follow the syntax here:
```ps1
.\setup_backend.ps1 -dbH "localhost" -dbU "MYSQL_IDENTIFIER" -dbP "MYSQL_PASSWORD"
```