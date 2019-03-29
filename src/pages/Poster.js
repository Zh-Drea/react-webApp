/**
 * @name Poster.js
 * @auhor 李磊
 * @date 2019.3.6
 * @desc 推广海报
 */

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import BaseComponent from '../BaseComponent';

import NavTop from '../components/NavTop';
require('../css/global.css');

class Poster extends BaseComponent{

	constructor(props){
		super(props);

		this.pageName = "Poster";// 必须要定义
		this.reduxState = this.props.state[this.pageName];
		this.state = this.reduxState?this.reduxState:{
			nbH:46,
			records:[],
			hasMore:false,
			curPage:0,
		};

		this.token = this.get("token");

		this.curPage = this.state.curPage;
		this.hasMore = this.state.hasMore;
	}

	upToLoad(){

		let thiz = this;

		if(thiz.hasMore){
			thiz.ajax("promotionPoster/getPage",{
				data:JSON.stringify({
					page:{
						pageSize:20,
						pageNumber:thiz.curPage+1,
					},
					userMemberType:"DIRECT",
				}),
				headers:{
					"JWT-USER-Authorization":thiz.token,
				},
				success:(ret)=>{
					if(ret.respCode=="00"){
						// alert("upToLoad加载数据");
						if(ret.data&&ret.data.records.length>0){

							let rds = thiz.state.records;
							rds = rds.concat(ret.data.records);

							let data = JSON.stringify({
								records:rds,
								hasMore:ret.data.hasNext,
								curPage:ret.data.pageNumber,
							});
							// 解决设置state无效的问题
							thiz.emit(thiz.pageNumber+"upload",JSON.parse(data));

							thiz.hasMore = ret.data.hasNext;
							thiz.curPage = ret.data.pageNumber;
						}
						
					}
				},
				error:function(err){
					
				}
			},"NO");
		}
	}

	componentDidMount(){
		let thiz = this;

		this.listen(thiz.pageNumber+"upload",function(msg,data){
			thiz.changeState(data);
		});

		// 获取导航栏的高度
		let nbH = thiz.$("#navBar").innerHeight();
		thiz.changeState({
			nbH:nbH
		});

		thiz.loadData();

		thiz.$(window).scroll(function () {
			if (thiz.$(window).scrollTop() == thiz.$(document).height() - thiz.$(window).height()) {
				thiz.upToLoad();
			}
		});
	}

	loadData(){
		let thiz = this;
		thiz.curPage = 0;
		thiz.hasMore = false;

		thiz.ajax("promotionPoster/getPage",{
			data:JSON.stringify({
				page:{
					pageSize:20,
				}
			}),
			headers:{
				"JWT-USER-Authorization":thiz.token,
			},
			success:function(ret){
				if(ret.respCode=="00"){
					if(ret.data&&ret.data.records.length>0){
						thiz.changeState({
							records:ret.data.records,
							hasMore:ret.data.hasNext,
							curPage:ret.data.pageNumber,
						});

						thiz.hasMore = ret.data.hasNext;
						thiz.curPage = ret.data.pageNumber;
					}else{
						thiz.changeState({
							records:[],
							hasMore:ret.data.hasNext,
							curPage:ret.data.pageNumber,
						});
					}
				}
			},
			error:function(err){
				
			}
		},thiz.reduxState?"YES":"NO");
	}

	render(){
		let thiz = this;
		return (
			<div>

				{/*顶部导航栏*/}
				<NavTop leftIcon={require("../images/back.png")}
				title="推广海报" 
				leftHandler={()=>{
					thiz.clearState();
					setTimeout(function(){
						thiz.goBack();
					},100);
				}}
				rightHandeler={()=>{
					
				}}/>

				<div id="contentPoster" style={{paddingTop:thiz.state.nbH}}>

					<div style={{padding:10,}}>
						{
							thiz.state.records&&thiz.state.records.length>0?thiz.state.records.map(function(item,index){
								return (
									<div key={index} style={{marginLeft:5,marginRight:5,padding:5,display:"inline-block",width:"calc(50% - 20px)",backgroundColor:"white",
									marginBottom:10,verticleAlign:"top"}}
										onClick={()=>{
											thiz.navigate({
												pathname:"/PosterDetail",
												query:{
													item:item,
												}
											})
										}}>
										<img style={{width:"100%",height:220,backgroundColor:"white",}} src={item.imageAttachment&&item.imageAttachment.resourceFullAddress?item.imageAttachment.resourceFullAddress:""}/>
										<p style={{marginTop:10,lineHeight:1.5,}}>{item.title}</p>
									</div>
								);
							}):null
						}

					</div>

					<thiz.Nomore show={!thiz.state.hasMore}></thiz.Nomore>

				</div>

			</div>
		);
	}

}

Poster = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(Poster);
export default Poster;