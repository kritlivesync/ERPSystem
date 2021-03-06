/**
 * Created by zzy on 2014/11/4.
 */
var Feedback = require('./../model/feedback');
var FeedbackCtrl = function(){};

FeedbackCtrl.save = function(name,email,title,msg,ent,fn){
    var feedback = new Feedback({
        'ent':ent,
        'name':name,
        'email':email,
        'title':title,
        'msg':msg
    });
    feedback.save(function(err,res){
        fn(err,res);
    });
};

module.exports = FeedbackCtrl;