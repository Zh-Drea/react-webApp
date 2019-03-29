/**
 * @name Popularize.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 推广中心页面
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
// import 'antd-mobile/dist/antd-mobile.css';
// import { Button } from 'antd-mobile';
require('../css/global.css');

class Popularize extends BaseComponent{

	constructor(props){
		super(props);

		let thiz = this;
		this.pageName = "Popularize";
		this.reduxState = this.props.state[this.pageName];
		this.state = this.reduxState?this.reduxState:{
			nbH:46,
			isDialogShow:false,
			userInfo:{

			},
			qrcode:"",
		};

		// 截取参数
		this.token = this.getWebParam("token");
		if(this.token){
			// 把token存到本地
			this.save("token",this.token);
			this.save("entrance","Popularize");
		}
	}

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
	}

	loadData(){
		let thiz = this;
		thiz.ajax("user/getInfo",{
			headers:{
				"JWT-USER-Authorization":thiz.token,
			},
			success:function(ret){
				if(ret.respCode=="00"){
					thiz.changeState({
						userInfo:ret.data,
					});
				}
			},
			error:function(err){
				
			}
		},"NO");

		// 加载邀请二维码
		thiz.ajax("user/genInvitationQrCode",{
			headers:{
				"JWT-USER-Authorization":thiz.token,
			},
			success:function(ret){
				if(ret.respCode=="00"){
					thiz.changeState({
						qrcode:ret.data,
					});
				}
			},
			error:function(err){
				
			}
		},"NO");
	}

	componentDidMount(){
		let thiz = this;
		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.changeState({
			nbH:nbH
		});

		// 加载数据
		thiz.loadData();

	}

	// 显示二维码
	showQrcode(){
		let thiz = this;
		thiz.setState({
			isDialogShow:true,
		});
		// 弹窗展示规则
		setTimeout(function(){
			var dH = thiz.$("#coinCover").height();
			thiz.changeState({
				dialogTop:(document.body.clientHeight-dH)/2,
			});
		},0);
	}

	render(){
		let thiz = this;
		return (
			<div>

				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")}
				title="推广中心" 
				// rightText="升级"
				leftHandler={()=>{
					thiz.goBack();
				}}
				rightHandeler={()=>{

				}}/>

				<div id="contentPopularize" style={{paddingTop:thiz.state.nbH+20,top:-thiz.state.nbH-20,position:"relative"}}>

					<div id="header" style={{backgroundColor:"white",paddingTop:thiz.state.nbH+40,paddingBottom:70,paddingLeft:15,
					position:"relative",backgroundImage:"url("+require("../images/ybg.jpg")+")",
					backgroundSize:"100% 100%"}}>
						<img style={{width:60,height:60,borderRadius:"50%",display:"inline-block",
						verticalAlign:"middle",marginRight:20,}} src={thiz.state.userInfo.headImageAttachment?thiz.state.userInfo.headImageAttachment.resourceFullAddress:require("../images/avatar.png")}/>
						<div style={{display:"inline-block",verticalAlign:"middle",color:"white"}}>
							<div style={{fontSize:20,}}>{

								(function(){
									let result = "";
									if(thiz.state.userInfo){
										result = thiz.state.userInfo.nickname?thiz.state.userInfo.nickname:thiz.state.userInfo.phoneNo;
									}
									return result;
								})()

							}<span style={{display:thiz.state.userInfo.userType&&thiz.state.userInfo.userType.indexOf("VIP")>=0?"inline-block":"none",fontSize:13,color:"#FF9529",
								backgroundColor:"#1F1F1F",height:15,paddingLeft:8,paddingRight:8,borderRadius:8,marginLeft:15,
								fontStyle:"italic",verticalAlign:"middle",
								}}>{thiz.state.userInfo.userType&&thiz.state.userInfo.userType.indexOf("VIP")>=0?thiz.state.userInfo.userType:""}</span></div>

							<div style={{fontSize:14,marginTop:5,display:thiz.state.userInfo&&thiz.state.userInfo.parentNickname?"block":"none"}}>上级推荐人：<span>{thiz.state.userInfo&&thiz.state.userInfo.parentNickname?thiz.state.userInfo.parentNickname:""}</span></div>
						</div>
						<div style={{position:"absolute",right:0,backgroundColor:"#282828",top:40+70,borderTopLeftRadius:"50%",
								borderBottomLeftRadius:"50%"}}
								onClick={()=>{
									thiz.showQrcode();
								}}>
							<img style={{width:24,height:24,paddingLeft:20,paddingTop:10,paddingBottom:8,paddingRight:10,}} src={require("../images/qrcode.jpg")}/>
						</div>
					</div>

					<div style={{padding:15,position:"relative"}}>
						<div style={{paddingTop:20,paddingBottom:20,backgroundColor:"white",borderRadius:10,}}>
							<div style={{display:"inline-block",width:"50%",textAlign:"center",position:"relative"}}
								onClick={()=>{
									thiz.navigate({
										pathname:"/MyPopularize",
										query:{}
									})
								}}>
								<p style={{fontSize:18,fontWeight:"bold"}}>{thiz.state.userInfo&&thiz.state.userInfo.userMemberStatistics?thiz.state.userInfo.userMemberStatistics.directMemberTotal:""}</p>
								<p style={{fontSize:14,marginTop:10,}}>我的推广</p>
								{/*分割线*/}
								<div style={{width:1,backgroundColor:"#eee",height:"calc(100% - 20px)",position:"absolute"
								,right:0,top:10,}}></div>

							</div>
							<div style={{display:"inline-block",width:"50%",textAlign:"center"}}
								onClick={()=>{
									thiz.navigate({
										pathname:"/MyTeam",
										query:{}
									})
								}}>
								<p style={{fontSize:18,fontWeight:"bold"}}>{thiz.state.userInfo&&thiz.state.userInfo.userMemberStatistics?thiz.state.userInfo.userMemberStatistics.lowerTeamMemberTotal:""}</p>
								<p style={{fontSize:14,marginTop:10,}}>我的团队</p>
							</div>
						</div>
						<div style={{paddingTop:20,paddingBottom:20,backgroundColor:"white",borderRadius:10,marginTop:10,}}>
							<div style={{display:"inline-block",textAlign:"center",width:"33.33%"}}
								onClick={()=>{
									thiz.navigate({
										pathname:"/Poster",
										query:{}
									})
								}}>
								<img style={{width:40,height:40,borderRadius:"50%",marginBottom:5,backgroundColor:"transparent",}}
									src={require("../images/poster.png")}/>
								<p style={{fontSize:14,}}>推广海报</p>
							</div>
							<div style={{display:"inline-block",textAlign:"center",width:"33.33%"}}
								onClick={()=>{
									thiz.navigate({
										pathname:"/Material",
										query:{}
									})
								}}>
								<img style={{width:40,height:40,borderRadius:"50%",marginBottom:5,backgroundColor:"transparent",}}
									src={require("../images/material.png")}/>
								<p style={{fontSize:14,}}>推广素材</p>
							</div>
							<div style={{display:"inline-block",textAlign:"center",width:"33.33%"}}
								onClick={()=>{
									thiz.navigate({
										pathname:"/College",
										query:{}
									})
								}}>
								<img style={{width:40,height:40,borderRadius:"50%",marginBottom:5,backgroundColor:"transparent",}}
									src={require("../images/school.png")}/>
								<p style={{fontSize:14,}}>商学院</p>
							</div>
						</div>
					</div>
				</div>

				{/*二维码弹窗*/}
				<div style={{display:thiz.state.isDialogShow?"block":"none",width:"100%",height:document.body.clientHeight,
					backgroundColor:"rgba(0,0,0,0.5)",position:"absolute",zIndex:"10001",top:0,}}
					onClick={()=>{
						thiz.changeState({
							isDialogShow:false,
						});
					}}>
					<div style={{width:"100%",height:"100%",position:"relative"}}>

						<div style={{position:"absolute",width:"calc(100% - 80px)",left:40,
							top:thiz.state.dialogTop,zIndex:10002}}>

							<div id="coinCover">
								<div style={{backgroundColor:"white",borderRadius:10,padding:20,}}
									 onClick={(e)=>{

										e.stopPropagation();

									}}>
									<p style={{color:"#875940",fontSize:16,textAlign:"center"}}>{thiz.state.userInfo&&thiz.state.userInfo.nickname?thiz.state.userInfo.nickname:""}的小洋匠二维码</p>
									<div style={{marginTop:10,}}>
										<img style={{width:"100%"}} src={thiz.state.qrcode}/>
									</div>
									<div style={{textAlign:"center",marginTop:10,}}>
										<button style={{fontSize:16,}} onClick={(e)=>{

											// 调用原生的保存到相册
											if(window.postMessage){
												window.postMessage(JSON.stringify(
													{
														op:"saveImg",
														data:thiz.state.qrcode,
													}
												));
												// 定时关闭弹窗
												setTimeout(function(){
													thiz.changeState({
														isDialogShow:false,
													});
												},1000);
											}

										}}>保存二维码</button>
									</div>
								</div>
							</div>
							
						</div>

					</div>
				</div>

			</div>
		);
	}
}

Popularize = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(Popularize);
export default Popularize;

