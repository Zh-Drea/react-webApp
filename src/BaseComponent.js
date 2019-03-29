
/**
 * @name BaseComponent.js
 * @auhor 李磊
 * @date 2019.3.1
 * @desc 基本的Component，封装了组件很常用的一些功能，包括打印、提示、请求、消息等
 */
import React,{Component} from 'react';
// import jQuery from 'jquery';
// 消息发送和接收组件
import PubSub from "pubsub-js";
// 配置
import conf from "./config.js";
// 提示组件
import {Toast} from "antd-mobile";
import { connect } from 'react-redux';
// 解决低版本webview的Object.assign无效的组件
import objAssign from 'object-assign';


class BaseComponent extends Component{

	// 屏幕宽高
	static WW = document.body.clientWidth;
	static WH = document.body.clientHeight;

	// 全局connect
	static connect = connect;
	// 用于组件获取redux中的数据，并把数据作为属性传给组件
	static mapStateToProps(state) {
	    return {
	        state:state.data,
	    }
	};
	// 把redux的修改函数作为属性传给组件，可以进行封装
	static mapDispatchToProps(dispatch) {
	    return {
	        opState:dispatch
	    }
	};


	constructor(props){
		super(props);
		
		// 配置
		this.config = {
			// 打印开关（默认打开）
			isLog:true
		};
		
		// 注册jquery
		// this.$ = jQuery;
		this.$ = window.jQuery?window.jQuery:{};
		// ajax请求超时时间
		this.TIMEOUT = 30000;
		// 用于标记当前加载弹窗是否显示出来
		this.isLoading = false;
		
	}

	/**
	 * @method changeState
	 * @params data->需要备份到redux中的数据；delay->延迟备份的时间
	 * @return
	 * @desc 集成设置组件state和备份数据到redux
	 */
	changeState(data,delay){
		let thiz = this;
		if(data){
			thiz.setState(data);
		}
		// 更新到redux，延时更新，因为这个时候组件state可能还没有更新
		setTimeout(function(){
			thiz.props.opState({
				type:"UPDATE",
				payload:{
					pageName:thiz.pageName,
					pageState:thiz.state,
				},
			});
		},delay>0?delay:100);

		return this;
	}

	/**
	 * @method clearState
	 * @params pn->要清除数据的页面名称
	 * @return
	 * @desc 清除当前页面在redux中备份的数据
	 */
	clearState(pn){
		let thiz = this;
		thiz.props.opState({
			type:"UPDATE",
			payload:{
				pageName:thiz.pageName,
				pageState:null,
			},
		});

		return this;
	}

	/**
	 * @method log
	 * @params mark->打印标记；msg->打印内容
	 * @return
	 * @desc 打印函数，通过传入的标记（mark）来区分打印内容
	 */
	log(mark,msg){

		if(this.config.isLog){
			let mk = "";
			if(mark){mk = mark;}
			if(msg instanceof Array || msg instanceof Object){
				msg = JSON.stringify(msg);
			}
			console.log("@"+mk+"  "+msg);
		}
		
		// 默认返回当前指针，方便链式操作
		return this;
		
	}

	/**
	 * @method toast
	 * @params msg->提示内容；
	 * @return
	 * @desc 普通提示
	 */
	toast(msg,duration) {
		let thiz = this;
		// 使用layui
		// alert(window.layer);
		if(window.layer&&window.layer.open){
			window.layer.msg(msg);
		}

		return this;
	}

	/**
	 * @method loading
	 * @params 
	 * @return
	 * @desc 数据加载Loading动画
	 */
	loading(){
		let thiz = this;
		thiz.loadingArr = thiz.loadingArr||[];
		// 显示加载中
		if(!thiz.isLoading){
			thiz.isLoading = true;
			if(window.layer){
				let index = window.layer.open({
					type:3,
				});
				thiz.loadingArr.push(index);
			}
		}

		return this;
	}

	/**
	 * @method closeLoading
	 * @params 
	 * @return
	 * @desc 关闭并清除当前窗口的所有Loading动画
	 */
	closeLoading(){
		let thiz = this;
		thiz.isLoading = false;
		// 延时200毫秒关闭，优化体验
		setTimeout(function(){
			if(window.layer&&thiz.loadingArr){
				for(let i=0;i<thiz.loadingArr.length;i++){
					window.layer.close(thiz.loadingArr[i]);
				}
				// 清空记录
				thiz.loadingArr = [];
			}
		},500);
	}

	/**
	 * @method emit
	 * @params name->消息名字；msg->消息内容，JSON对象
	 * @return
	 * @desc 发送消息，对应是用listen来监听
	 */
	emit(name,msg){

		if(PubSub){
			PubSub.publish(name,msg);
		}else{
			console.error("emit依赖pubsub-js组件，请先安装");
		}
		
		// 默认返回当前指针，方便链式操作
		return this;
	}

	/**
	 * @method listen
	 * @params name->消息名字，可以传数组；callback->回调函数
	 * @return
	 * @desc 监听消息
	 */
	listen(name,callback){

		if(PubSub){
			PubSub.subscribe(name,callback);
		}else{
			console.error("listen依赖pubsub-js组件，请先安装");
		}
		
		// 默认返回当前指针，方便链式操作
		return this;
	}

