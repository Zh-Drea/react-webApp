/**
 * @name CardAdd.js
 * @auhor 曾粒宗
 * @date 2019.3.6
 * @desc 添加银行卡页面
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
import NavTop from '../components/NavTop';
require('../css/global.css');

class CardAdd extends BaseComponent{
	
	constructor(props){
		super(props);
		this.pageName = "CardAdd";
		this.reduxState = this.props.state[this.pageName];
		this.state = this.reduxState?this.reduxState:{
			isShow : false,
			isChange: false,
			cardNum: '',
			cardName: '',
			cardIdent: '',
			couponsType:''
		}
	}

	componentDidMount(){
		let thiz = this;
        if (thiz.state.cardNum && thiz.state.cardName && thiz.state.cardIdent) {
			thiz.setState({
				isChange: true
			})
		}
		if (thiz.props.location.hasOwnProperty("queryCs")) {
			thiz.setState({couponsType:true})
		}
	}

	changIdent = (e) =>{
		let thiz = this;
		thiz.changeState({
            cardIdent:e.target.value
        })
		if (thiz.state.cardNum && thiz.state.cardName && e.target.value) {
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

	changeName = (e) =>{
		let thiz = this;
		thiz.changeState({
            cardName:e.target.value
        });
		if (thiz.state.cardNum && e.target.value && thiz.state.cardIdent) {
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

	changeNum = (e) =>{
		let thiz = this;
		thiz.changeState({
			cardNum:e.target.value
		})
		if (e.target.value && thiz.state.cardName && thiz.state.cardIdent) {
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

	// inputOnBlur =()=>{
	// 	let thiz = this;
	// 	let cardNoReg = /^([1-9]{1})(\d{14}|\d{18})$/;
	// 	if (thiz.state.cardNum) {
	// 		if (!cardNoReg.test(thiz.state.cardNum)) {
	// 			thiz.setState({isShow:true});
	// 		}else{
	// 			thiz.setState({isShow:false});
	// 		}
	// 	}	
	// 	else{
	// 		thiz.setState({isShow:false});
	// 	}	
	// }

	inputOnFocus =()=>{
		let thiz = this;
		thiz.setState({isShow:false});
	}

	render(){
		let thiz = this;
		return(
			<div className="mbc-all">
				<div className="mbc-header">
					<NavTop title="添加银行卡"
					leftIcon={require("../images/back.png")} 
					leftHandler={()=>{
						thiz.clearState();
						// thiz.remove("ident");
						// thiz.remove("cnum");
						// thiz.remove("cname");
						thiz.goBack();
					}} 
					/>
				</div>
				<div className="mbc-container ca-container">
					<div className="ca-num">
						<div className="ca-radiu-now"><span>1</span></div>
						<div className="ca-line-now"></div>
						<div className="ca-line-soon"></div>
						<div className="ca-radiu-soon"><span>2</span></div>
					</div>	
					<div className="ca-font">
						<div><span className="ca-font-now">个人信息填写</span></div>
						<div><span className="ca-font-soon">获取手机验证码</span></div>
					</div>
					<div className="ca-state">
						<span style={{marginLeft:25}}>请绑定持卡人本人的银行卡</span>
					</div>
					<div className="ca-form">
						<div className="ca-input-layout">
							<div className="ca-num-font">卡&nbsp;&nbsp;号</div>
							<input className="ca-card-input-num" style={{marginLeft:24}} value={thiz.state.cardNum} onChange={thiz.changeNum} type="text"  placeholder="请输入卡号"/>
							<img className="ca-icon" src={require('../images/ca-icon.png')} style={{marginRight:15}} onClick={()=>{
			     				thiz.setState({cardNum : '',isChange:false,isShow:false});
							}}></img>
						</div>
						<div><span className={thiz.state.isShow ? 'show' : 'none'}>银行卡号错误，请核对后重试</span></div>
						<div style={{backgroundColor:'white'}}>
							<div className="ca-input-layout" style={{marginTop:40}}>
								<div className="ca-num-font">持卡人</div>
								<input className="ca-card-input-num" value={thiz.state.cardName} onChange={thiz.changeName} type="text" placeholder="请输入持卡人姓名"/>
							</div>
							<div style={{height:1,width:'90%',marginLeft:'5%',backgroundColor:'white'}}></div>
							<div className="ca-input-layout" style={{marginTop:0}}>
								<div className="ca-num-font">身份证</div>
								<input className="ca-card-input-num" value={thiz.state.cardIdent} onChange={thiz.changIdent} type="text" style={{color:"black"}} placeholder="请输入持卡人身份证号"/>
							</div>
						</div>
						<button className="ca-button" style={{backgroundColor:thiz.state.isChange? "#FFC859" : "#BABABA",width:'90%',marginLeft:'5%'}} onClick={()=>{
							if (thiz.state.isChange) {
								thiz.navigate({
								pathname:"/CardIphone",
								query:{
									"cnum":thiz.state.cardNum,
									"cname":thiz.state.cardName,
									"ident":thiz.state.cardIdent,
									"type":thiz.state.couponsType
									}
								});
							}
						}}>下一步</button>
					</div>
				</div>
			</div>
		)
	}
}
CardAdd = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(CardAdd);
export default CardAdd;
