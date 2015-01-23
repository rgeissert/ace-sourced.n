NAME = ace-sourced_n
BASE_URL = https://people.debian.org/~geissert/ace-debsources/

all:
	cfx xpi --update-link $(BASE_URL)/$(NAME).xpi --update-url $(BASE_URL)/updates.rdf
	mv $(NAME).xpi ../web/
	sed -i 's/maxVersion>[^<]*/maxVersion>38.0/' $(NAME).update.rdf
	mv $(NAME).update.rdf ../web/updates.rdf
