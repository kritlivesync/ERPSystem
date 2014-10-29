/**
 * Created by zzy on 2014/9/23.
 */
var Schema = require('mongoose').Schema;

var customerSchema = new Schema({
    'ent':{type:Schema.Types.ObjectId,ref:'Ent'},
    'loginName':String,
    'mobile':String,
    'email':String,
    'passwd':String,
    'createDate':{'type': 'Number', 'default': Date.now},
    'birthday':Number,
    'name':String,
    'address':String,
    'isEnable': {'type': 'Boolean', 'default': true},
    'weixinOpenId':String
});
customerSchema.index({'ent':1});
customerSchema.index({'ent':1,'mobile':1});
customerSchema.index({'ent':1,'mobile':1,'passwd':1});
customerSchema.index({'weixinOpenId':1});
customerSchema.index({'ent':1,'weixinOpenId':1});

var Customer = db.model('Customer',customerSchema);
module.exports = Customer;