var jade = require('jade'),
	connect = require('connect'),
	meryl = require('meryl');

//Declare Jade as template, check other supported templates at meryl
//http://coffeemate.github.com/meryl/
var opts = {
  templateDir: 'templates',
  templateExt: '.jade',
  templateFunc: function (src, data) {
    return jade.render(src, {locals: data});
  }
};

//Add Connect Static Provider
meryl.p(
	connect.staticProvider()
);

//Home it says hello...
meryl.h('GET /', function(req, resp){
	resp.send('Hello, This is a Loki Shell, start develop');	
});

//Render a Template name home, standar template example provided by meryl
//Check template documentation on http://jade-lang.com/
meryl.h('GET /user/{yourname}?',function (req, resp) {
	resp.render('layout',
		{content: 'home', context: {people: [req.params.yourname, 'alice', 'jane', 'meryl']}
	});
});

//File static provider at /public
meryl.h('GET /public/', function(req, resp) {
	connect.staticProvider()
});

//Run Server
meryl.run(opts);
console.log('Connect server listening on port 3000');
