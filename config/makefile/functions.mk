define check-file
	@if [ ! -f $(1) ]; then \
		echo "$(1) 파일이 존재하지 않습니다."; \
		exit 1; \
	fi
endef

define format_print
	@echo "$(1)\n[$(2)] $(3)$(4)$(NO_COLOR)\n"
endef

define delete-folder
	@if [ ! -d $(1) ]; then \
		echo "디렉토리 $(1)가 존재하지 않습니다."; \
	else \
		read -p "정말로 $(1) 폴더를 삭제하시겠습니까? [y/n]: "; ans; \
		if [ "$$ans" = "y" ] || [ "$$ans" = "Y" ]; then \
			echo "$(1) 폴더를 삭제합니다..."; \
			rm -rf $(1); \
		else \
			echo "$(1) 폴더 삭제가 취소되었습니다."; \
		fi; \
	fi
endef

define select-option
	@read -p "$(1) [y/n]: " ans; \
	if [ "$$ans" = "y" ] || [ "$$ans" = "Y" ]; then \
		echo "$(2)"; \
		$(3); \
	else \
		echo "$(4)"; \
		$(5); \
	fi
endef

define set-env
  @echo "setting env $(1)=$(MAGENT)$(2) $(NO_COLOR)\n"
	@export $(1)=$(2)
endef