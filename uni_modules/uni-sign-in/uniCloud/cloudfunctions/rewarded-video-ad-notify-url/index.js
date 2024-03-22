'use strict';
const uniADConfig = require('uni-config-center')({
	pluginId: 'uni-ad'
}).config()
let ip = null
const crypto = require('crypto');
const db = uniCloud.database();
exports.main = async (event, context) => {
	ip = context.CLIENTIP;
	//event为客户端上传的参数
	console.log('event : ', event);
	const {
		path,
		queryStringParameters
	} = event;
	const data = {
		adpid: event.adpid,
		platform: event.platform,
		provider: event.provider,
		trans_id: event.trans_id,
		sign: event.sign,
		user_id: event.user_id,
		extra: event.extra,
	}
	// 注意::必须验签请求来源
	const trans_id = event.trans_id;
	//去uni-config-center通过adpid获取secret
	const secret = uniADConfig[event.adpid]
	const sign2 = crypto.createHash('sha256').update(`${secret}:${trans_id}`).digest('hex');
	if (event.sign !== sign2) {
		console.log('验签失败');
		return null;
	}
	//自己的逻辑
	return {
		"isValid": true
	}
};
