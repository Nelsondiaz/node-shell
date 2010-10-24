var jade = require('jade'),
	connect = require('connect'),
	meryl = require('meryl');
	loki = require('./lib/lokiFunctions')

//http://coffeemate.github.com/meryl/
var opts = {
  templateDir: 'templates',
  templateExt: '.jade',
  templateFunc: function (src, data) {
    return jade.render(src, {locals: data});
  }
};

//Add Connect Static Provider and Session from connect
var memory = new connect.session.MemoryStore({ reapInterval: 60000, maxAge: 24 * 60 * 60000 });

meryl.p(
	connect.staticProvider(),
    connect.cookieDecoder(),
    connect.session({ store: memory, secret: 'foobar' })
);

//Home it says hello...
meryl.h('GET /', function(req, resp){
	if(req.session.user){
		resp.render('layout',
			{content: 'home', context: {user: req.session.user, people: ['Loki']}
		});		
	}else{
		resp.render('layout',
			{content: 'home', context: {user: '',people: ['Loki']}
		});		
	}
});

//Register form
meryl.h('GET /register', function(req,resp){
	resp.render('layout',
		{content: 'register', context: {people: [req.params.yourname, 'alice', 'jane', 'meryl']}
	});
});

//handles register
meryl.h('POST /register', function(req, resp){
	status = loki.registerUser(req, resp);
	console.log('status is: '+status);
})

//handles login request
meryl.h('POST /login', function(req,resp){loki.logInUserController(req,resp)}
/*{
	resp.headers['Content-Type'] = 'text/plain';
	post = loki.parsePost(req.postdata);
	resp.send(post.username +':'+ post.password);
}*/
);

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
