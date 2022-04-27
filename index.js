var http = require("http");
var url = require("url");
var StringDecorder = require("string_decoder").StringDecoder;

var server = http.createServer(function (req, res) {
  //Get the url and parse it
  var parsedUrl = url.parse(req.url, true);
  //Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");
  //Get the query string as an object
  var queryStringObject = parsedUrl.query;
  //Get the HTTP method
  var method = req.method.toLowerCase();
  //Get the headers as an object
  var headers = req.headers;
  //Get the payload, if any
  var decorder = new StringDecorder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decorder.write(data);
  });

  req.on("end", function () {
    buffer += decorder.end();

    //Send the response if any
    res.end("Hello World \n");
    //Log the request path
    console.log("Request recieved with these payload: ", buffer);
  });
});

server.listen(3000, function () {
  console.log("The server is listening on port 3000 now");
});
