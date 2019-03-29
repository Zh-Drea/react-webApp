/**
 * @name WithdrawDetail.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 提现详情
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

export default class WithdrawDetail extends BaseComponent{

	constructor(props){
		super(props);
		this.state = {
			nbH:46,
			params:''
		}
	}

	componentDidMount(){
		let thiz = this;
		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.setState({
			nbH:nbH
		});
		thiz.setState({params:thiz.props.location.queryWd})
	}

	render(){
		let thiz = this;
		return (
			<div>

				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")} 
				rightIcon={require("../images/record.png")}
				title="提现详情" 
				leftHandler={()=>{
					thiz.navigate({
						pathname:"/Withdraw",
						query:{}
					});
				}} rightHandler={()=>{
					thiz.navigate({
						pathname:"/WithdrawRecord",
						query:{}
					});
				}}/>

				<div id="contentWithDrawDetail" style={{paddingTop:thiz.state.nbH}}>
					
					<div style={{backgroundColor:"white",marginTop:20,paddingTop:10,paddingBottom:10,}}>
						<div style={{textAlign:"center"}}>
							<img style={{width:"30%"}} src={require("../images/ok_yellow.png")}/>
						</div>
						<div style={{textAlign:"center",fontSize:20,marginTop:0,}}>提现申请提交成功</div>
						<div style={{paddingLeft:40,paddingRight:40,marginTop:40,}}>
							<div>
								<div style={{display:"inline-block",width:100,textAlign:"right"}}>收款账户：</div>
								<div style={{display:"inline-block",float:"right"}}>{thiz.state.params.wBankName}&nbsp;&nbsp;({thiz.state.params.wSuffixCardNo})</div>
							</div>
							<div style={{marginTop:5,}}>
								<div style={{display:"inline-block",width:100,textAlign:"right"}}>到账金额：</div>
								<div style={{display:"inline-block",float:"right"}}>{thiz.state.params.wPayableAmount}</div>
							</div>
							<div style={{marginTop:5,fontSize:14,}}>
								<div style={{display:"inline-block",width:100,textAlign:"right"}}>提现金额：</div>
								<div style={{display:"inline-block",float:"right"}}>{thiz.state.params.wApplyWithdrawAmount}</div>
							</div>
							<div style={{marginTop:5,fontSize:14,}}>
								<div style={{display:"inline-block",width:100,textAlign:"right"}}>费率：</div>
								<div style={{display:"inline-block",float:"right"}}>{thiz.state.params.wWithdrawRate}</div>
							</div>
						</div>
					</div>

					{/*提现按钮*/}
					<div style={{marginTop:20,textAlign:"center",paddingLeft:20,paddingRight:20,}}>
						<button style={{width:"100%",fontSize:22,borderRadius:8,backgroundColor:"#FFC859",
						paddingTop:8,paddingBottom:8,}}
						onClick={()=>{
							thiz.navigate({
								pathname:"/WithdrawRecord",
								query:{}
							});
						}}>完&nbsp;&nbsp;&nbsp;&nbsp;成</button>
					</div>
				</div>

			</div>
		);
	}

}

