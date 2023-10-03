ARG NODE_VERSION=20
ARG WORK_DIR="/app"
# https://github.com/krallin/tini
ARG TINI_VERSION="v0.19.0"

FROM node:${NODE_VERSION}-alpine

ARG WORK_DIR
ARG TINI_VERSION

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini

RUN apk add --no-cache curl make

WORKDIR ${WORK_DIR}

ENTRYPOINT ["/tini", "--"]
