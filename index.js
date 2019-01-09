"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _ytdlCore = _interopRequireDefault(require("ytdl-core"));

var _path = _interopRequireDefault(require("path"));

var _shortid = _interopRequireDefault(require("shortid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(body, query, next) {
  var info;
  var format;
  var counter = 0;

  var uploadTemp = _path.default.join(__dirname, _shortid.default.generate());

  console.log(uploadTemp);

  var stream = _fs.default.createWriteStream(uploadTemp);

  var downloadStream = (0, _ytdlCore.default)("http://www.youtube.com/watch?v=".concat(query.id), {
    quality: 'highestaudio',
    filter: 'audioonly'
  });
  downloadStream.on('info', function (eventInfo, eventFormat) {
    info = eventInfo;
    format = eventFormat;
    counter += 1;
    console.log('info counter', counter);

    if (counter === 2) {
      callNext();
    }
  }).pipe(stream);
  stream.on('close', function () {
    counter += 1;
    console.log('close counter', counter);

    if (counter === 2) {
      callNext();
    }
  });

  function callNext() {
    var finalPath = _path.default.join(__dirname, "".concat(info.player_response.videoDetails.title, ".").concat(format.container));

    _fs.default.rename(uploadTemp, finalPath, function (err) {
      if (err) console.log('ERROR: ' + err);
    });

    next(finalPath);
  }
}

