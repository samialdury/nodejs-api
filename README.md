<div align="center">

# Node.js API template

[![CI status](https://github.com/samialdury/nodejs-api/actions/workflows/ci.yml/badge.svg)](https://github.com/samialdury/nodejs-api/actions/workflows/ci.yml)
![license](https://img.shields.io/github/license/samialdury/nodejs-api)

Batteries-included Node.js API template with best practices in mind.

</div>

## Usage

This template is included in the [@samialdury/create](https://github.com/samialdury/create) CLI tool and it's the recommended way to use it.

```sh
bunx @samialdury/create nodejs-api
```

You can also create a new GitHub repository from this template directly by clicking [here](https://github.com/new?template_name=nodejs-api&template_owner=samialdury), and then running the following command in the root directory of the repository, replacing `your-project-name` with the name of your project.

```sh
# You should have pnpm installed globally
# prior to running these commands

make install
make prepare name=your-project-name
```

## Stack

- Node.js
- TypeScript
- ESLint
- Prettier
- Docker & Docker Compose
- GitHub Actions & GitHub Container Registry
- REST
- GraphQL
- PostgreSQL
- OAuth2 & JWT
- Pulumi IaC
- local HTTPS

## License

[MIT](LICENSE)
