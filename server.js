
/**
 * Module dependencies.
 */

//var connect = require('./../../lib/connect');

var jade = require('jade'),
	connect = require('connect'),
	meryl = require('meryl');
// Visit /style.css


var opts = {
  templateDir: 'templates',
  templateExt: '.jade',
  templateFunc: function (src, data) {
    return jade.render(src, {locals: data});
  }
};
/*
connect.createServer(
    connect.staticProvider({ root: __dirname + '/public', cache: true })
).listen(3000);
*/
meryl.plug(require('connect').staticProvider());

meryl.h('GET /user/{yourname}?',
    function (req, resp) {
		resp.render('layout',
			{content: 'home', context: {people: [req.params.yourname, 'alice', 'jane', 'meryl']}
		});
	}
);

meryl.h('GET /public/', function(req, resp) {
	connect.staticProvider()
});

meryl.run(opts);

console.log('Connect server listening on port 3000');
