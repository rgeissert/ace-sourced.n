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
	insertjs.src = base+js;
	document.body.appendChild(insertjs);	
    }
);

insertjs = document.createElement('script');
insertjs.type = 'text/javascript';
insertjs.async = false;
insertjs.src = base+'/injector.js';
document.body.appendChild(insertjs);
