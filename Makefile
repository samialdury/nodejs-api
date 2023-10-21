.DEFAULT_GOAL ?= help

COMMIT_SHA ?= $(shell git rev-parse --short HEAD)
PROJECT_NAME ?= nodejs-api

RED ?= $(shell tput setaf 1)
GREEN ?= $(shell tput setaf 2)
YELLOW ?= $(shell tput setaf 3)
CYAN ?= $(shell tput setaf 6)
NC ?= $(shell tput sgr0)

BIN := node_modules/.bin

LOCAL_DIR ?= local
DEV_DIR ?= $(LOCAL_DIR)/dev
TEST_DIR ?= $(LOCAL_DIR)/test
SCRIPTS_DIR ?= $(LOCAL_DIR)/scripts
SRC_DIR ?= src
BUILD_DIR ?= build
CACHE_DIR ?= .cache

TEST_FILES ?= {src,test}/**/*.test.ts

MYSQL_SEEDS_DIR ?= seeds/mysql

PROXY_COMPOSE_FILE ?= $(LOCAL_DIR)/proxy.docker-compose.yml
DEV_COMPOSE_FILE ?= $(DEV_DIR)/dev.docker-compose.yml
TEST_COMPOSE_FILE ?= $(TEST_DIR)/test.docker-compose.yml

COMPOSE_PROXY ?= docker compose -f $(PROXY_COMPOSE_FILE)
COMPOSE_DEV ?= docker compose -f $(DEV_COMPOSE_FILE)
COMPOSE_TEST ?= docker compose -f $(TEST_COMPOSE_FILE)

RUN_IN_DOCKER ?= $(SCRIPTS_DIR)/run-cmd.sh
WAIT_UNTIL ?= $(SCRIPTS_DIR)/wait-until.sh

PINO_PRETTY ?= $(BIN)/pino-pretty --colorize

##@ Misc

