/**
 * Created by zzy on 2014/9/28.
 */
var Customer = require('./../model/customer');
var async = require('async');
var CustomerCtrl = function(){};

CustomerCtrl.getCustomerByMobileOrRegister = function(ent,mobile,name,fn){
    async.waterfall([
        function(cb){
            Customer.findOne({'ent':ent,'mobile':mobile},function(err,customer){
                cb(err,customer);
            });
        },
        function(customer,cb){
            if(customer){
                cb(null,customer);
            } else {
                var crypto = require('crypto');
                var passwd = '123456'
                var md5 = crypto.createHash('md5');
                md5.update(passwd);
                var customer = new Customer({
                    'ent':ent,
                    'mobile':mobile,
                    'name':name,
                    'passwd':md5.digest('hex')
                });
                customer.save(function(err,res){
                    cb(err,res);
                });
            }
        }
    ],function(err,res){
        fn(err,res);
    });
};

CustomerCtrl.register=function(ent,mobile,passwd,loginName,email,birthday,name,address,fn){
    async.auto({
        'checkMobile':function(cb){
            Customer.count({'ent':ent,'mobile':mobile},function(err,res){
               cb(err,res);
            });
        }
        ,'saveCustomer':['checkMobile',function(cb,results){
            if(results.checkMobile>0){
                cb(new Error('手机号码已存在！'),null);
            } else {
                var customer = new Customer( {
                    'ent':ent,
                    'loginName':loginName,
                    'mobile':mobile,
                    'email':email,
                    'passwd':passwd,
                    'birthday':birthday,
                    'name':name,
                    'address':address
                });
                customer.save(function(err,res){
                    cb(err,res);
                });
            }
        }]
    },function(err,results){
        fn(err,results.saveCustomer);
    });
};

CustomerCtrl.detailByWeixin = function(openId,fn){
    Customer.findOne({'weixinOpenId':openId},function(err,customer){
        fn(err,customer);
    });
};

CustomerCtrl.detail = function(id,fn){
    Customer.findById(id,function(err,customer){
        fn(err,customer);
    });
};

CustomerCtrl.login = function(ent,mobile,passwd,fn){
    Customer.findOne({'ent':ent,'mobile':mobile,'passwd':passwd},function(err,customer){
        if(err){
            fn(err,null);
        } else {
            if(customer){
                fn(null,customer);
            } else {
                fn(new Error('用户名或密码错误!'),null);
            }
        }
    });
};

CustomerCtrl.weixinLogin = function(ent,openId,fn){
    Customer.findOne({'ent':ent,'weixinOpenId':openId},function(err,customer){
        fn(err,customer);
    });
};

CustomerCtrl.weixinBind = function(ent,mobile,passwd,openId,fn){
    async.waterfall([
        function(cb){
            Customer.findOne({'ent':ent,'mobile':mobile},function(err,customer){
                if(customer){
                    if(customer.passwd==passwd){
                        cb(null,customer);
                    } else {
                        cb(new Error('用户名或密码错误！'),null);
                    }
                } else {
                    cb(null,null);
                }
            });
        },
        function(customer,cb){
            if(customer){
                Customer.findOneAndUpdate({'ent':ent,'mobile':mobile,'passwd':passwd},{'$set':{'weixinOpenId':openId}},function(err,customer){
                    cb(err,customer);
                });
            } else {
                var customer = new Customer({
                    'ent':ent,
                    'mobile':mobile,
                    'passwd':passwd,
                    'weixinOpenId':openId
                });
                customer.save(function(err,res){
                    fn(err,res);
                });
            }
        }
    ],function(err,res){
        fn(err,res);
    });

};

CustomerCtrl.changePasswd = function(id,oldPasswd,newPasswd,fn){
    Customer.findOneAndUpdate({'_id':id,'passwd':oldPasswd},{'$set':{'passwd':newPasswd}},function(err,res){
       if(err){
           cb(err,null);
       } else {
           if(res){
               cb(null,res);
           } else {
               cb(new Error('密码错误'),null);
           }
       }
    });
};

CustomerCtrl.update = function(id,obj,fn){
    Customer.findByIdAndUpdate(id,{'$set':obj},function(err,res){
        fn(err,res);
    });
};

CustomerCtrl.list = function(page,pageSize,ent,mobile,fn){
    async.parallel([
        function (cb) {
            var query = Customer.find({'ent': ent});
            if(mobile){
                query.where({'mobile':mobile});
            }
            query.skip(page * pageSize);
            query.limit(pageSize);
            query.exec(function (err, customers) {
                cb(err, customers);
            });
        },
        function (cb) {
            var query = Customer.count({'ent': ent});
            if(mobile){
                query.where({'mobile':mobile});
            }
            query.exec(function (err, totalsize) {
                cb(err, totalsize);
            });
        }
    ], function (err, res) {
        if (err) {
            fn(err, null);
        } else {
            fn(null, {
                'totalSize': res[1],
                'customers': res[0]
            });
        }
    });
};
module.exports = CustomerCtrl;