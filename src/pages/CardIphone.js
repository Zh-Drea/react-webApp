/**
 * @name CardIphone.js
 * @auhor 曾粒宗
 * @date 2019.3.6
 * @desc 银行卡手机页面
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
import NavTop from '../components/NavTop';
require('../css/global.css');

class CardIphone extends BaseComponent{
	
	constructor(props){
		super(props);
		this.pageName = "CardIphone";
		this.reduxState = this.props.state[this.pageName];
		this.state = {
			isShow : false,
			errShow:false,
			isChange: false,
			msgClick:true,
			cardIp:'',
			cardMsg:'',
			param:"获取验证码"
		}
	}

	componentDidMount(){
		let thiz = this;
		if (thiz.state.cardMsg&& thiz.state.cardIp) {
			thiz.setState({
				isChange: true
			})
		}
	}

	changeIp = (e) => {
		let thiz = this;
		thiz.changeState({
			cardIp:e.target.value
		});
		if (e.target.value && thiz.state.cardMsg) {
			thiz.setState({
				isChange: true
			})
		}
		else{
			thiz.setState({
				isChange: false
			})
		}
	} 

	changeMsg = (e) => {
		let thiz = this;
		thiz.changeState({
			cardMsg:e.target.value
		})
		if (e.target.value && thiz.state.cardIp) {
			thiz.setState({
				isChange: true
			})
		}
		else{
			thiz.setState({
				isChange: false
			})
		}
	} 
	//发送验证码请求
	sendMsg(){
		let thiz = this;
		thiz.setState({
			msgClick:false
		});
		let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(thiz.state.cardIp)) {
        	thiz.toast('电话号码格式错误!');
        	thiz.setState({param:"获取验证码",msgClick:true});
            return false;
        }
		let token = this.getWebParam("token");
		if(token){
			thiz.ajax("sms/sendSingleMsg",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({
					phoneNoData:{
						phoneNo:thiz.state.cardIp
					},
					smsType:'AUTHENTICATE_BANK_CARD'
				}),
				success:function(ret){
					if (ret.respCode === "00") {
						{(()=>{
					       thiz.setState({msgClick:false})
					    })()};
						let a = 120;
						let plt =setInterval(()=>{ 
							thiz.setState({param:"倒计时"+a})
							a--;
							if (a === 1) {
								clearInterval(plt);
								thiz.setState({param:"获取验证码",msgClick:true})
								}
						}, 1000);
					}
					// else if(ret.respCode === "-1"){
					// 	thiz.toast(ret.errDesc);
					// 	thiz.setState({param:"获取验证码",msgClick:true})
					// }					
				},
				error:function(err){
					thiz.toast('网络异常!')
				}
			});
		}	
	}
	//绑定银行卡
	bankCardSave(){
		let thiz = this;
		if (thiz.props.location.hasOwnProperty("query")) {
			let params = thiz.props.location.query;
			let token = thiz.getWebParam("token");
			if(token){
				thiz.ajax("bankcard/save",{
					headers:{
						"JWT-USER-Authorization":token,
					},
					data:JSON.stringify({
						cardNo:params.cnum,
						idCardNo:params.ident,
						name:params.cname,
						phoneNo:thiz.state.cardIp,
						smsVerifyCode:thiz.state.cardMsg
					}),
					success:function(ret){
						if (ret.respCode === "00") {
							thiz.clearState();
							if (params.type) {
								thiz.navigate({
									pathname:"/Withdraw",
									queryCi:{}
								});
								return;
							}
							thiz.navigate({
								pathname:"/MyBankCard",
								queryCi:{}
							})
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
		else{
			thiz.toast("请返回重新输入数据!")
		}
	}

	render(){
		let thiz = this;
		return(
			<div className="mbc-all">
				<div className="mbc-header">
					<NavTop title="添加银行卡" 
					leftIcon={require("../images/back.png")} 
					leftHandler={()=>{
						thiz.goBack();
					}} 
					/>
				</div>
				<div className="mbc-container ca-container">
					<div className="ca-num">
						<div className="ca-radiu-now"><span>1</span></div>
						<div className="ca-line-now"></div>
						<div className="ca-line-soon ci-line"></div>
						<div className="ca-radiu-soon ci-line"><span>2</span></div>
					</div>	
					<div className="ca-font">
						<div><span className="ca-font-now">个人信息填写</span></div>
						<div><span className="ca-font-soon" style={{color:'#518DCE'}}>获取手机验证码</span></div>
					</div>
					<div className="ca-state">
						<span style={{marginLeft:25}}>银行卡验证</span>
					</div>
					<div className="ca-form">
						<div className="ca-input-layout">
							<div className="ca-num-font">手机号</div>
							<input className="ci-num" style={{marginLeft:20}} value={thiz.state.cardIp} onChange={thiz.changeIp} type="text" placeholder="请输入预留手机号"/>
							<img className="ca-icon" src={require('../images/ca-icon.png')} style={{marginRight:15}} onClick={()=>{
			     				thiz.setState({cardIp : '',isChange:false});
							}}></img>
						</div>
						<div style={{backgroundColor:'white'}}>
							<div style={{height:1,width:'90%',marginLeft:'5%',backgroundColor:'#DCDCDC'}}></div>
							<div className="ca-input-layout" style={{marginTop:0}}>
								<div className="ca-num-font">验证码</div>
								<input className="ci-num" type="text" value={thiz.state.cardMsg} onChange={thiz.changeMsg} onFocus={thiz.inputOnFocus} placeholder="请输入短信验证码"/>
								<div className="ci-font" onClick={()=>{
									if (thiz.state.msgClick) {
										thiz.sendMsg();
									}
								}}>{thiz.state.param}</div>
							</div>
						</div>
						<div style={{textAlign:'center'}}><span style={{display: thiz.state.errShow ? "block" : "none",fontSize:12,color:'#FF2323',margin:'0 auto',marginTop:10}}>验证码输入错误</span></div>
						<button className="ca-button" style={{backgroundColor:thiz.state.isChange? "#FFC859" : "#BABABA",marginTop:40,width:'90%',marginLeft:'5%'}} onClick={() =>{
							if (thiz.state.isChange) {
								thiz.bankCardSave();
							}
						}} >绑定银行卡</button>
					</div>
				</div>
			</div>
		)
	}
}
CardIphone = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(CardIphone);
export default CardIphone;
