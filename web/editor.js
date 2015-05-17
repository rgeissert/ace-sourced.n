
editor = undefined;
originalcode = undefined;
originaldoc = undefined;

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

function getMode() {
    var mode = document.getElementById('sourcecode').className.split(/\s+/)[0];

    var mode_conversion = {
	'cpp': 'c_cpp',
	'bash': 'sh',
	'go': 'golang',
	'coffeescript': 'coffee',
	'cs': 'csharp',
	'apache': 'apache_conf',
	// yeah, debsources maps 'make' to cmake
	'cmake': 'makefile',
    }

    if (mode_conversion[mode] !== undefined)
	mode = mode_conversion[mode];

    // let's try to do better than debsources \o/
    if (mode == 'no-highlight') {
	var filext_modes = {
	    'abap': 'abap',
	    'actionscript': 'actionscript',
	    'ada': 'ada',
	    'am': 'makefile',
	    'apache_conf': 'apache_conf',
	    'applescript': 'applescript',
	    'asciidoc': 'asciidoc',
	    'assembly_x86': 'assembly_x86',
	    'autohotkey': 'autohotkey',
	    'batchfile': 'batchfile',
	    'c9search': 'c9search',
	    'c_cpp': 'c_cpp',
	    'cirru': 'cirru',
	    'clojure': 'clojure',
	    'cobol': 'cobol',
	    'coffee': 'coffee',
	    'coldfusion': 'coldfusion',
	    'csharp': 'csharp',
	    'css': 'css',
	    'curly': 'curly',
	    'd': 'd',
	    'dart': 'dart',
	    'diff': 'diff',
	    'django': 'django',
	    'dockerfile': 'dockerfile',
	    'dot': 'dot',
	    'eiffel': 'eiffel',
	    'ejs': 'ejs',
	    'elixir': 'elixir',
	    'elm': 'elm',
	    'erlang': 'erlang',
	    'forth': 'forth',
	    'ftl': 'ftl',
	    'gcode': 'gcode',
	    'gherkin': 'gherkin',
	    'gitignore': 'gitignore',
	    'glsl': 'glsl',
	    'golang': 'golang',
	    'groovy': 'groovy',
	    'haml': 'haml',
	    'handlebars': 'handlebars',
	    'haskell': 'haskell',
	    'haxe': 'haxe',
	    'html': 'html',
	    'html_ruby': 'html_ruby',
	    'ini': 'ini',
	    'io': 'io',
	    'jack': 'jack',
	    'jade': 'jade',
	    'java': 'java',
	    'javascript': 'javascript',
	    'json': 'json',
	    'jsoniq': 'jsoniq',
	    'jsp': 'jsp',
	    'jsx': 'jsx',
	    'julia': 'julia',
	    'latex': 'latex',
	    'less': 'less',
	    'liquid': 'liquid',
	    'lisp': 'lisp',
	    'livescript': 'livescript',
	    'logiql': 'logiql',
	    'lsl': 'lsl',
	    'lua': 'lua',
	    'luapage': 'luapage',
	    'lucene': 'lucene',
	    'makefile': 'makefile',
	    'markdown': 'markdown',
	    'matlab': 'matlab',
	    'mel': 'mel',
	    'mushcode': 'mushcode',
	    'mysql': 'mysql',
	    'nix': 'nix',
	    'objectivec': 'objectivec',
	    'ocaml': 'ocaml',
	    'pascal': 'pascal',
	    'perl': 'perl',
	    'pgsql': 'pgsql',
	    'php': 'php',
	    'plain_text': 'plain_text',
	    'powershell': 'powershell',
	    'praat': 'praat',
	    'prolog': 'prolog',
	    'properties': 'properties',
	    'proto': 'protobuf',
	    'python': 'python',
	    'r': 'r',
	    'rdoc': 'rdoc',
	    'rhtml': 'rhtml',
	    'ruby': 'ruby',
	    'rules': 'makefile',
	    'rust': 'rust',
	    'sass': 'sass',
	    'scad': 'scad',
	    'scala': 'scala',
	    'scheme': 'scheme',
	    'scss': 'scss',
	    'sh': 'sh',
	    'sjs': 'sjs',
	    'smarty': 'smarty',
	    'snippets': 'snippets',
	    'soy_template': 'soy_template',
	    'space': 'space',
	    'sql': 'sql',
	    'stylus': 'stylus',
	    'svg': 'svg',
	    'tcl': 'tcl',
	    'tex': 'tex',
	    'text': 'text',
	    'textile': 'textile',
	    'toml': 'toml',
	    'twig': 'twig',
	    'typescript': 'typescript',
	    'vala': 'vala',
	    'vbscript': 'vbscript',
	    'velocity': 'velocity',
	    'verilog': 'verilog',
	    'vhdl': 'vhdl',
	    'xml': 'xml',
	    'xquery': 'xquery',
	    'yml': 'yaml',
	    'yaml': 'yaml',
	    };
	var filext;
	filext = getFilePath().split(/\//).pop().split(/\./).pop().toLowerCase();

	if (filext_modes[filext] !== undefined)
	    mode = filext_modes[filext];
    }

    return mode;
}

function highlightSourceCode() {
    var ct = document.getElementById('codetable');
    var sc = document.getElementById('sourcecode');

    var cmirror_elem = document.createElement('div');

    // grab the code before getCode/setCode change to using
    // editor:
    var sourceCode = getCode();
    var mode = getMode();

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

    originaldoc = editor.getSession().getDocument();

    var message_style = document.createElement('style');
    message_style.type = 'text/css';
    message_style.innerHTML = '.message { position: absolute; right: 2em; z-index: 5; background-color: #feff6f; padding: 10px; margin-right: 10px; margin-left: 10px; white-space: pre-wrap; /*other browsers */ white-space: -moz-pre-wrap; white-space:-o-pre-wrap; word-wrap: break-word; }';
    document.body.appendChild(message_style);

    // set an absolute position of the infobox and bring it back to the
    // front by bumping its zIndex
    var pkginfobox_style = document.createElement('style');
    pkginfobox_style.type = 'text/css';
    pkginfobox_style.innerHTML = '.pkginfobox_fixed { position: absolute; z-index: 1;}';
    document.body.appendChild(pkginfobox_style);

    var page_params = document.location.search;
    var matches = page_params.match(/[?&]msg=(\d+):([^:]+):([^&]+)/g);
    for (var i = 0; matches != null && i < matches.length; i++) {
	var match = matches[i].match(/[?&]msg=(\d+):([^:]+):([^&]+)/);
	var line = Number(match[1]);
	var title = decodeURIComponent(match[2]);
	var message = decodeURIComponent(match[3]);

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
	    if (cell.scrollIntoViewIfNeeded != undefined) {
		cell.scrollIntoViewIfNeeded();
	    } else {
		cell.scrollIntoView();
	    }
	}
    }

    var ibox = document.getElementById('infobox_content');
    var overs = document.createElement('div');
    var overs_a = document.createElement('a');

    overs_a.textContent = 'Other versions';
    overs_a.href = '#';
    overs_a.onclick = fetchOtherVersions;
    overs.id = 'overs';
    overs.appendChild(overs_a);
    ibox.appendChild(overs);
}

