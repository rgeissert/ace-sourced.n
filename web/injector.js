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
	    editlink.onclick = editcode;
	    editlink.id = 'editcode_trigger';
	    editlink.href = '#';
	    downloadlink.parentElement.insertBefore(editlink, downloadlink.nextElementSibling);
	    
	    separator = document.createElement('span');
	    separator.textContent = ' | ';
	    editlink.parentElement.insertBefore(separator, editlink.nextElementSibling);
	}
    }

    highlightSourceCode();
}

inject();
