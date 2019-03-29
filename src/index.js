import React from 'react';
import ReactDOM from 'react-dom';
import RouterMap from './router/RouterMap';
import * as serviceWorker from './serviceWorker';

// 引入redux管理app数据
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

// 初始化redux中的state
let globalState = {
	type:"global",
	plugin:"redux",
	data:{
		//...页面数据

	}
};

// state操作函数
let reducer = (state=globalState,action) => {
	// 巧妙实现深拷贝
	let stateStr = JSON.stringify(state);
	let curState = JSON.parse(stateStr);
	let curData = curState.data;

	switch (action.type){
		case "UPDATE":// 更新页面数据
			if(action.payload&&action.payload.pageName){
				curData[action.payload.pageName] = action.payload.pageState;
			}
			curState.data = curData;
			return curState;
    	default: 
        	return curState;
    }
};

//创建store
const store = createStore(reducer);

ReactDOM.render(
		<Provider store={store}>
			<RouterMap />
		</Provider>,
		document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
