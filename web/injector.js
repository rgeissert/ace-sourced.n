base = 'https://people.debian.org/~geissert/ace-debsources/';

insertjs = document.createElement('script');
insertjs.type = 'text/javascript';
// needed, as ace won't know where to download its stuff from
insertjs.attributes['data-ace-base'] = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/';
insertjs.async = false;
insertjs.src = insertjs.attributes['data-ace-base'] + 'ace.js';
document.body.appendChild(insertjs);

[
    '/diff.js',
    '/editor.js'
].forEach(function(js) {
	insertjs = document.createElement('script');
	insertjs.type = 'text/javascript';
	insertjs.async = false;
	insertjs.src = base+js;
	document.body.appendChild(insertjs);
    }
);

window.haschange = undefined;

function inject() {
    var mtable = document.getElementById('file_metadata');
    if (mtable == null)
	return;

    var a_elems = mtable.getElementsByTagName('a');

    var editlink, separator, downloadlink;

    for (var i = 0; i < a_elems.length; i++) {
	if (a_elems[i].innerText == 'download') {
	    downloadlink = a_elems[i];

	    editlink = document.createElement('a');
	    editlink.textContent = 'edit';
	    editlink.id = 'editcode_trigger';
	    editlink.href = 'javascript:editcode();';
	    downloadlink.parentElement.insertBefore(editlink, downloadlink.nextElementSibling);
	    
	    separator = document.createElement('span');
	    separator.textContent = ' | ';
	    editlink.parentElement.insertBefore(separator, editlink.nextElementSibling);
	}
    }
}

inject();