function getCode() {
    if (editor == undefined) {
	var sc = document.getElementById('sourcecode');
	var messages = sc.getElementsByClassName('messages');

	// get rid off the messages (annotations), which are added
	// within the code
	while (messages.length > 0) {
	    var m = messages[0];
	    m.parentNode.removeChild(m);
	}

	return sc.textContent;
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
    editlink.href = '#';
    editlink.onclick = downloadPatch;
    editlink.download = getFilePath() + '.patch';

    if (document.getElementById('email_trigger') == null) {
	email = document.createElement('a');
	email.textContent = 'email patch';
	email.onclick = emailPatch;
	email.id = 'email_trigger';
	email.href = '#';
	editlink.parentElement.insertBefore(email, editlink.nextElementSibling);

	separator = document.createElement('span');
	separator.textContent = ' | ';
	editlink.parentElement.insertBefore(separator, editlink.nextElementSibling);

	// patch the download link to make it download the modified file
	var dl_el = email.nextElementSibling;
	while (dl_el != null && dl_el.textContent != 'download') {
	    dl_el = dl_el.nextElementSibling;
	}
	if (dl_el != null) {
	    dl_el.href = '#';
	    dl_el.onclick = downloadCode;
	    dl_el.textContent = 'download edit';
	    dl_el.download = getFilePath().split(/\//).pop();
	}
    }

    return false;
}

function getFilePath() {
    var filepath = document.getElementById('breadcrumbs').textContent;
    return filepath.replace(/ \/ /g, '/').replace(/^source\//, '').replace('/', '-');
}

function getUnversionedFilePath() {
    var filepath = getFilePath();
    return filepath.replace(/^[^/]+\//, '');
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

function downloadPatch(e) {
    var patch = generatePatch();
    var payload;

    payload = 'data:application/octet-stream,' + encodeURIComponent(patch);

    e.currentTarget.href = payload;
    return true;
}

function downloadCode(e) {
    var code = getCode();
    var payload;

    payload = 'data:application/octet-stream,' + encodeURIComponent(code);

    e.currentTarget.href = payload;
    return true;
}

function openPayload(payload) {
    window.location = payload;
}

function diffOtherPath(otherPath, raw_url, cb) {
    var req = new XMLHttpRequest();
    req.onload = function() {
	var otherCode = this.responseText;
	var filepath = getFilePath();
	var patch;

	if (JsDiff.createTwoFilesPatch != undefined) {
	    patch = JsDiff.createPatch(otherPath, filepath, otherCode, getCode(), undefined, undefined);
	} else {
	    patch = JsDiff.createPatch(filepath, otherCode, getCode(), undefined, undefined);
	}

	cb(patch);
    }
    req.onerror = function() {
	window.alert("meh, we failed to download the other file");
    }

    req.open('GET', raw_url, true);
    req.responseType = 'text';
    req.send();
}

function openDiffDocument(diff) {
    var Document = ace.require("./document").Document;
    var doc = new Document(diff);
    editor.getSession().setDocument(doc);
    editor.getSession().setMode('ace/mode/diff');
}

function queryJSONApi(path, cb) {
    var req = new XMLHttpRequest();

    req.onload = cb;
    req.onerror = function() {
	window.alert('gah, we failed to query the debsources API');
    }
    req.open('GET', '/api/' + path, true);
    req.responseType = 'json';
    req.send();
}

function checkIfSourceFileExists(file, cb) {
    queryJSONApi('src/' + file + '/', function() {
	var res = this.response;
	if (res.type != undefined && res.type == 'file')
	    cb(true, res);
	else
	    cb(false);
    });
}

function fillOtherVersions() {
    var overs = document.getElementById('overs');
    var res = this.response;
    var list = document.createElement('ul');
    var label = document.createElement('span');
    var ourVersion = getSourceVersion();

    label.textContent = overs.textContent;

    for (var n in res.versions) {
	var ver = res.versions[n];

	if (ver.version == ourVersion)
	    continue;

	var item = document.createElement('li');
	var otherFile = getSourceName() + '/' + ver.version + '/' + getUnversionedFilePath();
	item.textContent = ver.version;
	var cb = function genCallback(_item, _version, _otherFile) {
		return function(exists, _res) {
		    if (exists) {
			_item.innerHTML = '';
			var link = document.createElement('a');

			link.textContent = _version;
			link.href = '#';
			link.onclick = function() {
			    diffOtherPath(_otherFile, _res.raw_url, openDiffDocument);
			    return false;
			}
			_item.appendChild(link);
		    } else {
			_item.style.textDecoration = 'line-through';
			_item.style.fontSize = 'smaller';
			_item.title = 'The file does not exist in version ' + _version;
		    }
	    };
	}(item, ver.version, otherFile);
	checkIfSourceFileExists(otherFile, cb);
	list.appendChild(item);
    }
    overs.innerHTML = '';
    overs.appendChild(label);
    overs.appendChild(list);
}

function fetchOtherVersions() {
    queryJSONApi('src/' + getSourceName() + '/', fillOtherVersions);
}

highlightSourceCode();
