var fs = require("fs");
var path = require("path");

var lib = {};

lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = function (dir, file, data, callback) {
  //open the file for writing
  console.log(lib.baseDir);
  //create the directory to put the file
  const folderName = lib.baseDir + dir;
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //convert data to string
        var stringData = JSON.stringify(data);
        //write to file and close it
        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing new file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        console.log(err);
        callback("Could not create new file, it may already exist");
      }
    }
  );
};

lib.read = function (dir, file, callback) {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    function (err, data) {
      callback(err, data);
    }
  );
};

lib.update = function (dir, file, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        var stringData = JSON.stringify(data);
        fs.truncate(fileDescriptor, function (err) {
          if (!err) {
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing the file");
                  }
                });
              } else {
                callback("Error writing to existing file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Couldnot open file for updating, it may not exist yet");
      }
    }
  );
};

lib.delete = function(dir,file,callback){
    fs.unlink(lib.baseDir+dir+"/"+file+".json",function(err){
        if(!err){
            callback(false);
        }else {
            callback("Error deleting file");
        }
    })
}

module.exports = lib;
