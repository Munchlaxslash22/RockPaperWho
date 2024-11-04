// This will send whatever you type in to whoever sends a request


const {createServer} = require('http');

const server = createServer();

server.on('request', (req , res) => {
    if (req.url === "/favicon.ico") {
        res.statusCode = 404;
        res.end()
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    re = res;
});

let re;

let stdin = process.stdin;

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

let str = '';

// on any data into stdin
stdin.on( 'data', function( key ){
    if (!re) return;

    // ctrl-c ( end of text )
    if ( key === '\u0003' ) {
        process.exit();
    }

    if (key === '\b'){
        let s = str.split('');
        s.pop();
        str = s.join('');
    } else if (key === '\r'){
        re.end(str);
        str = '';
        console.clear();
    }
    else {
        str += key;
    }


    // write the key to stdout all normal like
    console.clear();
    console.log(str);
});


server.listen(80);