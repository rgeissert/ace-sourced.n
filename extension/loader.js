base = 'https://people.debian.org/~geissert/ace-debsources/';

d = new Date();
s = Date.UTC(d.getUTCFullYear(), d.getUTCDate(), d.getUTCDay());

insertjs = document.createElement('script');
insertjs.type = 'text/javascript';
insertjs.src = base+'/injector.js?'+s;
document.body.appendChild(insertjs);
