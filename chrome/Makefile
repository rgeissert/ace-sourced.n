
updates.xml: updates.xml.in
	sed 's/@VERSION@/$(VERSION)/g;s,@BASE_URL@,$(BASE_URL),g' < $< > $@
loader.js: loader.js.in
	sed 's/@VERSION@/$(VERSION)/g;s,@BASE_URL@,$(BASE_URL),g' < $< > $@
manifest.json: manifest.json.in
	sed 's/@VERSION@/$(VERSION)/g;s,@BASE_URL@,$(BASE_URL),g' < $< > $@

clean:
	$(RM) ../web/updates.xml
	$(RM) manifest.json loader.js ../web/latest.crx

all: updates.xml loader.js manifest.json
	/usr/lib/chromium/chromium --no-message-box \
	    --pack-extension=$(CURDIR) \
	    --pack-extension-key=$(CHROME_PEM)
	mv ../chrome.crx ../web/latest.crx
	mv ../updates.xml ../web/
