up:
	$(call check-env-prod)
	docker compose -f docker-compose.prod.yaml $@ --build -d $(filter-out $@,$(MAKECMDGOALS))

down:
	docker compose -f docker-compose.prod.yaml $@ $(filter-out $@,$(MAKECMDGOALS))

dup:
	docker compose -f docker-compose.dev.yaml $@ --build -d $(filter-out $@,$(MAKECMDGOALS))

ddown:
	docker compose -f docker-compose.dev.yaml $@ $(filter-out $@,$(MAKECMDGOALS))

frontend backend nginx postgres:
	@echo "🚀 Starting $@"