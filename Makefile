.DEFAULT_GOAL := all

include config/makefile/vars.mk
include config/makefile/colors.mk
include config/makefile/functions.mk

up:
	$(call check-env)
	docker compose -f docker-compose.prod.yaml $@ --build -d $(filter-out $@,$(MAKECMDGOALS))

down:
	docker compose -f docker-compose.prod.yaml $@ $(filter-out $@,$(MAKECMDGOALS))

frontend backend nginx postgres:
	@echo "🚀 Starting $@"

include config/makefile/recipes.mk
include config/makefile/devRecipes.mk

.PHONY: postgres frontend backend nginx