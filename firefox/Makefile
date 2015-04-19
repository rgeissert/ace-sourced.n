NAME = ace-sourced_n

data/loader.js: data/loader.js.in
	sed 's/@VERSION@/$(VERSION)/g;s,@BASE_URL@,$(BASE_URL),g' < $< > $@

package.json: package.json.in
	sed 's/@VERSION@/$(VERSION)/g;s,@BASE_URL@,$(BASE_URL),g' < $< > $@

clean:
	$(RM) package.json data/loader.js
	$(RM) ../web/$(NAME).xpi ../web/updates.rdf

all: package.json data/loader.js
	cfx xpi --update-link $(BASE_URL)/$(NAME).xpi --update-url $(BASE_URL)/updates.rdf
	mv $(NAME).xpi ../web/
	sed -i 's/maxVersion>[^<]*/maxVersion>38.0/' $(NAME).update.rdf
	mv $(NAME).update.rdf ../web/updates.rdf
