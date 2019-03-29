/**
 * @name MyBankCard.js
 * @auhor 曾粒宗
 * @date 2019.3.5
 * @desc 我的银行卡
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
import NavTop from '../components/NavTop';
import {Link} from 'react-router-dom';
require('../css/global.css');

class MyBankCard extends BaseComponent{
	
	constructor(props){
		super(props);
		this.pageName = "MyBankCard";
		this.reduxState = this.props.state[this.pageName];
		this.state = this.reduxState?this.reduxState:{
			height:  window.document.body.clientHeight,
			data:'',
			idBankCard:'',
			isShow:true,
			isLoad:true
		}

		this.save("entrance","MyBankCard");
	}

	reloadHeight = () => {
		let thiz = this;
    	thiz.setState({height: window.document.body.clientHeight})
	}

	componentDidMount() {	
		let thiz = this;
		if (thiz.props.location.hasOwnProperty("queryMcc")) {
			thiz.setState({isShow:false})
		}	
		thiz.loadData();
	}

	loadData(){
		let thiz = this;
	 	// 截取参数
		let token = thiz.getWebParam("token");
		if(token){
			thiz.ajax("bankcard/getPage",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({}),
				success:function(ret){
					if (ret.respCode === "00") {
						 ret.data.records.map((value,index)=>{
						 	if (value.defaultCardNo) {
						 		value.isLight=true
						 	}
						 	else{
						 		value.isLight=false
						 	}
						 	if (thiz.props.location.hasOwnProperty("queryMcc")) {
						 		value.isLight = false;
						 		if (value.id === thiz.props.location.queryMcc.mbcId) {
						 			value.isLight =true
						 		}
						 	}
						 })
						thiz.changeState({data:ret.data.records})
					}
				},
				error:function(err){
					console.log("请求失败数据---------------"+JSON.stringify(err))
				}
			},"NO");//yes禁止加载数据，no允许加载数据
		}	
	}

	getBankTpl(){
		let thiz = this;
		let params = thiz.state.data;
		if (params && params.length > 0) {
			return (
				<div style={{marginTop:50}}>
				    {
			            params.map((value,index)=>{
			                return (
		                		<div className="mbc-container-card" key={index} style={{backgroundColor: value.defaultCardNo === true ? "#02A3AA" : "#518DCE"}} 
		                			onClick={()=>{
		                				if (!thiz.state.isShow) {
		                					thiz.navigate({
												pathname:"/Withdraw",
												queryMc:{
													"bankcardId":value.id
												}
											});
										}
										else{
											thiz.navigate({
													pathname:"/CardDel",
													query:{
													}
											});
											thiz.save("bankId",value.id)
										}	
		                	    }}>
									<div className="mbc-bank">
										<div className="mbc-bankname mbc-font-color-bankname">{value.bankName}</div>
										<div className="mbc-font-color-button" style={{display: value.defaultCardNo ? "block": "none"}}>默认</div>
									</div> 
									<div style={{color:'white',display:'flex',flexDirection:'row'}}>
										<span style={{marginLeft:29,marginTop:5,marginBottom:15,fontSize:12}}>{value.cardType}</span>
									</div>
									<div className="mbc-card" style={{marginTop:-10}}>
										<div className="mbc-card-num">
											<div className="mbc-font-color-bankname mbc-num-position">****</div>
											<div className="mbc-font-color-bankname mbc-num-position">****</div>
											<div className="mbc-font-color-bankname mbc-num-position">****</div>
											<div className="mbc-font-color-bankname mbc-num-image">{value.suffixCardNo}</div>
										</div>
									    <div className="mbc-num-position"><span style={{width:11,height:11,display:thiz.state.isShow ? "block" : "none",borderTop:"1px solid white",
											borderRight:"1px solid white",transform:"rotate(45deg)"}}></span>
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

	setIsLight = (param)=>{
		let thiz = this;
		thiz.state.data.map((value,index)=>{
			value.isLight = false;
		 	if (param.id === value.id) {
		 		value.isLight= !value.isLight
		 	}
		 });
		thiz.setState({data:thiz.state.data})
	}

	render(){
		let thiz = this;
		let query = {
			pathname:"/CardRelieve",
			query:{name:"组件"}
		};
		let queryDel = {
			pathname:"/CardDel",
			queryDel:{name:"组件"}
		};
		let stateAdd = {
			pathname:"/CardAdd",
			stateAdd:{name:"组件"}
		};
		let queryIm = {
			pathname:"/IssueMatter",
			queryIm:{name:"组件"}
		};
		let querySm = {
			pathname:"/ShareMatter",
			querySm:{name:"组件"}
		};
		let queryBc = {
			pathname:"/Withdraw",
			queryBc:{}
		};
		return(
			<div className="mbc-all">
				<div className="mbc-header">
				<NavTop title="我的银行卡" leftIcon={require("../images/back.png")} 
				rightIcon={thiz.state.isShow ? require("../images/more.png"): ""} 
				leftHandler={()=>{
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

					if (thiz.props.location.hasOwnProperty("queryMcc")) {
						thiz.clearState();
						thiz.navigate({
							pathname:"/Withdraw",
							queryBc:{"bankcardId":thiz.props.location.queryMcc.mbcId}
						});
					}
				}} rightHandler={()=>{
					if (thiz.state.isShow) {
						thiz.navigate({
							pathname:"/CardAdd",
							query:{}
						});
					}
				}}/></div>
				<div className="mbc-container" id="box" style={{positon:"fixed"}}>
					{(()=>{
                      return thiz.getBankTpl();
                    })()}
				</div>
			</div>
		)
	}
}
MyBankCard = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(MyBankCard);
export default MyBankCard;