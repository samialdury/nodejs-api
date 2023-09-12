ARG NODE_VERSION=20
ARG WORK_DIR="/app"
# https://github.com/krallin/tini
ARG TINI_VERSION="v0.19.0"
# https://github.com/golang-migrate/migrate
ARG MIGRATE_VERSION="v4.16.2"

FROM node:${NODE_VERSION}-alpine

# https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG TARGETPLATFORM

ARG WORK_DIR
ARG TINI_VERSION
ARG MIGRATE_VERSION

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

RUN apk add --no-cache curl make

WORKDIR ${WORK_DIR}

RUN curl -L https://github.com/golang-migrate/migrate/releases/download/${MIGRATE_VERSION}/migrate.$(echo ${TARGETPLATFORM} | sed 's/\//-/g').tar.gz | tar xvz -C /tmp
RUN mv /tmp/migrate /bin/migrate
RUN chmod +x /bin/migrate

ENTRYPOINT ["/tini", "--"]
