.DEFAULT_GOAL := all

up all:
	mkdir -p src/images && mkdir -p src/images/avatar
	docker-compose up --build -d

down fclean clean:
	docker-compose down -v --remove-orphans

re: fclean
	$(MAKE) all

dre: fclean
	$(MAKE) dev

dev:
	mkdir -p src/images && mkdir -p src/images/avatar
	docker-compose -f docker-compose.dev.yaml up --build -d

.PHONY: all fclean clean dev