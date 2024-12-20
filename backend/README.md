# Sport bet real-time - Backend

#### This backend project uses:
- Node + TypeScript + Express
- Prisma/postgresql for database
- Socket.io for web sockets


### Environment variables
.env
```dotenv
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNmFiMTkxMTgtNTgzOS00MTVmLTkxMzctZTY4ZDMyMjFmNmU2IiwidGVuYW50X2lkIjoiNDEzMDQ5YjFhYjZjMTU4Zjg3ZDJmYTk2MjZhNGRjZjVhMDZiYTM1MzMwMTMyNjA2NzAzNWUxZjM0ZTI0ZWE3ZCIsImludGVybmFsX3NlY3JldCI6ImNlYmMzNzBkLTZjZWUtNGRhMy05MGM1LTc0MTk5ZmFjMzMwNiJ9.jmeg_x1DmLB70PrHZXSDrDToR2Av4mbRZGPLryf2XOA"
PULSE_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNmFiMTkxMTgtNTgzOS00MTVmLTkxMzctZTY4ZDMyMjFmNmU2IiwidGVuYW50X2lkIjoiNDEzMDQ5YjFhYjZjMTU4Zjg3ZDJmYTk2MjZhNGRjZjVhMDZiYTM1MzMwMTMyNjA2NzAzNWUxZjM0ZTI0ZWE3ZCIsImludGVybmFsX3NlY3JldCI6ImNlYmMzNzBkLTZjZWUtNGRhMy05MGM1LTc0MTk5ZmFjMzMwNiJ9.jmeg_x1DmLB70PrHZXSDrDToR2Av4mbRZGPLryf2XOA"
JWT_SECRET=some_secret
```

### How to run

- Ensure the env is added
- run `npm install`
- run `npm run dev`

