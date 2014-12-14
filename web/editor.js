
editor = undefined;
originalcode = undefined;

function getAbsoluteTopOffset(el) {
    var topOffset = 0;

    do {
	topOffset += el.offsetTop;
    } while (el = el.offsetParent);

    return topOffset;
}

function getCellForLine(line) {
    return document.getElementsByClassName("ace_gutter-cell")[line-1];
}

function highlightSourceCode() {
    var ct = document.getElementById('codetable');
    var sc = document.getElementById('sourcecode');

    var cmirror_elem = document.createElement('div');

    // grab the code before getCode/setCode change to using
    // editor:
    var sourceCode = getCode();
    var mode = document.getElementById('sourcecode').className.split(/\s+/)[0];

    if (mode == 'cpp') {
	mode = 'c_cpp';
    } else if (mode == 'bash') {
	mode = 'sh';
    }

    cmirror_elem.textContent = sourceCode;
    cmirror_elem.id = 'code_editor';

    editor = ace.edit(cmirror_elem);

    if (mode != 'no-highlight')
	editor.getSession().setMode("ace/mode/"+mode);
    editor.setTheme('ace/theme/dreamweaver');
    editor.setOption('maxLines', Infinity);
    editor.setOption('vScrollBarAlwaysVisible', false);
    editor.setHighlightActiveLine(true);
    editor.setReadOnly(true);

    ct.parentElement.replaceChild(cmirror_elem, ct);
    editor.resize(true);

    var message_style = document.createElement('style');
    message_style.type = 'text/css';
    message_style.innerHTML = '.message { position: absolute; right: 2em; z-index: 5; background-color: #feff6f; padding: 10px; margin-right: 10px; margin-left: 10px; white-space: pre-wrap; /*other browsers */ white-space: -moz-pre-wrap; white-space:-o-pre-wrap; word-wrap: break-word; }';
    document.body.appendChild(message_style);

    var page_params = document.location.search;
    var matches = page_params.match(/[?&]msg=(\d+):([^:]+):([^&]+)/g);
    for (var i = 0; matches != null && i < matches.length; i++) {
	var match = matches[i].match(/[?&]msg=(\d+):([^:]+):([^&]+)/);
	var line = Number(match[1]);
	var title = match[2];
	var message = match[3];

	var cell = getCellForLine(line);
	var topOff = getAbsoluteTopOffset(cell);

	var msg_el = document.createElement('div');
	var title_el = document.createElement('span');
	var text_el = document.createElement('span');

	title_el.style.fontWeight = 'bold';
	title_el.textContent = title;
	text_el.textContent = "\n" + message;
	msg_el.className = 'message';
	msg_el.appendChild(title_el);
	msg_el.appendChild(text_el);
	msg_el.style.top = topOff + 'px';
	
	document.body.appendChild(msg_el);
    }

    matches = page_params.match(/[?&]hl=([^&]+)/);
    if (matches != null)
	matches = matches[1].match(/(\d+(:\d+)?)(,|$)/g);

    var selection = [];
    for (var i = 0; matches != null && i < matches.length; i++) {
	var match = matches[i].match(/(\d+)(?:[:](\d+))?/);
	var s = Number(match[1]), e = s;

	if (match[2] != undefined)
	    e = Number(match[2]);
	for (; s <= e; s++)
	    selection.push(s);
    }
    var s;
    while (s = selection.pop()) {
	var codeline = editor.getSession().getLine(s);
	editor.getSession().addMarker(new Range(s-1, 0, s-1, codeline.length), "ace_selected-word", "line", false);
    }

    if (document.location.hash.match(/^#L\d+$/)) {
	var line = Number(document.location.hash.substring(2));
	editor.gotoLine(line, 0, false);

	var cell = getCellForLine(line);
	if (cell != undefined) {
	    cell.scrollIntoViewIfNeeded();
	}
    }
}

function getCode() {
    if (editor == undefined) {
	return document.getElementById('sourcecode').textContent;
    } else {
	return editor.getValue();
    }
}
function setCode(newCode) {
    if (editor == undefined) {
	document.getElementById('sourcecode').textContent = newCode;
    } else {
	return editor.setValue(newCode, -1);
    }
}
function setCodeEditable(enabled) {
    if (editor == undefined) {
	document.getElementById('sourcecode').contentEditable = enabled;
    } else {
	editor.setReadOnly(!enabled);
    }
}

function editcode() {
    // Backup the original code for later use
    originalcode = getCode();
    setCodeEditable(true);

    var editlink = document.getElementById('editcode_trigger');
    editlink.textContent = 'save as patch';
    editlink.onclick = downloadPatch;

    if (document.getElementById('email_trigger') == null) {
	email = document.createElement('a');
	email.textContent = 'email patch';
	email.onclick = emailPatch;
	email.id = 'email_trigger';
	email.href = '#';
	editlink.parentElement.insertBefore(email, editlink.nextElementSibling);

	separator = document.createElement('span');
	separator.textContent = ' | ';
	editlink.parentElement.insertBefore(separator, email.nextElementSibling);

	// patch the download link to make it download the modified file
	var dl_el = email.nextElementSibling;
	while (dl_el != null && dl_el.textContent != 'download') {
	    dl_el = dl_el.nextElementSibling;
	}
	if (dl_el != null) {
	    dl_el.href = '#';
	    dl_el.onclick = downloadCode;
	    dl_el.textContent = 'download edit';
	}
    }

    return false;
}

function getFilePath() {
    var filepath = document.getElementById('breadcrumbs').textContent;
    return filepath.replace(/ \/ /g, '/').replace(/^source\//, '').replace('/', '-');
}

function getSourceName() {
    var name = document.getElementById('breadcrumbs').textContent;
    return name.replace(/ \/ /g, '/').split(/\//)[1];
}

function getSourceVersion() {
    var name = document.getElementById('breadcrumbs').textContent;
    return name.replace(/ \/ /g, '/').split(/\//)[2];
}

function generatePatch() {
    var filepath, patch;

    filepath = getFilePath();
    patch = JsDiff.createPatch(filepath, originalcode, getCode(), undefined, undefined);

    return patch;
}

function emailPatch() {
    var patch = generatePatch();
    var payload;

    payload='mailto:submit@bugs.debian.org?body=';
    payload+=encodeURIComponent("Source: "+getSourceName()+"\n"+
    "Source-Version: "+getSourceVersion()+"\n"+
    "Tags: patch\n"+
    "\n---\n"+
    patch+"\n");
    payload+='&subject='+encodeURIComponent('[PATCH] '+getSourceName()+': ');

    openPayload(payload);
    return false;
}

function downloadPatch() {
    var patch = generatePatch();
    var payload;

    payload = 'data:application/octet-stream,' + encodeURIComponent(patch);

    openPayload(payload);
    return false;
}

function downloadCode() {
    var code = getCode();
    var payload;

    payload = 'data:application/octet-stream,' + encodeURIComponent(code);

    openPayload(payload);
    return false;
}

function openPayload(payload) {
    window.location = payload;
}
