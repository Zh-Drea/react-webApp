/**
 * @name MyPopularize.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 我的推广
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

class MyPopularize extends BaseComponent{

	constructor(props){
		super(props);

		this.pageName = "MyPopularize";// 必须要定义
		this.reduxState = this.props.state[this.pageName];
		this.state = this.reduxState?this.reduxState:{
			nbH:46,
			records:[],
			hasMore:false,
			curPage:0,
		};

		this.token = this.get("token");

		this.curPage = this.state.curPage;
		this.hasMore = this.state.hasMore;

		// alert("创建组件"+JSON.stringify(this.props.state));
	}


	loadData(){
		let thiz = this;
		thiz.curPage = 0;
		thiz.hasMore = false;

		thiz.ajax("user/getMemberPage",{
			data:JSON.stringify({
				page:{
					pageSize:20,
					pageNumber:thiz.curPage+1,
				},
				userMemberType:"DIRECT",
			}),
			headers:{
				"JWT-USER-Authorization":thiz.token,
			},
			success:function(ret){
				if(ret.respCode=="00"){
					// alert("loadData加载数据");
					if(ret.data&&ret.data.records.length>0){
						thiz.changeState({
							records:ret.data.records,
							hasMore:ret.data.hasNext,
							curPage:ret.data.pageNumber,
						});
						thiz.hasMore = ret.data.hasNext;
						thiz.curPage = ret.data.pageNumber;
					}
					
				}
			},
			error:function(err){
				
			}
		},this.reduxState?"YES":"NO");
	}



	upToLoad(){

		let thiz = this;

		if(thiz.hasMore){
			thiz.ajax("user/getMemberPage",{
				data:JSON.stringify({
					page:{
						pageSize:20,
						pageNumber:thiz.curPage+1,
					},
					userMemberType:"DIRECT",
				}),
				headers:{
					"JWT-USER-Authorization":thiz.token,
				},
				success:(ret)=>{
					if(ret.respCode=="00"){
						// alert("upToLoad加载数据");
						if(ret.data&&ret.data.records.length>0){

							let rds = thiz.state.records;
							rds = rds.concat(ret.data.records);

							let data = JSON.stringify({
								records:rds,
								hasMore:ret.data.hasNext,
								curPage:ret.data.pageNumber,
							});
							// 解决设置state无效的问题
							thiz.emit(thiz.pageNumber+"upload",JSON.parse(data));

							thiz.hasMore = ret.data.hasNext;
							thiz.curPage = ret.data.pageNumber;
						}
						
					}
				},
				error:function(err){
					
				}
			},"NO");
		}
	}

	componentDidMount(){
		let thiz = this;

		this.listen(thiz.pageNumber+"upload",function(msg,data){
			thiz.changeState(data);
		});

		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.changeState({
			nbH:nbH
		});
		thiz.loadData();

		thiz.$(window).scroll(function () {
			if (thiz.$(window).scrollTop() == thiz.$(document).height() - thiz.$(window).height()) {
				thiz.upToLoad();
			}
		});
		
	}

	render(){
		let thiz = this;
		return (
			<div>

				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")}
				title="我的推广" 
				leftHandler={()=>{
					// 清除数据
					thiz.clearState();
					setTimeout(function(){
						thiz.goBack();
					},100);
				}}
				rightHandeler={()=>{

				}}/>

				<div id="contentMyPopularize" style={{paddingTop:thiz.state.nbH}}>
					<div style={{padding:10,}}>
						{
							thiz.state.records&&thiz.state.records.length>0?thiz.state.records.map(function(item,index){
								return (
									<div key={index} style={{padding:15,borderRadius:10,backgroundColor:"white",marginBottom:index==thiz.state.records.length-1?0:10,}}>
										<div>
											<div style={{display:"inline-block",verticalAlign:"middle"}}>
												<img style={{width:50,height:50,borderRadius:"50%"}} src={item.headImageAttachment&&item.headImageAttachment.resourceFullAddress?item.headImageAttachment.resourceFullAddress:require("../images/avatar.png")}/>
											</div>
											<div style={{display:item.userType&&item.userType.indexOf("VIP")>=0?"inline-block":"none",marginLeft:10,verticalAlign:"middle",fontSize:18,}}>
												<p>{item.nickname?item.nickname:""}<span style={{display:"inline-block",fontSize:13,color:"#FF9529",
											backgroundColor:"#1F1F1F",height:15,paddingLeft:8,paddingRight:8,borderRadius:8,marginLeft:15,fontStyle:"italic"}}>{item.userType?item.userType:""}</span></p>
												<p style={{fontSize:14,}}>{item.phoneNo?item.phoneNo:""}</p>
											</div>
										</div>
										<div style={{marginTop:10,}}>
											<label style={{fontSize:14,}}>注册时间：<span>{item.createDatetime?item.createDatetime:""}</span></label>
											<label style={{marginLeft:"10%"}}>下级团队：<span>{item.memberTotal}</span>人</label>
										</div>
									</div>
								);
							}):null
						}

					</div>

					<thiz.Nomore show={!thiz.state.hasMore}></thiz.Nomore>

				</div>

			</div>
		);
	}

}

MyPopularize = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(MyPopularize);
export default MyPopularize;

