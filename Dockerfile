ARG NODE_VERSION=20
ARG PNPM_VERSION=8
ARG TINI_VERSION="v0.19.0"
ARG WORK_DIR="/app"

ARG COMMIT_SHA="unknown"

ARG LOG_LEVEL="info"
ARG PROJECT_NAME="nodejs-project"
ARG PORT=8080

################################################################
#                                                              #
#                     Prepare alpine image                     #
#                                                              #
################################################################

FROM node:${NODE_VERSION}-alpine as node-alpine

ARG PNPM_VERSION
ARG TINI_VERSION

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini

RUN chmod +x /tini
RUN apk --no-cache add curl
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN npm install --global pnpm@${PNPM_VERSION}

################################################################
#                                                              #
#                   Prepare distroless image                   #
#                                                              #
################################################################

FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian11:nonroot as node-distroless

################################################################
#                                                              #
#        Install all dependencies and build TypeScript         #
#                                                              #
################################################################

FROM node-alpine as build-js

ARG WORK_DIR

WORKDIR ${WORK_DIR}

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN pnpm fetch

COPY tsconfig.base.json tsconfig.base.json
COPY tsconfig.prod.json tsconfig.prod.json
COPY src src
COPY schema.gql schema.gql

RUN pnpm install --offline --frozen-lockfile
RUN ./node_modules/.bin/tsc --project ./tsconfig.prod.json
RUN cp schema.gql build/schema.gql

################################################################
#                                                              #
#  Install only production dependencies & prune unused files   #
#                                                              #
################################################################

FROM node-alpine as install-prod-deps

ARG WORK_DIR

WORKDIR ${WORK_DIR}

ENV NODE_ENV="production"

COPY --from=build-js ${WORK_DIR}/package.json package.json
COPY --from=build-js ${WORK_DIR}/pnpm-lock.yaml pnpm-lock.yaml

RUN pnpm fetch
RUN pnpm install --offline --frozen-lockfile --prod
RUN node-prune

################################################################
#                                                              #
#             Copy only necessary data for runtime             #
#                                                              #
################################################################

FROM node-distroless as final

ARG WORK_DIR
ARG COMMIT_SHA
ARG LOG_LEVEL
ARG PROJECT_NAME
ARG PORT

WORKDIR ${WORK_DIR}

ENV NODE_OPTIONS="--enable-source-maps"
ENV NODE_ENV="production"
ENV COMMIT_SHA=${COMMIT_SHA}
ENV LOG_LEVEL=${LOG_LEVEL}
ENV PROJECT_NAME=${PROJECT_NAME}
ENV PORT=${PORT}

COPY --from=node-alpine --chown=nonroot:nonroot /tini /tini

COPY --from=build-js --chown=nonroot:nonroot ${WORK_DIR}/package.json package.json
COPY --from=build-js --chown=nonroot:nonroot ${WORK_DIR}/build build

COPY --from=install-prod-deps --chown=nonroot:nonroot ${WORK_DIR}/node_modules node_modules

USER nonroot:nonroot

ENTRYPOINT ["/tini", "--"]

EXPOSE ${PORT}

CMD ["/nodejs/bin/node", "./build/src/main.js"]
