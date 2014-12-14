
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
    editlink.href = '#';
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

highlightSourceCode();
