#乐课ui-page的插件的使用

## 原理：
`ui-page`插件的模板已经写在javascript中，基本模板已经固定，只能改变页码的个数，页码默认从1到10


##ui-page的使用方法
乐课网中的ui-page已经将需要的外部依赖引进来了。由于本例没有对js进行封装，故本例需要引入ui-page.css 和jquery.js外部依赖文件

###html
```html
<div id="page-wrap"></div>
```
###javascript的调用方法
```javascript
Page.create({
			id:'page-wrap',
			url:'page.json',
			pageCount:5,
			curPage:3,
			formId:'formPage',
			buttonId:'formTrrigle',
			before:function(){
				console.log("before function!");
			},
			callback:function(data){
				console.log(data);
			}
		});
```

###参数的解释
以下是参数的默认值，可以根据需求来复写下面某些参数从而到达想要的效果。

```javascript
this.options = $.extend({
	id: null,
	url:null,
	pageSize:10,
	curPage:1,
	pageCount:10,//分页栏上显示的分页数
	buttonId: null,
	formId:null,
	before:null,
	jsonp:false,
	tips:'没有相关数据',
	tipsId:'',
	callback:function(data){},
	loadAtInited:false
}, options);
```

`id`为将分页标签显示在哪个id元素上
`url`为分页请求内容的地址
`pageSize`每个分页上最多显示的多少条数据
`curPage`当前分页页码
`pageCount` 分页栏上显示的分页数，从1到 pageCount值的页码按钮
`buttonId` 当点击该按钮时，触发before的函数
`formId` 当提交该表单事件时，出发before函数
`before` 上面两个参数的响应函数
`jsonp` 是否跨域，默认不跨域
`tips` 当请求的数据_options.jsonResult.datas.page  或者_options.jsonResult.datas.page.totalPage为空时，显示提示信息，
`tipsId` 如果需要使用这个参数，需要将id为这个值的数据先隐藏，当从后台返回的数据为空时，在页面上显示特定的提示信息，默认设置的tips无效。
`callback` 为将url请求发送出去，返回数据后，将改返回的数据进行处理的函数。
`loadAtInited` 默认为true，当设置为false，则初始化页码时，不会将具体的页码的数字的按钮显示出来，也不会发送请求给服务器，乐课网上若设置这个属性为false,然后点击**下一页**，**末页**时会报错，本例中将js中绑定的两个点击事件做了捕获异常的处理，则不会报错。

###注意事项
从服务器返回的数据格式需为json格式。具体参数如下：

```javascript
{
	"success":true,
	"datas":{
		"page":{
			"totalPage":7,
			"_firstLoad":true,
			"startPage":1,
			"endPage":5,
			"totalSize":15,
			"curPage":4,
			"dataList":""
		}
	}
}
```
`totalPage`为总共需要显示多少页
`endPage`为分页栏上的页码数
`_firstLoad`为是否为第一次加载分页
`startPage` 为当前分页栏开始页码的数字
`totalSize`为总共数据的数量
`curPage` 为当前显示多少页的现象
`dataList` 为具体的业务数据，在参数callback函数中进行操作的数据，名字可以更改，上述其他键值对的名字不能更改，具体值，更具相应的操作进行变更。



