/**
 * @name Withdraw.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 提现
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

export default class Withdraw extends BaseComponent{

	constructor(props){
		super(props);
		this.state = {
			nbH:46,
			isDialogShow:false,
			dialogTop:250,
			isLight:true,
			//显示默认
			isDef:false,
			questionDate:'',
			cardDate:[],
			questionTitle:'',
			//提现金额
			withdrawAmount:'',
			//费率
			withdrawRate:'',
			//最大可提现额度
			maxWithdrawAmount:'',
			//到账金额
			payableAmount:'',
			isSlide:true
		}
	}

	componentDidMount(){
		let thiz = this;
		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.setState({
			nbH:nbH
		});
		thiz.loadCardData();
		thiz.loadMoney();
		//查询银行卡是否为默认的
		// let res = thiz.state.cardDate;
		// res.map((value,index)=>{
		// 	if (thiz.props.location.hasOwnProperty("queryMc")) {
		// 		alert(value.defaultCardNo);
		// 		if (value.id === thiz.props.location.queryMc.bankcardId) {
		// 			alert(value.defaultCardNo);
		// 			if (value.defaultCardNo) {
		// 				 thiz.setState({isDef:true})
		// 			}	
		// 		}
		// 	}
		// 	else if(thiz.props.location.hasOwnProperty("queryBc")){
		// 		if (value.id === thiz.props.location.queryMc.bankcardId) {
		// 			if (value.defaultCardNo) {
		// 				 thiz.setState({isDef:true})
		// 			}	
		// 		}
		// 	}
		// 	else {
		// 		thiz.setState({isDef:true})
		// 	}
		// });

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
						//query是从coupoms界面来的,还是从添加银行卡界面返回的
						if (thiz.props.location.hasOwnProperty("query")) {
							if(ret.data.records&&ret.data.records.length !== 0){
								thiz.setState({cardDate:ret.data.records});
							}
							else{
								thiz.toast("请先绑定银行卡!");
								thiz.navigate({
									pathname:"/CardAdd",
									query:{}
								})
							}
						}
						else{
							thiz.setState({cardDate:ret.data.records});
						}				
					}
				},
				error:function(err){
					thiz.toast('网络异常!')
				}
			});
		}	
	}

	loadQuestion(){
		let thiz = this;
		let token = thiz.getWebParam("token");
		if(token){
			thiz.ajax("question/getPage",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({questionType:"WITHDRAW_CASH_RULE"}),
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
				<div>
					{
						thiz.state.questionDate.map((value,index)=>{
							return(
								<div style={{marginTop:15,paddingBottom:15}}>
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
	/*有三种情况：1.从上级页面进入,显示字段defaultCardNo为true的银行卡。
	*			2.从银行卡列表选中银行卡,选择的银行卡作为提现界面银行卡显示。queryMc为此操作传入的id
	*			3.当选中并确认后银行卡跳到银行卡界面后,再次进入银行卡列表界面,没有确认选择
	*			点击左边返回上一级界面,显示上一次选中的银行卡。queryBc为此操作传入的id
	*/
	getBankTpl(){
		let thiz = this;
		let params = thiz.state.cardDate;
		let isDef = false;
		if (params && params.length > 0) {
			return (
				<div>
				    {		
			            params.map((value,index)=>{
		            		if (thiz.props.location.hasOwnProperty("queryMc")) {
	            				if (value.id === thiz.props.location.queryMc.bankcardId) {
            						if (value.defaultCardNo) {
            							isDef = true
            						}
				            		return (
			                			<div style={{paddingTop:15,paddingLeft:20,paddingRight:20,paddingBottom:15}}>
											<div style={{backgroundColor:isDef ? "#02A3AA" : "#518DCE",borderRadius:5,color:"white",
												paddingTop:20,paddingBottom:20,paddingLeft:15,paddingRight:15,
												position:"relative"}} onClick={()=>{
														thiz.navigate({
															pathname:"/MyBankCard",
															queryMcc:{
																"mbcId":value.id
															}
														});
													}}>
												<div>
													<label style={{display:"block",width:"100%"}}>{value.bankName}
														<span style={{float:"right",fontSize:12,border:"1px solid white",
															borderRadius:6,paddingTop:2,paddingLeft:8,paddingRight:8,
															paddingBottom:2,marginRight:40,display:isDef ? "block" : "none"}}>默认
														</span>
													</label>
													<div style={{marginTop:5,}}>{value.prefixCardNo} **** **** {value.suffixCardNo}</div>
												</div>
												<div style={{position:"absolute",right:15,top:35}}>
													<span style={{width:14,height:14,display:"block",borderTop:"1px solid white",
													borderRight:"1px solid white",transform:"rotate(45deg)"}}></span>
												</div>
											</div>
										</div>
			              			)
	            				} 
		            		}
		            		else if (thiz.props.location.hasOwnProperty("queryBc")) {
		            			if (value.id === thiz.props.location.queryBc.bankcardId) {
		            				if (value.defaultCardNo) {
	            						isDef = true
	            					}
				            		return (
			                			<div style={{paddingTop:15,paddingLeft:20,paddingRight:20,paddingBottom:15}}>
											<div style={{backgroundColor:isDef ? "#02A3AA" : "#518DCE",borderRadius:5,color:"white",
											paddingTop:20,paddingBottom:20,paddingLeft:15,paddingRight:15,
											position:"relative"}} onClick={()=>{
														thiz.navigate({
															pathname:"/MyBankCard",
															queryMcc:{
																"mbcId":value.id
															}
														});
													}}>
												<div>
													<label style={{display:"block",width:"100%"}}>{value.bankName}
														<span style={{float:"right",fontSize:12,border:"1px solid white",
															borderRadius:6,paddingTop:2,paddingLeft:8,paddingRight:8,
															paddingBottom:2,marginRight:40,display:isDef ? "block" : "none"}}>默认
														</span>
													</label>
													<div style={{marginTop:5,}}>{value.prefixCardNo} **** **** {value.suffixCardNo}</div>
												</div>
												<div style={{position:"absolute",right:15,top:35}}>
													<span style={{width:14,height:14,display:"block",borderTop:"1px solid white",
													borderRight:"1px solid white",transform:"rotate(45deg)"}}></span>
												</div>
											</div>
										</div>
			              			)
	            				} 
		            		}
		            		else{
		            			if (value.defaultCardNo) {
		            			    return (
			                			<div style={{paddingTop:15,paddingLeft:20,paddingRight:20,paddingBottom:15}}>
											<div style={{backgroundColor:"#02A3AA",borderRadius:5,color:"white",
											paddingTop:20,paddingBottom:20,paddingLeft:15,paddingRight:15,
											position:"relative"}} onClick={()=>{
														thiz.navigate({
															pathname:"/MyBankCard",
															queryMcc:{
																"mbcId":value.id
															}
														});
													}}>
												<div>
													<label style={{display:"block",width:"100%"}}>{value.bankName}
														<span style={{float:"right",fontSize:12,border:"1px solid white",
															borderRadius:6,paddingTop:2,paddingLeft:8,paddingRight:8,
															paddingBottom:2,marginRight:40}}>默认
														</span>
													</label>
													<div style={{marginTop:5,}}>{value.prefixCardNo} **** **** {value.suffixCardNo}</div>
												</div>
												<div style={{position:"absolute",right:15,top:35}}>
													<span style={{width:14,height:14,display:"block",borderTop:"1px solid white",
													borderRight:"1px solid white",transform:"rotate(45deg)"}}></span>
												</div>
											</div>
										</div>
		              				)
		            			}
		            			else if (index === 0) {
		            				return (
			                			<div style={{paddingTop:15,paddingLeft:20,paddingRight:20,paddingBottom:15}}>
											<div style={{backgroundColor:"#518DCE",borderRadius:5,color:"white",
											paddingTop:20,paddingBottom:20,paddingLeft:15,paddingRight:15,
											position:"relative"}} onClick={()=>{
														thiz.navigate({
															pathname:"/MyBankCard",
															queryMcc:{
																"mbcId":value.id
															}
														});
													}}>
												<div>
													<label style={{display:"block",width:"100%"}}>{value.bankName}
														<span style={{float:"right",fontSize:12,border:"1px solid white",
															borderRadius:6,paddingTop:2,paddingLeft:8,paddingRight:8,
															paddingBottom:2,marginRight:40,display:"none"}}>默认
														</span>
													</label>
													<div style={{marginTop:5,}}>{value.prefixCardNo} **** **** {value.suffixCardNo}</div>
												</div>
												<div style={{position:"absolute",right:15,top:35}}>
													<span style={{width:14,height:14,display:"block",borderTop:"1px solid white",
													borderRight:"1px solid white",transform:"rotate(45deg)"}}></span>
												</div>
											</div>
										</div>
		              				)
		            			}
		            		}
		           		})
	      			}
	      		</div>
			)
		}
	}
	//初始请求数据为0，返回额度和费率和到账金额
	loadMoney(){
		let thiz = this;
		let token = thiz.getWebParam("token");
		if(token){
			thiz.ajax("withdrawRule/computeResult",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({applyWithdrawAmount:0.00}),
				success:function(ret){
					if (ret.respCode === "00") {
						thiz.setState({
							withdrawRate:ret.data.withdrawRule.withdrawRate,
							maxWithdrawAmount:ret.data.maxApplyWithdrawAmount,
							payableAmount:ret.data.payableAmount
						})
					}
				},
				error:function(err){
					thiz.toast('网络异常!')
				}
			});
		}	
	}
	//当输入值金额格式不正确,不会立即刷新费率金额的接口,会等input失去焦点后请求。
	inputOnBlur =()=>{
		let thiz = this;
		let token = thiz.getWebParam("token");
		let myreg=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (!myreg.test(thiz.state.withdrawAmount)) {
        	if(token){
				thiz.ajax("withdrawRule/computeResult",{
					headers:{
						"JWT-USER-Authorization":token,
					},
					data:JSON.stringify({applyWithdrawAmount:0.00}),
					success:function(ret){
						if (ret.respCode === "00") {
							{(()=>{	
		                  		thiz.setState({
								withdrawRate:ret.data.withdrawRule.withdrawRate,
								maxWithdrawAmount:ret.data.maxApplyWithdrawAmount,
								payableAmount:ret.data.payableAmount,
								withdrawAmount:''
								})
		               		})()}
						}
						else{
							thiz.toast(JSON.stringify(ret.errDesc))
						}
					},
					error:function(err){
						thiz.toast('网络异常!')
					}
				});
			}
            return false;
        }
	}

	//输入金额改变,则改变界面对应的数值
	changeMoney = (e) =>{
		let thiz = this;
		thiz.setState({
			withdrawAmount:e.target.value
		});
		let token = thiz.getWebParam("token");
		let myreg=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (!myreg.test(e.target.value)) {
            return false;
        }
		if (e.target.value) {
			thiz.setState({
				withdrawAmount:e.target.value
			});
			if(token){
				thiz.ajax("withdrawRule/computeResult",{
					headers:{
						"JWT-USER-Authorization":token,
					},
					data:JSON.stringify({applyWithdrawAmount:e.target.value}),
					success:function(ret){
						if (ret.respCode === "00") {
							{(()=>{	
	                      		thiz.setState({
								withdrawRate:ret.data.withdrawRule.withdrawRate,
								maxWithdrawAmount:ret.data.maxApplyWithdrawAmount,
								payableAmount:ret.data.payableAmount
								})
	                   		})()}
						}
						else{
							thiz.toast(ret.errDesc)
						}
					},
					error:function(err){
						thiz.toast('网络异常!')
					},
					extra:{
						isflower:"NO"
					}
				});
			}	
		}
		else{
			thiz.setState({
				withdrawAmount:e.target.value
			});
			let token = thiz.getWebParam("token");
			if(token){
				thiz.ajax("withdrawRule/computeResult",{
					headers:{
						"JWT-USER-Authorization":token,
					},
					data:JSON.stringify({applyWithdrawAmount:0.00}),
					success:function(ret){
						if (ret.respCode === "00") {
							// alert("数据"+JSON.stringify(ret));
							{(()=>{	
	                      		thiz.setState({
								withdrawRate:ret.data.withdrawRule.withdrawRate,
								maxWithdrawAmount:ret.data.maxApplyWithdrawAmount,
								payableAmount:ret.data.payableAmount
								})
	                   		})()}
						}
						else{
							thiz.toast(ret.errDesc)
						}
					},
					error:function(err){
						thiz.toast('网络异常!')
					}
				});
			}	
		}
	}

	withdrawSave(){
		let thiz = this;
		if (thiz.props.location.hasOwnProperty("queryMc")) {
			thiz.cashMoneyRequest(thiz.props.location.queryMc.bankcardId);
		}
		else if(thiz.props.location.hasOwnProperty("queryBc")){
			thiz.cashMoneyRequest(thiz.props.location.queryBc.bankcardId);
		}
		else{
			let sendCardId;
			thiz.state.cardDate.map((value,index)=>{
				if (value.defaultCardNo) {
					sendCardId = value.id
				}
				else if(index === 0){
					sendCardId = value.id
				}
			});
			thiz.cashMoneyRequest(sendCardId);
		}
	}

	cashMoneyRequest=(res)=>{
		let thiz = this;
		let token = thiz.getWebParam("token");
		let myreg=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
        if (!myreg.test(thiz.state.withdrawAmount)) {
        	thiz.toast('金额格式错误!');
			if(token){
				thiz.ajax("withdrawRule/computeResult",{
					headers:{
						"JWT-USER-Authorization":token,
					},
					data:JSON.stringify({applyWithdrawAmount:0.00}),
					success:function(ret){
						if (ret.respCode === "00") {
							// alert("数据"+JSON.stringify(ret));
							{(()=>{	
	                      		thiz.setState({
								withdrawRate:ret.data.withdrawRule.withdrawRate,
								maxWithdrawAmount:ret.data.maxApplyWithdrawAmount,
								payableAmount:ret.data.payableAmount,
								withdrawAmount:''
								})
	                   		})()}
						}
						else{
							thiz.toast(ret.errDesc)
						}
					},
					error:function(err){
						thiz.toast('网络异常!')
					}
				});
			}
            return false;
        }
		if(token){
			thiz.ajax("applyWithdrawCash/save",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({
					applyWithdrawAmount:thiz.state.withdrawAmount,
					bankcardId:res
				}),
				success:function(ret){
					if (ret.respCode === "00") {

						if(window.postMessage){
							window.postMessage(JSON.stringify(
								{
									op:"withdrawSuccess",
									data:{},
								}
							));
						}
						thiz.navigate({
							pathname:"/WithdrawDetail",
							queryWd:{
								"wBankName":ret.data.bankcard.bankName,
								"wSuffixCardNo":ret.data.bankcard.suffixCardNo,
								"wPayableAmount":ret.data.payableAmount,
								"wApplyWithdrawAmount":ret.data.applyWithdrawAmount,
								"wWithdrawRate":ret.data.withdrawRule.withdrawRate
							}
						});
					}
					else{
						thiz.toast(ret.errDesc)
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
			<div>
				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")} 
				rightIcon={require("../images/record.png")}
				title="提现" 
				leftHandler={()=>{
					thiz.navigate({
						pathname:"/Coupons",
						query:{}
					});
				}} rightHandler={()=>{
					thiz.navigate({
						pathname:"/WithdrawRecord",
						query:{}
					});
				}}/>

				<div id="contentWithDraw" style={{paddingTop:thiz.state.nbH,position:thiz.state.isSlide?'absolute':'fixed',width:'100%'}}>

					{/*银行卡列表信息*/}
					{(()=>{
                      return thiz.getBankTpl();
                    })()}

					{/*提现区域*/}
					<div style={{backgroundColor:"white",paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,}}>
						<div>
							<label>最大可提现额度：<span>{thiz.state.maxWithdrawAmount}</span></label>
							<img src={require("../images/help_gray.png")} style={{width:28,height:28,float:"right",
							position:"relative",top:-5}}
								onClick={()=>{// 弹窗展示规则
									thiz.setState({
										isDialogShow:true,
										isSlide:false
									});
									thiz.loadQuestion();
								}}/>
						</div>
						<div style={{marginTop:20,}}>
							<label style={{fontSize:34,verticalAlign:"middle"}}>￥</label>
							<input placeholder="请输入提现金额" value={thiz.state.withdrawAmount} onChange={thiz.changeMoney} onBlur={thiz.inputOnBlur}
								style={{fontSize:20,verticalAlign:"middle"}}/>
						</div>
						<div style={{marginTop:30,}}>
							<label style={{color:"#525252"}}>费率：<span>{thiz.state.withdrawRate}</span></label>
							<label style={{color:"#525252",float:"right"}}>到账金额：<span>{thiz.state.payableAmount}</span></label>
						</div>
					</div>

					{/*提现按钮*/}
					<div style={{marginTop:40,textAlign:"center",paddingLeft:20,paddingRight:20,}}>
						<button style={{width:"100%",fontSize:22,borderRadius:8,backgroundColor:"#FFC859",
						paddingTop:8,paddingBottom:8,}}
						onClick={()=>{
							if (thiz.state.withdrawAmount == 0) {
								thiz.toast("请输入提现金额!");
							}
							else{
								thiz.withdrawSave();
							}
						}}>提&nbsp;&nbsp;&nbsp;&nbsp;现</button>
					</div>
				</div>

				{/*弹窗遮罩*/}
				<div style={{display:thiz.state.isDialogShow?"block":"none",width:"100%",height:document.body.clientHeight,
					backgroundColor:"rgba(0,0,0,0.5)",position:"absolute",zIndex:"10001",top:0,position:"fixed"}}>
						<div style={{width:"100%",height:"100%"}}>

							<div style={{position:"absolute",width:"calc(100% - 80px)",left:40,
								top:thiz.state.dialogTop,zIndex:10002}}>

								<div id="coinCover">
									<div style={{backgroundColor:"white",borderRadius:10,padding:20,}}>
										<p style={{color:"#875940",fontSize:18,textAlign:"center"}}>提现说明</p>
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
											}}/>
									</div>
								</div>
							</div>
						</div>
				</div>
			</div>
		);
	}
}

