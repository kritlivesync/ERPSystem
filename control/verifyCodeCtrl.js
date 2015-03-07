// Generated by CoffeeScript 1.8.0
(function() {
  var VerifyCodeCtrl;

  VerifyCodeCtrl = (function() {
    var SMS, VerificationCode, async, _;

    function VerifyCodeCtrl() {}

    VerificationCode = require("./../model/verificationCode");

    SMS = require("./../tools/sms");

    _ = require("underscore");

    async = require("async");

    VerifyCodeCtrl.create = function(mobile, fn) {
      var code, i;
      code = ((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i < 4; i = ++_i) {
          _results.push(_.random(9));
        }
        return _results;
      })()).join('');
      return async.auto({
        saveCode: function(cb) {
          var verifiCode;
          verifiCode = new VerificationCode({
            code: code,
            mobile: mobile,
            expire: Date.now() + 60 * 30 * 1000
          });
          return verifiCode.save(function(err, res) {
            return cb(err, res);
          });
        },
        sendSms: [
          "saveCode", function(cb, results) {
            var verifiCode;
            verifiCode = results.saveCode;
            if (verifiCode != null) {
              return SMS.send(mobile, "您的验证码是：" + verifiCode.code + "【联云科技】", function(err, res) {
                return cb(err, res);
              });
            } else {
              return cb(new Error("验证码发送错误"));
            }
          }
        ]
      }, function(err, results) {
        console.log(err, results);
        return fn(err, results.sendSms);
      });
    };

    VerifyCodeCtrl.checkCode = function(mobile, code, fn) {
      return VerificationCode.findOne({
        mobile: mobile,
        code: code,
        expire: {
          $gt: Date.now()
        }
      }, function(err, res) {
        return fn(err, res);
      });
    };

    return VerifyCodeCtrl;

  })();

  module.exports = VerifyCodeCtrl;

}).call(this);