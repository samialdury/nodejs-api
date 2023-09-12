COMMIT_SHA ?= $(shell git rev-parse --short HEAD)
PROJECT_NAME ?= $(shell basename "$(PWD)")

RED ?= \033[0;31m
GREEN ?= \033[0;32m
YELLOW ?= \033[0;33m
CYAN ?= \033[0;36m
NC ?= \033[0m

BIN := node_modules/.bin

LOCAL_DIR ?= local
DEV_DIR ?= $(LOCAL_DIR)/dev
TEST_DIR ?= $(LOCAL_DIR)/test
SRC_DIR ?= src
BUILD_DIR ?= build
CACHE_DIR ?= .cache
MIGRATIONS_DIR ?= db/migrations

PROXY_COMPOSE_FILE ?= $(LOCAL_DIR)/proxy.docker-compose.yml
DEV_COMPOSE_FILE ?= $(DEV_DIR)/dev.docker-compose.yml
TEST_COMPOSE_FILE ?= $(TEST_DIR)/test.docker-compose.yml

COMPOSE_PROXY ?= docker compose -f $(PROXY_COMPOSE_FILE)
COMPOSE_DEV ?= docker compose -f $(DEV_COMPOSE_FILE)
COMPOSE_TEST ?= docker compose -f $(TEST_COMPOSE_FILE)

RUN_IN_DOCKER ?= $(LOCAL_DIR)/run-cmd.sh

# DATABASE_URL ?= postgres://nodejs-api:nodejs-api@localhost:5432/nodejs-api

.DEFAULT_GOAL ?= help

##@ Misc

.PHONY: help
help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

.PHONY: install
install: ## install all dependencies
	@pnpm install
	@$(BIN)/husky install

.PHONY: gql-gen
gql-gen: ## generate GraphQL types
	@$(BIN)/gql-gen --config codegen.ts

.PHONY: dev-local
dev-local: ## run TS and watch for changes
	@make gql-gen
	@node --env-file $(DEV)/.dev.env --no-warnings --loader tsx --watch --watch-preserve-output $(SRC_DIR)/main.ts | $(BIN)/pino-pretty

.PHONY: dev-docker
dev-docker: ## run TS and watch for changes
	@make gql-gen
	@node --no-warnings --loader tsx --watch --watch-preserve-output $(SRC_DIR)/main.ts | $(BIN)/pino-pretty --colorize

.PHONY: up-proxy
up-proxy: ## start the proxy
	@$(COMPOSE_PROXY) --profile support up -d

.PHONY: up-support
up-support: ## start the support services
	@$(COMPOSE_DEV) --profile support up -d

.PHONY: up-app
up-app: ## start the development environment (app services)
	@$(COMPOSE_DEV) --profile app up

.PHONY: run
run: ## run JS
	@$(RUN_IN_DOCKER) 'node --env-file .env $(BUILD_DIR)/$(SRC_DIR)/main.js | $(BIN)/pino-pretty --colorize'

##@ Migrations

.PHONY: migrate-new
migrate-new: ## create a new migration (name=<string>)
	@$(RUN_IN_DOCKER) 'migrate create -ext sql -dir $(MIGRATIONS_DIR) $(name)'

.PHONY: migrate-up
migrate-up: ## run migrations up (compose=<string>, n=<int>)
	@$(RUN_IN_DOCKER) $(or $(compose), $(DEV_COMPOSE_FILE)) \
		'migrate -path $(MIGRATIONS_DIR) -database $$DATABASE_URL up $(n)'

.PHONY: migrate-down
migrate-down: ## run migrations down (compose=<string>, n=<int>)
	@$(RUN_IN_DOCKER) $(or $(compose), $(DEV_COMPOSE_FILE)) \
		'migrate -path $(MIGRATIONS_DIR) -database $$DATABASE_URL down $(n)'

.PHONY: migrate-drop
migrate-drop: ## drop the database schema (compose=<string>)
	@$(RUN_IN_DOCKER) $(or $(compose), $(DEV_COMPOSE_FILE)) \
		'migrate -path $(MIGRATIONS_DIR) -database $$DATABASE_URL drop'

.PHONY: migrate-force
migrate-force: ## force migration version (compose=<string>, v=<string>)
	@$(RUN_IN_DOCKER) $(or $(compose), $(DEV_COMPOSE_FILE)) \
		'migrate -path $(MIGRATIONS_DIR) -database $$DATABASE_URL force $(v)'

.PHONY: migrate-version
migrate-version: ## print current migration version (compose=<string>)
	@$(RUN_IN_DOCKER) $(or $(compose), $(DEV_COMPOSE_FILE)) \
		'migrate -path $(MIGRATIONS_DIR) -database $$DATABASE_URL version'

##@ Build

.PHONY: build
build: ## build the project
	@rm -rf $(BUILD_DIR)
	@$(BIN)/tsc
	@cp ./schema.gql $(BUILD_DIR)/schema.gql

.PHONY: build-image
build-image: ## build Docker image (args=<build args>, tag=<string>)
	@docker build $(args) --build-arg COMMIT_SHA='dev,$(COMMIT_SHA)' -t $(or $(tag), $(PROJECT_NAME)) . -f ./Dockerfile

##@ Test

.PHONY: test-prepare
test-prepare: ## prepare the test environment
	@echo "=== $(CYAN)preparing test environment$(NC) ==="
	@echo
	@echo "=== $(CYAN)preparing docker network$(NC) ==="
	@docker network create $(PROJECT_NAME) || true
	@echo "=== $(GREEN)docker network ready$(NC) ==="
	@echo
	@echo "=== $(CYAN)preparing database$(NC) ==="
	@$(COMPOSE_TEST) --profile support up -d
	@echo "=== $(CYAN)waiting for database to accept connections$(NC) ==="
	@sleep 10
	@echo "=== $(GREEN)database ready$(NC) ==="
	@echo
	@echo "=== $(CYAN)running migrations$(NC) ==="
	@make migrate-up compose=$(TEST_COMPOSE_FILE)
	@echo "=== $(GREEN)migrations ready$(NC) ==="
	@echo
	@echo "=== $(GREEN)preparing test environment done$(NC) ==="

.PHONY: test
test: ## run tests
	@$(RUN_IN_DOCKER) $(TEST_COMPOSE_FILE) '$(BIN)/glob -c "node --env-file .test.env --no-warnings --loader tsx --test" "{src,test}/**/*.test.ts"'

.PHONY: test-watch
test-watch: ## run tests and watch for changes
	@$(RUN_IN_DOCKER) $(TEST_COMPOSE_FILE) '$(BIN)/glob -c "node --env-file .test.env --no-warnings --loader tsx --watch --watch-preserve-output --test" "{src,test}/**/*.test.ts"'

##@ Code quality

.PHONY: format
format: ## format the code
	@$(BIN)/prettier --cache --cache-location=$(CACHE_DIR)/prettier --write .

.PHONY: lint
lint: ## lint the code
	@$(BIN)/eslint --max-warnings 0 --cache --cache-location $(CACHE_DIR)/eslint --fix .

##@ CI

.PHONY: install-ci
install-ci: ## install all dependencies (CI)
	@pnpm install --frozen-lockfile

.PHONY: build-ci
build-ci: build ## build the project (CI)

.PHONY: test-ci
test-ci: ## run tests (CI)
	make test-prepare
	make test

.PHONY: format-ci
format-ci: ## format the code (CI)
	@$(BIN)/prettier --check .

.PHONY: lint-ci
lint-ci: ## lint the code (CI)
	@$(BIN)/eslint --max-warnings 0 .

##@ Release

.PHONY: release
release: ## create a new release
	@$(BIN)/semantic-release
