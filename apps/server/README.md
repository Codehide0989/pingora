# Pingora Server

## Tech

- Bun
- HonoJS

## Deploy

From root

```bash
flyctl deploy --config apps/server/fly.toml --dockerfile  apps/server/Dockerfile
```

## Docker

The Dockerfile is generated thanks to [Dofigen](https://github.com/lenra-io/dofigen). To generate the Dockerfile, run the following command from the `apps/server` directory:

```bash
# Update the dependent image versions
dofigen update
# Generate the Dockerfile
dofigen gen
```

Build the docker image locally

```bash
docker build . -t registry.fly.io/pingora-docker:pingora-docker-v0  --file  ./apps/server/Dockerfile --platform linux/amd64
```

if you want to run the docker image locally

```bash
docker run -p 3000:3000  registry.fly.io/pingora-docker:pingora-docker-v0
```

Push to Fly Registry

```bash
docker push registry.fly.io/pingora-docker:pingora-docker-v0

```

Deploy to Fly

```bash
flyctl deploy --app pingora-docker \
  --image registry.fly.io/pingora-docker:pingora-docker-v0
```
