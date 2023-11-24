# Backend

## How to run

To run the backend properly, please make sure that you've used the `setup_backend.ps1` script before, it will set you the database up before running the app, so you have no issues whilst running it.

To run the `node` server, you will have to manually run it like so for now, for instance, for classic start:
```ps1
npm start
```

## Check if it's runnning

You will see a log, once it boots up like so:
```bash
Server listening on port: 3333
```


### Examples Web Requests

Trying to send UTF-8 encoding based string to our server:
```ps1
> $body = '{"truc": "à la con"}'
> $encodedBody = [System.Text.Encoding]::UTF8.GetBytes($body)
> Invoke-WebRequest -Uri "http://localhost:3333/add_endpoint" -Method POST -ContentType "application/json" -Body $encodedBody
```

Returns:
```json
data received:  { truc: 'à la con' }
```