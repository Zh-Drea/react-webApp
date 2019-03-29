/**
 * @name CardDel.js
 * @auhor 曾粒宗
 * @date 2019.3.5
 * @desc 银行卡解除绑定
 */
import React,{Component} from 'react';
import BaseComponent from '../BaseComponent';
import NavTop from '../components/NavTop';
import DelButton from '../components/DelButton';
import {Link} from 'react-router-dom';
require('../css/global.css');

export default class CardDel extends BaseComponent{
	
	constructor(props){
		super(props);
		this.state ={
			data:'',
			isShow:false,
			isLight:false,
			height:  window.document.body.clientHeight,
			isSlide:true
		}
	}

	componentDidMount() {
    	let thiz = this;
		if (thiz.get("bankId")) {
			let token = this.getWebParam("token");
			if(token){
				this.ajax("bankcard/getById",{
					headers:{
						"JWT-USER-Authorization":token,
					},
					data:JSON.stringify({id:thiz.get("bankId")}),
					success:function(ret){
						if (ret.respCode === "00") {
							thiz.setState({data:ret.data,isLight:ret.data.defaultCardNo})
						}
					},
					error:function(err){
						thiz.toast('网络异常!')
					}
				});
			}	
		}	
	}

	setBankToDefault(){
		let thiz = this;
		let token = this.getWebParam("token");
			if(token){
			this.ajax("bankcard/setToDefault",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({id:thiz.state.data.id}),
				success:function(ret){
					if (ret.respCode === "00") {
						thiz.navigate({
							pathname:"/MyBankCard",
							query:{}
						})
					}
				},
				error:function(err){
					thiz.toast('网络异常!')
				}
			});
		}	
	}

	backRelieve(){
		let thiz = this;
		let token = this.getWebParam("token");
			if(token){
			this.ajax("bankcard/relieve",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({id:thiz.state.data.id}),
				success:function(ret){
					if (ret.respCode === "00") {
						thiz.remove("bankId");
						thiz.navigate({
							pathname:"/MyBankCard",
							queryCd:{}
						})
					}
				},
				error:function(err){
					thiz.toast('网络异常!')
				}
			});
		}	
	}

	render(){
		let thiz =this;
		let state = {
		pathname:"/CardAdd",
		stateAdd:{name:"组件"}
		};
		return(
			<div className="mbc-all" style={{backgroundColor: thiz.state.isShow ? 'black': 'red'}}>
				<div className="mbc-header">
					<NavTop title="我的银行卡" leftIcon={require("../images/back.png")} 
					rightIcon={require("../images/more.png")} 
					leftHandler={()=>{
						thiz.goBack();
						thiz.remove("bankId")
					}} rightHandler={()=>{
						thiz.navigate(state)
					}}/>
				</div>
				<div className="mbc-container" style={{position:"fixed",}}>
					<div className="cr-card">
						<div className="mbc-container-card cr-c" style={{backgroundColor:thiz.state.isLight ? '#02A3AA':'#518DCE'}}>
							<div className="mbc-bank">
								<div className="mbc-bankname mbc-font-color-bankname">{thiz.state.data.bankName}</div>
								<div className="mbc-font-color-button" style={{display:thiz.state.data.defaultCardNo ? "block" : "none"}}>默认</div>
							</div>
							<div className="mbc-card-type mbc-font-color-name">{thiz.state.data.cardType}</div>
							<div className="mbc-card">
								<div className="mbc-card-num">
									<div className="mbc-font-color-bankname mbc-num-position">****</div>
									<div className="mbc-font-color-bankname mbc-num-position">****</div>
									<div className="mbc-font-color-bankname mbc-num-position">****</div>
									<div className="mbc-font-color-bankname mbc-num-image">{thiz.state.data.suffixCardNo}</div>
								</div>
							</div>
						</div>
						<div className="cr-del"  onClick={()=>{
							if (!thiz.state.isLight) {
								thiz.setState({isLight:!thiz.state.isLight});
								thiz.setBankToDefault()
							}
						}}>
							<div>
								<img src={thiz.state.isLight? require("../images/bank.png") : require("../images/bank1.png")} style={{width:24,height:24,margin:"10px 20px 10px 20px"}} >
								</img>
							</div>	
							<p className="cr-font-postion">设为默认银行卡</p>
						</div>
					</div>	
				</div>

				

				{/*<div style={{display:thiz.state.isShow?"block": "none",position:'fixed',backgroundColor:'#000',zIndex:1000,top:0,width:"100%",height:this.state.height}}>

					<button className="cr-delete-card" style={{marginBottom:60}} onClick={()=>{thiz.backRelieve()}}>确定解除绑定</button>

					<button className="cr-delete-card" style={{marginTop:50,color:'#000000'}} onClick={() =>{
						thiz.setState({
							isShow:!this.state.isShow
							,isSlide:!thiz.state.isSlide
						})
					}}>取消</button>

				</div>*/}

				<div id="buttonHig" style={{display:thiz.state.isShow?"block": "none",position:'fixed',backgroundColor:'rgba(0,0,0,0.6)',zIndex:10001,top:0,width:"100%",height:window.document.body.clientHeight}}
					onClick={()=>{
						thiz.setState({isShow:false,isSlide:true});
					}}>
					
					<div style={{position:"relative",width:"100%",height:"100%",backgroundColor:"transparent"}}>

						<div style={{position:"absolute",bottom:0,width:"100%",zIndex:10002}}>

							<button className="cr-delete-card" style={{color:'red',backgroundColor:"white"}} onClick={(e)=>{
								e.stopPropagation();
								thiz.backRelieve();

							}}>确定解除绑定</button>

							<button className="cr-delete-card" style={{marginTop:10,color:'#000000',backgroundColor:"white"}} onClick={(e) =>{
								e.stopPropagation();
								thiz.setState({
									isShow:!this.state.isShow
									,isSlide:!thiz.state.isSlide
								})
								
							}}>取消</button>

						</div>

					</div>

				</div>

				<button className="cr-delete-card" style={{display:!thiz.state.isShow ? "block" : "none",position:"fixed",bottom:0,}} onClick={()=>{
					thiz.setState({isShow:!thiz.state.isShow,isSlide:!thiz.state.isSlide})
				}}>解除绑定</button>

			</div>
		)
	}
}
