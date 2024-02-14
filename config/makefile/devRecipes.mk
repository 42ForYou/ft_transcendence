PUBLIC := public
DIRS := $(PUBLIC) public/images

dirs:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"📁 Creating directories")
	mkdir -p $(DIRS)

dev: dirs
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🚀 Starting docker-compose develop up")
	$(call check-file, .env.dev)
	export NODE_ENV="development"
	cd src/frontend && npm install
	docker-compose -f docker-compose.dev.yaml up --build -d

dfclean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🧹 Clean docker-compose")
	$(call delete-folder,$(PUBLIC))
	docker-compose -f docker-compose.dev.yaml down -v --remove-orphans

dre: dfclean
	@$(MAKE) dev

dlog:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"📜 Show develop docker-compose logs")
	docker-compose -f docker-compose.dev.yaml logs -f

.PHONY: dev dre dfclean