# ch_meetings_server

A graphql server/ Postgres database managing the scheduling process for business training workshops

### Core Dependencies

- [apollo-server-express] - express implementation of the Apollo graphql server
- [type-graphql] - class/ decorator-based implementation of graphql
- [prisma] - type-safe ORM with DB introspection
- [ioredis] - redis for login caching
- [argon2]- encryption library

[apollo-server-express]: https://www.npmjs.com/package/apollo-server-express
[type-graphql]: https://typegraphql.com/
[prisma]: https://www.prisma.io/
[ioredis]: https://www.npmjs.com/package/ioredis
[argon2]: https://www.npmjs.com/package/argon2
