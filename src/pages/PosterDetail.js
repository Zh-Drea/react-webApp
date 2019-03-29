/**
 * @name PosterDetail.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 海报详情
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

export default class PosterDetail extends BaseComponent{

	constructor(props){
		super(props);
		this.state = {
			nbH:46,
			item:this.props.location&&this.props.location.query&&this.props.location.query.item?this.props.location.query.item:{},
			posterUrl:"",
			imgHeight:400,
			imgWidth:0,
		};
		this.token = this.get("token");
	}

	// 加载合成海报
	loadData(){
		let thiz = this;
		thiz.ajax("promotionPoster/genShareQrCode",{
			data:JSON.stringify({
				id:thiz.state.item?thiz.state.item.id:"",
			}),
			headers:{
				"JWT-USER-Authorization":thiz.token,
			},
			success:function(ret){
				if(ret.respCode=="00"){
					if(ret.data){
						thiz.setState({
							posterUrl:ret.data,
						});

						// 计算图片显示区域
						let image = new Image();
						image.src = ret.data;
						setTimeout(function(){

							let imageW = image.width;
							let imageH = image.height;

							let imageAreaW = BaseComponent.WW - 20;
							let imageAreaH = BaseComponent.WH - 145;
							if(imageAreaW/imageAreaH>=imageW/imageH){
								thiz.setState({
									imgHeight:imageAreaH,
									imgWidth:imageAreaH*imageW/imageH,
								});
							}else{
								thiz.setState({
									imgHeight:imageAreaW*imageH/imageW,
									imgWidth:imageAreaW,
								});
							}
						},100);

					}
				}
			},
			error:function(err){
				
			}
		});
	}

	componentDidMount(){
		let thiz = this;
		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.setState({
			nbH:nbH
		});
		// alert("--------poster_detail--------"+JSON.stringify(thiz.state.item));
		thiz.loadData();
	}

	render(){
		let thiz = this;
		return (
			<div>

				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")}
				title="推广海报" 
				leftHandler={()=>{
					thiz.goBack();
				}}
				rightHandeler={()=>{

				}}/>

				<div id="contentPosterDetail" style={{paddingTop:thiz.state.nbH}}>
					<div style={{padding:10,textAlign:"center"}}>
						<img style={{height:thiz.state.imgHeight,width:thiz.state.imgWidth,backgroundColor:"white",}} src={thiz.state.posterUrl?thiz.state.posterUrl:""}/>
					</div>
				</div>

				{/*下载海报按钮*/}
				<div style={{backgroundColor:"#FFC859",textAlign:"center",paddingTop:15,paddingBottom:15,
				position:"fixed",bottom:0,width:"100%",fontSize:18,fontWeight:"bold",letterSpacing:3,}}
					onClick={()=>{
						// alert("--------click--------");
						if(thiz.state.posterUrl?thiz.state.posterUrl:""){
							let data = thiz.state.posterUrl;
							// 调用原生的下载
							// alert("--------url--------"+url);
							if(window.postMessage){
								window.postMessage(JSON.stringify(
									{
										op:"saveImg",
										data:data,
									}
								));
							}
						}
					}}>下载海报</div>

			</div>
		);
	}

}

