all:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🚀 Starting docker-compose up")
	$(call check-file, .env.prod)
	export NODE_ENV="production"
	docker-compose -f docker-compose.prod.yaml up --build -d

clean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🔻 Down docker-compose")
	docker-compose -f docker-compose.prod.yaml down

fclean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🧹 Clean docker-compose")
	docker-compose -f docker-compose.prod.yaml down -v --remove-orphans

re: fclean
	@$(MAKE) all

.PHONY: all fclean clean re down up