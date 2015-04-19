
VERSION = 0.0.7
BASE_URL = https://people.debian.org/~geissert/ace-debsources
SUBDIRS = chrome firefox web

export VERSION BASE_URL
ACTION = all

doall:
	for dir in $(SUBDIRS); do \
	    $(MAKE) -C $$dir $(ACTION) ; \
	done

all: doall

clean: ACTION=clean
clean: doall
