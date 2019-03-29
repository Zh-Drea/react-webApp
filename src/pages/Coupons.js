/**
 * @name Coupons.js
 * @auhor 李磊
 * @date 2019.3.5
 * @desc 我的购物券页面
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

class Coupons extends BaseComponent{

	constructor(props){
		super(props);
		this.pageName = "Coupons";
		this.reduxState = this.props.state[this.pageName];
		this.state = this.reduxState?this.reduxState:{
			nbH:46,
			isDialogShow:false,
			dialogTop:250,
			allData:[],
			allCoin:'',
			canUseCoin:'',
			freezeCoin:'',
			questionDate:[],
			questionTitle:'',
			num:1,
			isNull:true,
			isSlide:true,
			isShow:false
		}

		this.save("entrance","Coupons");
	}

	componentDidMount(){
		let thiz = this;
		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.setState({
			nbH:nbH,
		});
		thiz.loadData();
		//监听玩个网页是否滑动到底部
		thiz.$(window).scroll(()=>{
	    	if (thiz.$(window).scrollTop() == thiz.$(document).height() - thiz.$(window).height()) {
	    		thiz.loadCooponsListData();
	    	}
	  	});
	}

	loadCooponsListData(){
		let thiz = this;
		if (!thiz.state.isNull) {
			return;
		}
		//判断app进入的页面类型
		let type;
		let token = thiz.getWebParam("token");
		let cointype = thiz.getWebParam("cointype");
		if (cointype === "buy") {
			type = "SHOPPING_COIN"
		}
		else if (cointype === "bonus") {
			type = "BONUS_COIN"
		}
		else {
			type = "YOUNG_COIN"
		}
		let rep = thiz.state.num + 1;
		thiz.ajax("coinOperateRecord/getPage",{
			headers:{
				"JWT-USER-Authorization":token,
			},
			data:JSON.stringify({
				page:{
					pageNumber:rep,
					pageSize:10
				},
				coinType:type
			}),
			success:function(ret){
				if (ret.respCode === "00") {
					let res = thiz.state.allData;
					if (ret.data.page.records.length > 0) {
						ret.data.page.records.map((value,index)=>{
							res.push(value)
						});
						{(()=>{
							thiz.changeState({allData:res,num:rep})
						})()}
					}
					else{
						thiz.changeState({isNull:false})
					}
				}
				else {
					thiz.toast(ret.errDesc)
				}
			},
			error:function(err){
				thiz.toast('网络异常!')
			}
		},"NO");

	}

	loadData(){
		let thiz = this;
		let type;
		let token = thiz.getWebParam("token");
		let cointype =thiz.getWebParam("cointype");
		if(cointype === "bonus"){
			thiz.setState({isShow:true})
		}
		if(token){
			if (cointype === "buy") {
				type = "SHOPPING_COIN"
			}
			else if (cointype === "bonus") {
				type = "BONUS_COIN"
			}
			else {
				type = "YOUNG_COIN"
			}
			thiz.ajax("coinOperateRecord/getPage",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({
					page:{
						pageNumber:thiz.state.num,
						pageSize:10
					},
					coinType:type
				}),
				success:function(ret){
					if (ret.respCode === "00") {
						if (cointype == "buy") {
							thiz.changeState({
								allData:ret.data.page.records,
								allCoin:ret.data.allCoin,
								canUseCoin:ret.data.canUseCoin,
								freezeCoin:ret.data.freezeCoin,
								questionTitle:"购物币规则",
								title:"我的购物币"
							})
						}
						if (cointype === "bonus") {
							thiz.changeState({
								allData:ret.data.page.records,
								allCoin:ret.data.allCoin,
								canUseCoin:ret.data.canUseCoin,
								freezeCoin:ret.data.freezeCoin,
								questionTitle:"奖金币规则",
								title:"我的奖金币"
							})
						}
						if (cointype === "young") {
							thiz.changeState({
								allData:ret.data.page.records,
								allCoin:ret.data.allCoin,
								canUseCoin:ret.data.canUseCoin,
								freezeCoin:ret.data.freezeCoin,
								questionTitle:"洋匠币规则",
								title:"我的洋匠币"
							})
						}
					}
					else {
						thiz.toast(ret.errDesc)
					}
				},
				error:function(err){
					thiz.toast('网络异常!')
				}
			},"NO");
		}	
	}

	couponsList(){
		let thiz = this;
		let params = thiz.state.allData;
		if (params && params.length > 0) {
			return (
				<div style={{marginTop:20}}>
				    {	
			            params.map((value,index)=>{
			            	let res = "+";
			            	let lastSty = true;
			            	let statusIsShow = true;
			            	let status;
			            	if (index === params.length-1) {
			            		lastSty = false
			            	}
			            	if (value.upAccountStatus === 'NOT_REACH') {
			            		status = "冻结"
			            	}
			            	else if(value.upAccountStatus === "INVALID"){
			            		status = "作废"
			            	}
			            	else {
			            		statusIsShow = false
			            	}
			                return (
		                	<div style={{paddingTop:15,paddingBottom:15,borderBottom:lastSty ? "1px solid #eee" : ""}} key={index}>
		                		<div style={{display:"flex",flexDirection:"row",justifyContent:'space-between'}}>
		                			<div style={{width:"60%"}}>{value.remark}</div>
		                			<div style={{display:statusIsShow ? "block" : "none",backgroundColor:"#171717",height:20,width:45,color:'#FED584'}}>
		                				<span style={{position:'absolute',marginTop:3,marginLeft:13,fontSize:10}}>{status}</span>
		                			</div>
		                		</div>
								<div style={{display:"flex",flexDirection:"row",justifyContent:'space-between'}}>
									<div style={{marginTop:5,}}>
										<label style={{fontSize:14,color:"#696969",marginTop:10}}>{value.createDatetime}</label>
									</div>
									<div style={{display:"flex",flexDirection:"row",top:10}}>
										<strong style={{display:value.coinTotal < 0 ? "none" : "block",color:"#F84E4E",marginTop:3.5}}>{res}</strong>
										<label style={{fontSize:20,color:value.coinTotal < 0 ? "#000000":"#F84E4E",}}>{value.coinTotal}</label>
									</div>
								</div>
							</div>		
		              		);
		           		})
          			}
          		</div>
			)
		}
	}

	loadQuestion(){
		let thiz = this;
		let token = thiz.getWebParam("token");
		let cointype = thiz.getWebParam("cointype");
		let questionType;
		if (cointype === "buy") {
			questionType = 	"SHOPPING_COIN_RULE"				
		}
		if(cointype === "bonus"){
			questionType = "BONUS_COIN_RULE"
		}
		if(cointype === "young"){
			questionType = "YOUNG_COIN_RULE"
		} 
		if(token){
			thiz.ajax("question/getPage",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({questionType:questionType}),
				success:function(ret){
					if (ret.respCode === "00") {
						thiz.setState({questionDate:ret.data.records})
					}
				},
				error:function(err){
					thiz.toast('网络异常!')
				}
			});
		}	
	}

	questionList(){
		let thiz = this;
		if (thiz.state.questionDate&&thiz.state.questionDate.length>0) {
			setTimeout(()=>{
				let dH = thiz.$("#coinCover").height();	
				thiz.setState({
					dialogTop:(document.documentElement.clientHeight-dH)/2,
				});
			},0);
			return(
				<div style={{marginTop:30,}}>
					{
						thiz.state.questionDate.map((value,index)=>{
							return(
								<div style={{marginBottom:20}} key={index}>
									<p>Q：{value.problem}</p>
									<p>A：{value.answer}</p>
								</div>
							)
						})
					}
				</div>
			)
		}
	}

	loadCardData(){
		let thiz = this;
		let token = this.getWebParam("token");
		if(token){
			thiz.ajax("bankcard/getPage",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({}),
				success:function(ret){
					if (ret.respCode === "00") {

						if(ret.data.records&&ret.data.records.length !== 0){
							thiz.navigate({
								pathname:"/Withdraw",
								query:{}
							})
						}
						else{
							thiz.toast("请先绑定银行卡!");
							thiz.navigate({
								pathname:"/CardAdd",
								queryCs:{}
							})
						}			
					}
				},
				error:function(err){
					thiz.toast('网络异常!')
				}
			});
		}	
	}

	render(){
		let thiz = this;
		return (
			<div style={{position:'relative',width:'100%'}}>
				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")} title={thiz.state.title} leftHandler={()=>{
					if(!thiz.props.location.queryMcc){
						// 关闭浏览器（原生app内部）
						setTimeout(function(){
							if(window.postMessage){
								window.postMessage(JSON.stringify(
									{
										op:"closeWebView"
									}
								));
							}
						},500);
						return;
					}
					
				}} rightHandler={()=>{
					// alert("right");
				}}/>
				<div id="content" style={{paddingTop:thiz.state.nbH,position:thiz.state.isSlide?'absolute':'fixed',width:'100%',paddingBottom:60}}>
					{/*顶部黑色区域*/}
					<div style={{backgroundColor:"#171717",padding:20,}}>
						<div>
							<label style={{color:"#FED584",float:"left",fontWeight:"100"}}>{thiz.state.title}</label>
							<div style={{display:"inline",float:"right"}}
								onClick={()=>{
									// 弹窗展示规则
									thiz.setState({
										isDialogShow:true,
										isSlide:false
									});
									thiz.loadQuestion();
								}}>
								<img src={require("../images/help.png")} style={{width:26,height:26,verticalAlign:"middle"}}/>
								<label style={{color:"white",verticalAlign:"middle",fontWeight:"100"}}>{thiz.state.questionTitle}</label>	
							</div>
							<div style={{clear:"both"}}></div>
						</div>						
						<div style={{paddingTop:10}}>
							<label style={{color:"#FED584",fontSize:40,fontWeight:"bold",letterSpacing:2,}}>{thiz.state.allCoin}</label>
							<div style={{marginTop:40}}>
								<label style={{color:"#FED584",fontSize:18,float:"left",fontWeight:"100"}}>可用额度：
									<span style={{fontWeight:"normal"}}>{thiz.state.canUseCoin}</span>
								</label>
								<label style={{color:"#FED584",fontSize:18,float:"right",fontWeight:"100"}}>冻结额度：
									<span style={{fontWeight:"normal"}}>{thiz.state.freezeCoin}</span>
								</label>
								<div style={{clear:"both"}}></div>
							</div>
						</div>
					</div>
					{/*购物券列表*/}
					<div style={{backgroundColor:"white",marginTop:20,paddingLeft:20,paddingRight:20,paddingBottom:0}}>
						{(()=>{
                      		return thiz.couponsList();
                    	})()}
					</div>
					<thiz.Nomore show={!thiz.state.isNull}></thiz.Nomore>
				</div>
				{/*提现按钮*/}
				<div style={{display:thiz.state.isShow ? "block": "none",backgroundColor:"#FFC859",textAlign:"center",paddingTop:15,paddingBottom:15,
				position:"fixed",bottom:0,width:"100%",fontSize:18,fontWeight:"bold",letterSpacing:3,}}
					onClick={()=>{
						{(()=>{
							thiz.setState({isNull:false});
							thiz.loadCardData()
						})()}
					}}>提&nbsp;&nbsp;现</div>

				{/*弹窗遮罩*/}
				<div style={{display:thiz.state.isDialogShow?"block":"none",width:"100%",height:document.body.clientHeight,
					backgroundColor:"rgba(0,0,0,0.5)",position:"fixed",marginBottom:100,zIndex:"10001",top:0,bottom:60}}>
						<div style={{width:"100%",height:"100%"}}>

							<div style={{position:"absolute",width:"calc(100% - 80px)",left:40,
								top:thiz.state.dialogTop,zIndex:10002}}>

								<div id="coinCover" style={{position:'relative'}}>
									<div style={{backgroundColor:"white",borderRadius:10,padding:20,}}>
										<p style={{color:"#875940",fontSize:18,textAlign:"center"}}>{thiz.state.questionTitle}</p>
										{(()=>{
				                      		return thiz.questionList();
				                    	})()}
									</div>
									{/*底部删除*/}
									<div style={{width:"100%",paddingTop:15,paddingBottom:15,textAlign:"center",backgroundColor:"transparent"}}>
										<img src={require("../images/delete.png")} style={{width:40,height:40,backgroundColor:"transparent",
											position:"relative",zIndex:"10003"}}
											onClick={()=>{
												thiz.setState({
													isDialogShow:false,
													isSlide:true
												});
											}}
										/>
									</div>
								</div>				
							</div>
						</div>
				</div>
			</div>
		);
	}

}
Coupons = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(Coupons);
export default Coupons;

