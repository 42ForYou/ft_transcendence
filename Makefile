include conf/colors.mk
include conf/functions.mk

DIRS := src/images src/images/avatar

.DEFAULT_GOAL := all

dirs:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"📁 Creating directories")
	mkdir -p $(DIRS)

up all:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🚀 Starting docker-compose up")
	$(call check-file, .env)
	export NODE_ENV="production"
	docker-compose -f docker-compose.yaml up --build -d

dev: dirs
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🚀 Starting docker-compose develop up")
	$(call check-file, .dev.env)
	export NODE_ENV="development"
	cd src/frontend && npm install
	docker-compose -f docker-compose.dev.yaml up --build -d

down clean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🔻 Down docker-compose")
	docker-compose down

fclean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🧹 Clean docker-compose")
	$(call delete-folder,src/images)
	docker-compose down -v --remove-orphans

dfclean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🧹 Clean docker-compose")
	$(call delete-folder,src/images)
	docker-compose -f docker-compose.dev.yaml down -v --remove-orphans

re: fclean
	@$(MAKE) all

dre: dfclean
	@$(MAKE) dev

.PHONY: all fclean clean dev re dre down up