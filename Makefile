.DEFAULT_GOAL := all

include config/makefile/vars.mk
include config/makefile/colors.mk
include config/makefile/functions.mk

include config/makefile/recipes.mk
include config/makefile/devRecipes.mk
include config/makefile/pickRecipes.mk

.PHONY: postgres frontend backend nginx