PUBLIC := public
DIRS := $(PUBLIC) public/images

dirs:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"📁 Creating directories")
	mkdir -p $(DIRS)

dev: dirs
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🚀 Starting docker-compose develop up")
	$(call check-file, .env.dev)
	$(call set-env,NODE_ENV,"development")
	@cd src/frontend && npm install
	$(call select-option, \
	Do you want to run docker-compose in detached mode?, \
		🚀 Starting docker-compose up in $(BOLD_YELLOW)detached $(NO_COLOR) mode, \
			docker-compose -f docker-compose.dev.yaml up --build -d, \
		🚀 Starting docker-compose up in $(BOLD_GREEN)interactive $(NO_COLOR) mode, \
			docker-compose -f docker-compose.dev.yaml up --build \
	)

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