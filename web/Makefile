
FINAL_JS = diff.js editor.js injector.js

$(VERSION)/injector.js: injector.js.in
	sed 's/@VERSION@/$(VERSION)/g;s,@BASE_URL@,$(BASE_URL),g' < $< > $@

$(VERSION)/%.js: %.js
	cp -a $< $@

$(VERSION)/build-stamp:
	mkdir -p $(VERSION)
	for js in $(FINAL_JS); do \
	    $(MAKE) $(VERSION)/$$js ; \
	done
	touch $@

clean:
	! [ -d "$(VERSION)" ] || $(RM) -r $(VERSION)

all: $(VERSION)/build-stamp
