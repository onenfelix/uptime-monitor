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

    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    var data = {
      "trimmedPath": trimmedPath,
      "queryStringObject": queryStringObject,
      "method": method,
      "headers": headers,
      "payload": buffer
    }

    chosenHandler(data, function(statusCode, payload) {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == "object" ? payload : {};

      var payloadString = JSON.stringify(payload);

      res.setHeader("Content-Type","application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response:", statusCode, payloadString);
    })
  });
});

server.listen(3000, function () {
  console.log("The server is listening on port 3000 now");
});

var handlers = {};

handlers.sample = function (data, callback) {
  callback(406, { name: "sample handler" });
};

handlers.notFound = function (data, callback) {
  callback(404);
};

var router = {
  "sample": handlers.sample,
};
