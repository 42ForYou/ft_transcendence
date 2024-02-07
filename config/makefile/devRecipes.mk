PUBLIC := public
DIRS := $(PUBLIC) public/images

dirs:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"📁 Creating directories")
	mkdir -p $(DIRS)

dev: dirs
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🚀 Starting docker-compose develop up")
	$(call check-file, .dev.env)
	export NODE_ENV="development"
	cd src/frontend && npm install
	docker-compose -f docker-compose.dev.yaml up --build -d

dfclean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🧹 Clean docker-compose")
	$(call delete-folder,$(PUBLIC))
	docker-compose -f docker-compose.dev.yaml down -v --remove-orphans

dre: dfclean
	@$(MAKE) dev

.PHONY: dev dre dfclean