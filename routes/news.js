// Generated by CoffeeScript 1.8.0
(function() {
  var NewsCtrl, express, router;

  express = require("express");

  router = express.Router();

  NewsCtrl = require("./../control/newsCtrl");

  router.post("/save", function(request, response) {
    var content, ent, title;
    ent = request.body.ent;
    title = request.body.title;
    content = request.body.content;
    return NewsCtrl.save(ent, title, content, function(err, res) {
      if (err) {
        return response.json({
          error: 1,
          errMsg: err.message
        });
      } else {
        return response.json({
          error: 0,
          data: res
        });
      }
    });
  });

  router.post("/update", function(request, response) {
    var content, id, title;
    id = request.body.id;
    title = request.body.title;
    content = request.body.content;
    return NewsCtrl.update(id, title, content, function(err, res) {
      if (err) {
        return response.json({
          error: 1,
          errMsg: err.message
        });
      } else {
        return response.json({
          error: 0,
          data: res
        });
      }
    });
  });

  router.get("/list", function(request, response) {
    var ent, page, pageSize;
    page = request.query.page || 0;
    pageSize = request.query.pageSize || 25;
    ent = request.query.ent;
    return NewsCtrl.list(page, pageSize, ent, function(err, res) {
      if (err) {
        return response.json({
          error: 1,
          errMsg: err.message
        });
      } else {
        return response.json({
          error: 0,
          data: res
        });
      }
    });
  });

  router.get("/detail", function(request, response) {
    var id;
    id = request.query.id;
    return NewsCtrl.detail(id, function(err, res) {
      if (err) {
        return response.json({
          error: 1,
          errMsg: err.message
        });
      } else {
        return response.json({
          error: 0,
          data: res
        });
      }
    });
  });

  module.exports = router;

}).call(this);

//# sourceMappingURL=news.js.map