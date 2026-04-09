.PHONY: help up down restart logs build api-test webapp-test lint typecheck

# Colors
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m

help: ## Show available commands
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

up: ## Start full stack (API, webapp, MongoDB, nginx, mongo-express)
	@echo "$(GREEN)Starting Mentorix stack...$(NC)"
	@docker compose up --build -d
	@echo "$(GREEN)✅ Stack started$(NC)"
	@echo "$(YELLOW)Webapp: http://localhost:5173$(NC)"
	@echo "$(YELLOW)API:    http://localhost:3000/api/v1/health$(NC)"
	@echo "$(YELLOW)Mongo Express: http://localhost:8081$(NC)"

down: ## Stop all containers
	@echo "$(GREEN)Stopping containers...$(NC)"
	@docker compose down
	@echo "$(GREEN)✅ Containers stopped$(NC)"

restart: ## Restart all containers
	@echo "$(GREEN)Restarting containers...$(NC)"
	@docker compose restart
	@echo "$(GREEN)✅ Containers restarted$(NC)"

logs: ## View container logs
	@docker compose logs -f

build: ## Rebuild all containers
	@echo "$(GREEN)Rebuilding containers...$(NC)"
	@docker compose build --no-cache
	@echo "$(GREEN)✅ Containers rebuilt$(NC)"

api-test: ## Run API tests
	@echo "$(GREEN)Running API tests...$(NC)"
	@docker exec -it mentorix_api npm run test
	@echo "$(GREEN)✅ API tests completed$(NC)"

api-test-cov: ## Run API tests with coverage
	@echo "$(GREEN)Running API tests with coverage...$(NC)"
	@docker exec -it mentorix_api npm run test:cov
	@echo "$(GREEN)✅ API tests with coverage completed$(NC)"

api-test-e2e: ## Run API E2E tests
	@echo "$(GREEN)Running API E2E tests...$(NC)"
	@docker exec -it mentorix_api npm run test:e2e
	@echo "$(GREEN)✅ API E2E tests completed$(NC)"

webapp-test: ## Run webapp tests
	@echo "$(GREEN)Running webapp tests...$(NC)"
	@docker exec -it mentorix_webapp npm run test
	@echo "$(GREEN)✅ Webapp tests completed$(NC)"

lint: ## Run linters on both API and webapp
	@echo "$(GREEN)Running API lint...$(NC)"
	@docker exec -it mentorix_api npm run lint
	@echo "$(GREEN)Running webapp lint...$(NC)"
	@docker exec -it mentorix_webapp npm run lint
	@echo "$(GREEN)✅ All linters passed$(NC)"

typecheck: ## Run typecheck on both API and webapp
	@echo "$(GREEN)Running API typecheck...$(NC)"
	@docker exec -it mentorix_api npm run typecheck
	@echo "$(GREEN)Running webapp typecheck...$(NC)"
	@docker exec -it mentorix_webapp npm run typecheck
	@echo "$(GREEN)✅ Typecheck passed$(NC)"
