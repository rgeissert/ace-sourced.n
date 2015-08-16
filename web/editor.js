
editor = undefined;
originalcode = undefined;
originalmode = undefined;

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
    if (originalmode != undefined)
	return originalmode;

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

    originalmode = mode;
    return mode;
}

function getAceMode(mode) {
    if (mode == undefined)
	mode = getMode();

    if (mode != 'no-highlight')
	mode = 'ace/mode/' + mode;
    else
	mode = undefined;

    return mode;
}

function repositionInfoBox() {
    var ibox = document.getElementById('pkginfobox');
    var topOff = getAbsoluteTopOffset(document.getElementById('code_editor'));
    ibox.style.top = (topOff + 20) + 'px';
}

function highlightSourceCode() {
    var ct = document.getElementById('codetable');
    var sc = document.getElementById('sourcecode');

    var cmirror_elem = document.createElement('div');

    // grab the code before getCode/setCode change to using
    // editor:
    var sourceCode = getCode();
    var mode = getAceMode();

    cmirror_elem.textContent = sourceCode;
    cmirror_elem.id = 'code_editor';

    editor = ace.edit(cmirror_elem);

    if (mode)
	editor.getSession().setMode(mode);
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
    overs_a.onclick = debsources.fetchOtherVersions;
    overs.id = 'overs';
    overs.appendChild(overs_a);
    ibox.appendChild(overs);

    var etabs = document.createElement('ul');
    etabs.id = 'edittabs';

    ibox.parentElement.parentElement.insertBefore(etabs, ibox.parentElement);
    repositionInfoBox();
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
function getOriginalCode() {
    // Backup the original code for later use
    if (originalcode == undefined)
	originalcode = getCode();
    return originalcode;
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

function initDefaultTab() {
    if (EditorTabsManager.init()) {
	var t = EditorTabsManager.createTab(editor.getSession(), 'File', false);
	t.onSelected = function() {
	    updateLinksView('code');
	}
	EditorTabsManager.selectSession(editor.getSession());
    }
}

function initEditorElements() {
    if (document.getElementById('email_trigger') != null)
	return;

    var editlink = document.getElementById('editcode_trigger');
    editlink.textContent = 'save as patch';
    editlink.href = '#';
    editlink.onclick = downloadPatch;
    editlink.download = getFilePath() + '.patch';

    email = document.createElement('a');
    email.textContent = 'email patch';
    email.onclick = emailPatch;
    email.id = 'email_trigger';
    email.href = '#';
    editlink.parentElement.insertBefore(email, editlink.nextElementSibling);

    separator = document.createElement('span');
    separator.textContent = ' | ';
    editlink.parentElement.insertBefore(separator, editlink.nextElementSibling);

    var difftab = document.createElement('a');
    difftab.textContent = 'diff edits';
    difftab.onclick = function() {
	openDiffDocument(generatePatch(), 'edits');
    }
    difftab.id = 'difftab_trigger';
    difftab.href = '#';
    editlink.parentElement.insertBefore(difftab, editlink.nextElementSibling);

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
	dl_el.id = 'download_trigger';
	dl_el.onclick = downloadCode;
	dl_el.textContent = 'download edit';
	dl_el.download = getFilePath().split(/\//).pop();
	// FIXME: when displaying a diff, adjust the file name
    }

    initDefaultTab();
}

function editcode() {
    // explicit call to make sure the original code is backed up
    getOriginalCode();

    initEditorElements();

    EditorTabsManager.createActionTab(function(e) {
	var new_session = ace.createEditSession(getOriginalCode(), getAceMode());
	var t = EditorTabsManager.createTab(new_session, 'File');
	t.onSelected = function() {
	    updateLinksView('code');
	}
	EditorTabsManager.selectSession(new_session);
	repositionInfoBox();
    }, '+');

    setCodeEditable(true);

    return false;
}

function updateLinksView(view) {
    switch (view) {
	case 'code':
	    document.getElementById('editcode_trigger').style.display = 'none';
	    document.getElementById('editcode_trigger').nextElementSibling.style.display = 'none';
	    document.getElementById('difftab_trigger').style.display = '';
	    document.getElementById('difftab_trigger').nextElementSibling.style.display = '';
	    document.getElementById('email_trigger').style.display = 'none';
	    document.getElementById('email_trigger').nextElementSibling.style.display = 'none';
	    document.getElementById('download_trigger').style.display = '';
	    document.getElementById('download_trigger').nextElementSibling.style.display = '';
	    break;
	case 'diff':
	    document.getElementById('editcode_trigger').style.display = '';
	    document.getElementById('editcode_trigger').nextElementSibling.style.display = '';
	    document.getElementById('difftab_trigger').style.display = 'none';
	    document.getElementById('difftab_trigger').nextElementSibling.style.display = 'none';
	    document.getElementById('email_trigger').style.display = '';
	    document.getElementById('email_trigger').textContent = 'email as patch';
	    document.getElementById('email_trigger').onclick = function() {
		emailPatch(getCode());
	    }
	    document.getElementById('email_trigger').nextElementSibling.style.display = '';
	    document.getElementById('download_trigger').style.display = 'none';
	    document.getElementById('download_trigger').nextElementSibling.style.display = 'none';
	    break;
    }
    repositionInfoBox();
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
    patch = JsDiff.createPatch(filepath, getOriginalCode(), getCode(), undefined, undefined);

    return patch;
}

function emailPatch(patch) {
    var payload;

    if (patch == undefined)
	patch = generatePatch();

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


function openDiffDocument(diff, extra_label) {
    initEditorElements();

    var diff_session = ace.createEditSession(diff, getAceMode('diff'));
    var t = EditorTabsManager.createTab(diff_session, 'Diff ' + extra_label);
    t.onSelected = function() {
	updateLinksView('diff');
    }
    EditorTabsManager.selectSession(diff_session);
}

debsources = {
    diffOtherPath: function(otherPath, raw_url, cb) {
	var req = new XMLHttpRequest();
	req.onload = function() {
	    var otherCode = this.responseText;
	    var filepath = getFilePath();
	    var patch;

	    if (JsDiff.createTwoFilesPatch != undefined) {
		patch = JsDiff.createTwoFilesPatch(otherPath, filepath, otherCode, getOriginalCode(), undefined, undefined);
	    } else {
		patch = JsDiff.createPatch(filepath, otherCode, getOriginalCode(), undefined, undefined);
	    }

	    cb(patch);
	}
	req.onerror = function() {
	    window.alert("meh, we failed to download the other file");
	}

	req.open('GET', raw_url, true);
	req.responseType = 'text';
	req.send();
    },
    queryJSONApi: function(path, cb) {
	var req = new XMLHttpRequest();

	req.onload = cb;
	req.onerror = function() {
	    window.alert('gah, we failed to query the debsources API');
	}
	req.open('GET', '/api/' + path, true);
	req.responseType = 'json';
	req.send();
    },
    checkIfSourceFileExists: function(file, cb) {
	debsources.queryJSONApi('src/' + file + '/', function() {
	    var res = this.response;
	    if (res.type != undefined && res.type == 'file')
		cb(true, res);
	    else
		cb(false);
	});
    },
    fillOtherVersions: function() {
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
	    var otherFileAPI  = getSourceName() + '/' + ver.version + '/' + getUnversionedFilePath();
	    var otherFileFancy = getSourceName() + '-' + ver.version + '/' + getUnversionedFilePath();
	    item.textContent = ver.version;
	    var cb = function genCallback(_item, _version, _otherFile) {
		    return function(exists, _res) {
			if (exists) {
			    _item.innerHTML = '';
			    var link = document.createElement('a');

			    link.textContent = _version;
			    link.href = '#';
			    link.onclick = function() {
				// TODO: be smarter and compare them the
				// other way around when the other version
				// is greater than the current one
				debsources.diffOtherPath(_otherFile, _res.raw_url, function(d) {
				    openDiffDocument(d, 'since ' + _version);
				});
				return false;
			    }
			    _item.appendChild(link);
			} else {
			    _item.style.textDecoration = 'line-through';
			    _item.style.fontSize = 'smaller';
			    _item.title = 'The file does not exist in version ' + _version;
			}
		};
	    }(item, ver.version, otherFileFancy);
	    debsources.checkIfSourceFileExists(otherFileAPI, cb);
	    list.appendChild(item);
	}
	overs.innerHTML = '';
	overs.appendChild(label);
	overs.appendChild(list);
    },
    fetchOtherVersions: function() {
	debsources.queryJSONApi('src/' + getSourceName() + '/', debsources.fillOtherVersions);
    },
}

EditorTabsManager = {
    tabs: new Array(),
    createTab: function(session, label, closable) {
	label = (label == undefined)? '' : label;
	closable = (closable == undefined)? true : closable;

	var li = document.createElement('li');
	var a = document.createElement('a');
	var x = document.createElement('a');
	var t = {
	    label: label,
	    session: session,
	    a: a,
	    onSelected: undefined,
	};

	a.textContent = label;
	a.href = '#';
	a.onclick = function(e) {
	    return EditorTabsManager.onclickTab(t, e);
	}
	li.appendChild(a);

	if (closable) {
	    x.textContent = '(x)';
	    x.style.fontSize = 'x-small';
	    x.onclick = function(e) {
		return EditorTabsManager.oncloseTab(t, e);
	    }

	    li.appendChild(document.createTextNode(' '));
	    li.appendChild(x);
	}

	var etab = document.getElementById('edittabs');
	var actionTabs = etab.getElementsByClassName('etab_actiontab');
	if (actionTabs.length > 0) {
	    etab.insertBefore(li, actionTabs[0].parentElement);
	} else {
	    etab.appendChild(li);
	}

	EditorTabsManager.tabs.push(t);
	if (EditorTabsManager.tabs.length == 1) {
	    li.className = 'etab_selected';
	    a.blur();
	}

	return t;
    },
    createActionTab: function(cb, label) {
	label = (label == undefined)? '' : label;

	var li = document.createElement('li');
	var a = document.createElement('a');

	a.textContent = label;
	a.href = '#';
	a.onclick = cb;
	a.className = 'etab_actiontab';
	li.appendChild(a);

	var etab = document.getElementById('edittabs');
	etab.appendChild(li);
    },
    onclickTab: function(t, e) {
	var tabs = EditorTabsManager.tabs;

	for (var i = 0; i < tabs.length; i++) {
	    if (e.currentTarget == tabs[i].a)
		EditorTabsManager.selectSession(tabs[i].session);
	}
	return false;
    },
    oncloseTab: function(t, e) {
	var tabs = EditorTabsManager.tabs;
	var li = e.currentTarget.parentElement;
	var jumpTo = 0;

	li.parentElement.removeChild(li);

	for (var i = 0; i < tabs.length; i++) {
	    if (t == tabs[i]) {
		tabs.splice(i, 1);
		if (i != 0)
		    jumpTo = i-1;
	    }
	}

	EditorTabsManager.selectSession(tabs[jumpTo].session);
	return false;
    },
    selectSession: function(session) {
	var tabs = EditorTabsManager.tabs;
	var t;
	for (var i = 0; i < tabs.length; i++) {
	    if (session == tabs[i].session) {
		t = tabs[i];
		t.a.parentElement.className = 'etab_selected';
		t.a.blur();
	    } else {
		tabs[i].a.parentElement.className = '';
	    }
	}
	editor.setSession(session);

	if (t.onSelected != undefined)
	    t.onSelected();

	return session;
    },
    init: function() {
	if (EditorTabsManager.initialised != undefined)
	    return false;

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = 'ul#edittabs { list-style-type: none; margin: 30px 0 0 0; padding: 0 0 0.3em 0; } ul#edittabs li { display: inline; font-size: smaller; background-color: whitesmoke; border: 1px solid #c9c3ba; border-bottom: none; padding: 0.3em; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; } ul#edittabs li a { color: black; text-decoration: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; } ul#edittabs li:hover { background-color: snow; } ul#edittabs li.etab_selected { background-color: snow; font-weight: bold; font-size: medium; padding: 0.7em 0.3em 0.38em 0.3em; }';
	document.body.appendChild(style);
	EditorTabsManager.initialised = true;
	return true;
    },
}

highlightSourceCode();
