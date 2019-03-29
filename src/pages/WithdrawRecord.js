/**
 * @name WithdrawRecord.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 提现记录
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

export default class WithdrawRecord extends BaseComponent{

	constructor(props){
		super(props);
		this.state = {
			nbH:46,
			allData:[],
			num:1,
			isNull:true
		}
	}

	componentDidMount(){
		let thiz = this;
		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.setState({
			nbH:nbH
		});
		thiz.loadData();
		thiz.$(window).scroll(()=>{
	    	if (thiz.$(window).scrollTop() == thiz.$(document).height() - thiz.$(window).height()) {
	    		thiz.loadListData();
	    	}
	  	});
	}

	loadData(){
		let thiz = this;
		let token = thiz.getWebParam("token");
		if(token){
			thiz.ajax("applyWithdrawCash/getPage",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({
					page:{
						pageNumber:thiz.state.num,
						pageSize:10
					}
				}),
				success:function(ret){
					if (ret.respCode === "00") {
						thiz.setState({allData:ret.data.records})
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

	getRecordTpl(){
		let thiz = this;
		let count = 1;
		let progress;
		return(
			<div>
				{
					thiz.state.allData.map((value,index)=>{
						if(value.applyWithdrawAmount === 'NOT_AUDIT') {
							progress = "未审核"
						}
						else if(value.applyWithdrawAmount === 'WITHDRAW_PROCESSING'){
							progress = "提现处理中"
						}
						else{
							progress = "已完成"
						}
						let recordsSty = true;
						if (index === thiz.state.allData.length-1 ) {
							recordsSty = false
						}
						return(
							<div style={{paddingTop:15,paddingBottom:15,borderBottom:recordsSty ? "1px solid #eee" : ""}}>
								<div style={{display:"inline-block",paddingTop:10}}>
									<label>{progress}</label>
									<div style={{marginTop:5}}>
										<label style={{fontSize:14,color:"#696969"}}>{value.applyWithdrawDatetime}</label>
									</div>
								</div>
								<div style={{display:"inline-block",float:"right",position:"relative",top:10,}}>
									<label style={{fontSize:20}}>-{value.applyWithdrawAmount}</label>
								</div>
							</div>	
						)
					})
				}
			</div>
		)
	}

	loadListData(){
		let thiz = this;
		//false则数据已经请求完成，不需要再请求。
		if (!thiz.state.isNull) {
			return;
		}
		let token = thiz.getWebParam("token");
		let rep = thiz.state.num + 1;
		if(token){
			thiz.ajax("applyWithdrawCash/getPage",{
				headers:{
					"JWT-USER-Authorization":token,
				},
				data:JSON.stringify({
					page:{
						pageNumber:rep,
						pageSize:10
					}
				}),
				success:function(ret){
					if (ret.respCode === "00") {
						let res = thiz.state.allData;
						if (ret.data.records.length > 0) {
							ret.data.records.map((value,index)=>{
								res.push(value)
							});
							thiz.setState({allData:res,num:rep})
						}
						else{
							thiz.setState({isNull:false})
						}
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
				title="提现记录" 
				leftHandler={()=>{
					thiz.navigate({
						pathname:"/Withdraw",
						query:{}
					});
				}}/>
				<div id="contentWithDrawRecord" style={{paddingTop:thiz.state.nbH,paddingBottom:50}}>
					<div style={{backgroundColor:"white",marginTop:20,paddingLeft:20,paddingRight:20,}}>
						{(()=>{
		                    return thiz.getRecordTpl();
		                })()}
					</div>
					 <thiz.Nomore show={!thiz.state.isNull}></thiz.Nomore>
				</div>
			</div>
		);
	}

}

