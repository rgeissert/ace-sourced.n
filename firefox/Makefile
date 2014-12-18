all:
	cfx xpi --update-link https://people.debian.org/~geissert/ace-debsources/ace-sourced_n.xpi --update-url https://people.debian.org/~geissert/ace-debsources/updates.rdf
	mv ace-sourced_n.update.rdf updates.rdf
	sed -i 's/maxVersion>[^<]*/maxVersion>38.0/' updates.rdf
