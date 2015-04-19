
VERSION = 0.0.5
SUBDIRS = chrome firefox web

export VERSION
ACTION = all

doall:
	for dir in $(SUBDIRS); do \
	    $(MAKE) -C $$dir $(ACTION) ; \
	done

all: doall

clean: ACTION=clean
clean: doall
