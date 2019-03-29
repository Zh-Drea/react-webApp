
/**
 * @name RouterMap.js
 * @auhor 李磊
 * @date 2019.3.1
 * @desc 路由组件，封装了路由切换动画和APP里面所有的路由
 */
import React,{Component} from 'react';
import {HashRouter,Route,Switch,BrowserRouter} from 'react-router-dom';

import BaseComponent from '../BaseComponent';

import Coupons from '../pages/Coupons';
import Withdraw from '../pages/Withdraw';
import WithdrawDetail from '../pages/WithdrawDetail';
import WithdrawRecord from '../pages/WithdrawRecord';
import Popularize from '../pages/Popularize';
import MyPopularize from '../pages/MyPopularize';
import MyTeam from '../pages/MyTeam';
import Poster from '../pages/Poster';
import PosterDetail from '../pages/PosterDetail';
import Material from '../pages/Material';
import ShareMaterial from '../pages/ShareMaterial';

import PageOne from '../pages/PageOne';
import PageTwo from '../pages/PageTwo';
import MyBankCard from '../pages/MyBankCard';
import CardRelieve from '../pages/CardRelieve';
import CardDel from '../pages/CardDel';
import CardAdd from '../pages/CardAdd';
import CardIphone from '../pages/CardIphone';
import IssueMatter from '../pages/IssueMatter';
import ShareMatter from '../pages/ShareMatter';
import College from '../pages/College';

import { AnimatedSwitch } from 'react-router-transition';

// 导入样式
require('../css/global.css');

class RouterMap extends BaseComponent {

  constructor(props){
    super(props);

  }

	render() {
    let thiz = this;
    // return (
    // 	<HashRouter>
    // 		<Switch>
    //       {/*路由切换动画组件*/}
    //       <AnimatedSwitch
    //         atEnter={{ opacity:0,width:BaseComponent.WW}}
    //         atActive={{ opacity:1,width:BaseComponent.WW}}
    //         atLeave={{ opacity:0,width:BaseComponent.WW}}
    //         className="route-wrapper">
            
    //         <Route exact={true} path='/Coupons' component={Coupons}></Route>
    //         <Route exact={true} path='/Withdraw' component={Withdraw}></Route>
    //         <Route exact={true} path='/WithdrawDetail' component={WithdrawDetail}></Route>
    //         <Route exact={true} path='/WithdrawRecord' component={WithdrawRecord}></Route>
    //         <Route exact={true} path='/Popularize' component={Popularize}></Route>
    //         <Route exact={true} path='/MyPopularize' component={MyPopularize}></Route>
    //         <Route exact={true} path='/MyTeam' component={MyTeam}></Route>
    //         <Route exact={true} path='/Poster' component={Poster}></Route>
    //         <Route exact={true} path='/PosterDetail' component={PosterDetail}></Route>
    //         <Route exact={true} path='/Material' component={Material}></Route>
    //         <Route exact={true} path='/ShareMaterial' component={ShareMaterial}></Route>

    //         <Route exact={true} path='/MyBankCard' component={MyBankCard}></Route>

    //         <Route exact={true} path='/CardRelieve' component={CardRelieve}></Route>
    //         <Route exact={true} path='/PageTwo' component={PageTwo}></Route>
    //         <Route exact={true} path='/CardDel' component={CardDel}></Route>
    //         <Route exact={true} path='/CardAdd' component={CardAdd}></Route>
    //         <Route exact={true} path='/CardIphone' component={CardIphone}></Route>
    //         <Route exact={true} path='/IssueMatter' component={IssueMatter}></Route>
    //         <Route exact={true} path='/ShareMatter' component={ShareMatter}></Route>
    //         <Route exact={true} path='/College' component={College}></Route>

    //         <Route exact={true} path='/PageOne' component={PageOne}></Route>
    //         <Route exact={true} path='/PageTwo' component={PageTwo}></Route>

    //       </AnimatedSwitch>
    // 		</Switch>
    // 	</HashRouter>
    // )

    return (
      <HashRouter>
        <Switch>
            
          <Route exact={true} path='/Coupons' component={Coupons}></Route>
          <Route exact={true} path='/Withdraw' component={Withdraw}></Route>
          <Route exact={true} path='/WithdrawDetail' component={WithdrawDetail}></Route>
          <Route exact={true} path='/WithdrawRecord' component={WithdrawRecord}></Route>
          <Route exact={true} path='/Popularize' component={Popularize}></Route>
          <Route exact={true} path='/MyPopularize' component={MyPopularize}></Route>
          <Route exact={true} path='/MyTeam' component={MyTeam}></Route>
          <Route exact={true} path='/Poster' component={Poster}></Route>
          <Route exact={true} path='/PosterDetail' component={PosterDetail}></Route>
          <Route exact={true} path='/Material' component={Material}></Route>
          <Route exact={true} path='/ShareMaterial' component={ShareMaterial}></Route>

          <Route exact={true} path='/MyBankCard' component={MyBankCard}></Route>

          <Route exact={true} path='/CardRelieve' component={CardRelieve}></Route>
          <Route exact={true} path='/PageTwo' component={PageTwo}></Route>
          <Route exact={true} path='/CardDel' component={CardDel}></Route>
          <Route exact={true} path='/CardAdd' component={CardAdd}></Route>
          <Route exact={true} path='/CardIphone' component={CardIphone}></Route>
          <Route exact={true} path='/IssueMatter' component={IssueMatter}></Route>
          <Route exact={true} path='/ShareMatter' component={ShareMatter}></Route>
          <Route exact={true} path='/College' component={College}></Route>
          
          <Route exact={true} path='/PageOne' component={PageOne}></Route>
          <Route exact={true} path='/PageTwo' component={PageTwo}></Route>
          
        </Switch>
      </HashRouter>
    )

  }
}

// 连接redux和组件
RouterMap = BaseComponent.connect(BaseComponent.mapStateToProps, BaseComponent.mapDispatchToProps)(RouterMap);
export default RouterMap;