.PHONY: help
help: ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-16s\033[0m  %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

# You can remove this target once you've ran it.
.PHONY: prepare
prepare: ## Prepare template (name=<string>)
	@node $(SCRIPTS_DIR)/prepare-template.js $(name)
	@rm -f $(SCRIPTS_DIR)/prepare-template.js

##@ Development

.PHONY: install
install: ## install all dependencies (skip-postinstall=<boolean>?)
	@pnpm install
ifeq ($(skip-postinstall),true)
	@echo "Skipping postinstall"
else
	@$(BIN)/husky install
endif

.PHONY: dev-support
dev-support: ## start the support services
	@$(COMPOSE_PROXY) up --detach --wait
	@$(COMPOSE_DEV) --profile support up --detach --wait

.PHONY: dev-prepare
dev-prepare: ## prepare the dev environment
	@echo "=== $(CYAN)preparing dev environment$(NC) ==="
	@echo
	@echo "=== $(CYAN)pulling & building docker images$(NC) ==="
	@$(COMPOSE_DEV) build app
	@$(COMPOSE_DEV) pull mysql
	@echo "=== $(GREEN)docker images ready$(NC) ==="
	@echo "=== $(CYAN)preparing docker network$(NC) ==="
	@docker network create $(PROJECT_NAME) || true
	@echo "=== $(GREEN)docker network ready$(NC) ==="
	@echo "=== $(CYAN)preparing database$(NC) ==="
	@$(COMPOSE_DEV) --profile support up --detach --wait
	@echo "=== $(GREEN)database ready$(NC) ==="
	@echo "=== $(CYAN)syncing DB schema$(NC) ==="
	@make db-push
	@echo "=== $(GREEN)DB schema synced$(NC) ==="
	@echo
	@echo "=== $(GREEN)dev environment ready$(NC) ==="

.PHONY: dev-local
dev-local: ## run TS and watch for changes
	@node --env-file $(DEV)/.dev.env --no-warnings --import tsx --watch --watch-preserve-output $(SRC_DIR)/main.ts | $(PINO_PRETTY)

.PHONY: dev
dev: ## run TS and watch for changes (Docker)
	@$(COMPOSE_DEV) --profile app up

.PHONY: run-local
run-local: ## run JS
	@node --env-file .env $(BUILD_DIR)/$(SRC_DIR)/main.js | $(PINO_PRETTY)

.PHONY: run
run: ## run JS (Docker)
	@$(RUN_IN_DOCKER) $(DEV_COMPOSE_FILE) 'make run-local'

##@ Database

.PHONY: db-push
db-push: ## sync database with the schema
	@$(RUN_IN_DOCKER) $(or $(compose), $(DEV_COMPOSE_FILE)) \
		'$(BIN)/drizzle-kit push:mysql'

.PHONY: db-seed
db-seed: ## run seed (name=<string>)
ifeq ($(name),)
	@echo "$(RED)name is required$(NC)"
	@exit 1
else
	@$(RUN_IN_DOCKER) $(or $(compose), $(DEV_COMPOSE_FILE)) \
		'node --env-file $(DEV)/.dev.env --no-warnings --import tsx $(MYSQL_SEEDS_DIR)/$(name).ts | $(PINO_PRETTY)'
endif

##@ Build

.PHONY: build
build: ## build the project
	@echo "=== $(YELLOW)cleaning build directory$(NC) ==="
	@rm -rf $(BUILD_DIR)
	@echo "=== $(CYAN)building project$(NC) (TS $$($(BIN)/tsc --version)) ==="
	@$(BIN)/tsc
	@echo "=== $(GREEN)build successful$(NC) ==="

.PHONY: build-image
build-image: ## build Docker image (args=<build args>?, tag=<string>?)
	@docker build $(args) --build-arg COMMIT_SHA='dev,$(COMMIT_SHA)' -t $(or $(tag), $(PROJECT_NAME)) . -f ./Dockerfile

##@ Test

.PHONY: test-prepare
test-prepare: ## prepare the test environment
	@echo "=== $(CYAN)preparing test environment$(NC) ==="
	@echo
	@echo "=== $(CYAN)pulling & building docker images$(NC) ==="
	@$(COMPOSE_TEST) build app
	@$(COMPOSE_TEST) pull mysql
	@echo "=== $(GREEN)docker images ready$(NC) ==="
	@echo "=== $(CYAN)preparing docker network$(NC) ==="
	@docker network create $(PROJECT_NAME) || true
	@echo "=== $(GREEN)docker network ready$(NC) ==="
	@echo "=== $(CYAN)preparing database$(NC) ==="
	@$(COMPOSE_TEST) --profile support up --detach --wait
	@echo "=== $(GREEN)database ready$(NC) ==="
	@echo "=== $(CYAN)syncing DB schema$(NC) ==="
	@make db-push compose=$(TEST_COMPOSE_FILE)
	@echo "=== $(GREEN)DB schema synced$(NC) ==="
	@echo
	@echo "=== $(GREEN)test environment ready$(NC) ==="

.PHONY: test-local
test-local: ## run tests
	@$(BIN)/glob -c 'node --env-file $(TEST_DIR)/.test.env --no-warnings --import tsx --test $(args)' '$(TEST_FILES)'

.PHONY: test-watch-local
test-watch-local: ## run tests and watch for changes
	@make test-local args='--watch --watch-preserve-output'

.PHONY: test
test: ## run tests (Docker)
	@$(RUN_IN_DOCKER) $(TEST_COMPOSE_FILE) 'make test-local'

.PHONY: test-watch
test-watch: ## run tests and watch for changes (Docker)
	@$(RUN_IN_DOCKER) $(TEST_COMPOSE_FILE) 'make test-watch-local'

##@ Code quality

.PHONY: format
format: ## format the code
	@echo "=== $(CYAN)running Prettier$(NC) ==="
	@$(BIN)/prettier --cache --cache-location=$(CACHE_DIR)/prettier --write --log-level warn .
	@echo "=== $(GREEN)format successful$(NC) ==="

.PHONY: lint
lint: ## lint the code
	@echo "=== $(CYAN)running ESLint$(NC) ==="
	@$(BIN)/eslint --max-warnings 0 --cache --cache-location $(CACHE_DIR)/eslint --fix .
	@echo "=== $(GREEN)lint successful$(NC) ==="

##@ CI

.PHONY: install-ci
install-ci: ## install all dependencies (CI)
	@pnpm install --frozen-lockfile

.PHONY: build-ci
build-ci: build ## build the project (CI)

.PHONY: test-ci
test-ci: ## run tests (CI)
	@echo "=== $(CYAN)preparing CI environment$(NC) ==="
	@node $(SCRIPTS_DIR)/prepare-ci-env.js
	@echo "=== $(GREEN)CI environment ready$(NC) ==="
	@echo
	@make test-prepare
	@echo
	@echo "=== $(CYAN)running tests$(NC) ==="
	@echo
	@make test
	@echo
	@echo "=== $(GREEN)tests ran successfully$(NC) ==="

.PHONY: format-ci
format-ci: ## format the code (CI)
	@echo "=== $(CYAN)running Prettier$(NC) ==="
	@$(BIN)/prettier --check --log-level warn .
	@echo "=== $(GREEN)format successful$(NC) ==="

.PHONY: lint-ci
lint-ci: ## lint the code (CI)
	@echo "=== $(CYAN)running ESLint$(NC) ==="
	@$(BIN)/eslint --max-warnings 0 .
	@echo "=== $(GREEN)lint successful$(NC) ==="

##@ Release

.PHONY: release
release: ## create a new release
	@$(BIN)/semantic-release
