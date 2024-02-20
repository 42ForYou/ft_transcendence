all:
	$(call check-env-prod)
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🚀 Starting docker compose up")
	$(call set-env,NODE_ENV,"production")
	$(call select-option,\
		Do you want to run docker compose in detached mode?, \
			🚀 Starting docker compose up in $(BOLD_YELLOW)detached $(NO_COLOR) mode, \
				docker compose -f docker-compose.prod.yaml up --build -d, \
			🚀 Starting docker compose up in $(BOLD_GREEN)interactive $(NO_COLOR) mode, \
				docker compose -f docker-compose.prod.yaml up --build \
		)

clean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🔻 Down docker compose")
	docker compose -f docker-compose.prod.yaml down

fclean:
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"🧹 Clean docker compose")
	docker compose -f docker-compose.prod.yaml down -v --remove-orphans

re: fclean
	@$(MAKE) all

log: 
	$(call format_print,$(BOLD_YELLOW),$@,$(BOLD_GREEN),"📜 Show production docker compose logs")
	docker compose -f docker-compose.prod.yaml logs -f

.PHONY: all clean fclean re