	/**
	 * @method save
	 * @params key->数据键；value->值
	 * @return 
	 * @desc 保存数据到本地，封装于localstorage
	 */
	save(key,value){

		if(window.localStorage){
			if(value instanceof Array || value instanceof Object){
				value = JSON.stringify(value);
			}
			window.localStorage.setItem(key,value);
		}

		// 默认返回当前指针，方便链式操作
		return this;
	}

	/**
	 * @method get
	 * @params key->数据键
	 * @return 
	 * @desc 获取指定键名的数据
	 */
	get(key){

		let value = null;
		if(window.localStorage){
			try{
				value = window.localStorage.getItem(key);
			}catch(e){
				// console.error("get中获取数据出错");
			}
		}

		try{
			value = JSON.parse(value);
		}catch(e){
			// console.error("get中JSON.parse解析出错");
		}

		return value;
	}

	/**
	 * @method remove
	 * @params key->数据键
	 * @return 
	 * @desc 删除指定键名的数据
	 */
	remove(key){

		if(window.localStorage){
			window.localStorage.removeItem(key);
		}

		// 默认返回当前指针，方便链式操作
		return this;

	}

	/**
	 * @method goBack
	 * @params 
	 * @return
	 * @desc 返回上一页
	 */
	goBack(){
		let thiz = this;

		// 判断当前页面是不是入口页面
		let entrance = this.get("entrance");
		if(entrance===this.pageName && !this.props.location.query){
			// 清除entrance
			this.remove("entrance");
			// 关闭浏览器（原生app内部）
			setTimeout(function(){
				if(window.postMessage){
					window.postMessage(JSON.stringify(
						{
							op:"closeWebView"
						}
					));
				}
			},100);
		}else{
			window.history.back();
		}
		
		return this;
	}

	/**
	 * @method navigate
	 * @params path->路由名称
	 * @return
	 * @desc 导航到某个路由
	 */
	navigate(path){
		this.props.history.push(path);
		return this;
	}

	/**
	 * @method Nomore
	 * @params props->属性
	 * @return 没有更多视图
	 * @desc 该函数是一个函数组件，公用的没有更多数据的组件
	 */
	Nomore(props){
		return (
			<div style={{display:props.show?"block":"none",textAlign:"center",color:"#aaa",
			fontSize:14,paddingTop:0,paddingBottom:20,paddingTop:20,}}>
				没有更多数据了
			</div>
		);
	}

	/**
	 * @method ajax
	 * @params url->请求地址；config->请求配置；stopLoad->是否禁止加载，默认是 "NO"，可以传 "YES" 和 "NO"，实例如下：
	 	{
			type:"POST",
			dataType:"json",
			timeout:30000,
			headers: {
			    "Accept": "application/json",
			    "Content-Type": "application/json"
			},
			data:{},
			success:function(ret){
				
			},
			error:function(err){
				
			},
			// 额外的请求特性，isflower是是否需要显示加载动画
			extra:{
				isflower:"NO",
			}
	 	}；
	 * @return
	 * @desc 公用请求函数
	 */
	ajax(url,ac,stopLoad){
		let thiz = this;
		let sl = stopLoad&&stopLoad==="YES"?true:false;

		function exe(){
			if(thiz.$){
				if(url){
					// 默认配置
					let dc = {
						type:"POST",
						url:conf.baseURL+url,
						dataType:"json",
						data:{},
						extra:{
							isflower:"YES",
						}
					};

					let headers = {
						"Accept": "application/json",
						"Content-Type": "application/json",
					};
					if(ac.headers){
						// headers = Object.assign(headers,ac.headers);
						headers = objAssign(headers,ac.headers);
					}
					thiz.log("--------headers--------",headers);

					// 请求成功回调
					let success = function(ret){
						thiz.closeLoading();
						thiz.log("--------ajax_ret--------",ret);

						if(ret.respCode=="-1"){
							thiz.toast(ret.errDesc);
						}

						if(ac&&ac.success){
							ac.success(ret);
						}
					};

					// 请求失败回调
					let error = function(err){
						thiz.closeLoading();
						thiz.log("--------ajax_err--------",err);

						thiz.toast("请求异常");

						if(ac&&ac.error){
							ac.error(err);
						}
					};

					if(ac){
						// dc = Object.assign(dc,ac);
						dc = objAssign(dc,ac);
						dc.headers = headers;
						dc.success = success;
						dc.error = error;
					}

					// thiz.log("--------dc--------",dc);

					// 加载进度
					if(dc.extra&&dc.extra.isflower==="NO"){
							
					}else{// 默认要显示加载
						setTimeout(function(){
							thiz.loading();
						},200);
					}

					thiz.$.ajax(dc);
				}
			}else{
				console.error("ajax依赖jquery，请先安装");
			}
		};
		if(!sl){
			exe();
		}
	}

	/**
	 * @method getWebParam
	 * @params name->参数名称
	 * @return 返回参数值
	 * @desc 获取指定参数的值
	 */
	getWebParam(name){
		let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    let r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return unescape(r[2]);
	    }
	    return null;
	}

}

export default BaseComponent;


