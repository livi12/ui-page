var Page=(function(){

	var _tpl_page = '<div class="m-page">'
				  + ' <div class="tips f-tac"></div>'
				  + ' <ul>'
				  + '	<li class="first"><a href="javascript:void(0)">' +'首页' + '</a></li>'
				  + '	<li class="prev"><a href="javascript:void(0)">' + '上一页' + '</a></li>'
				  + '	<li>'
				  +	'		<ol class="pages-num">'
				  +	'		</ol>'
				  + '	</li>'
				  + '	<li class="next"><a href="javascript:void(0)">' +'下一页'+ '</a></li>'
				  + '	<li class="last"><a href="javascript:void(0)">' + '末页' + '</a></li>'

				  + '   <li class="total">'
				  + '       <span class="total-page">' + '共0页' + '</span>' //共0页
				  + '       <span class="total-size">' + '共0条记录' + '</span>' //共0条记录
				  + '   </li>'
				  + '   <li class="go">'
				  + '   	<span>' + '去第' + '</span>'           //去第

				  + '       <div class="cover">'

				  + '           <input type="text" class="j-page-ipt"/>'
				  + '           <div class="btn-wrap">'
				  + '       	    <button class="j-go">' +'确定'+ '</button>'  //确定
				  + '               <b>' + '页' + '</b>' 	//页
				  + '           </div>'
				  + '       </div>'

				  + '   </li>'
				  + ' </ul>'
				  + '</div>';

	var _tpl_page_detail = '<li class="j-page-item"><a href="javascript:void(0)"></a></li>';

	function Pagination(options) {
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
			tips:'当前分页',
			tipsId:'',
			callback:function(data){},
			loadAtInited:true
		}, options);
		this.init();
	}


	Pagination.prototype = {
		init: function() {
			var _this = this;
			var _options = _this.options;
			_options._endPage = _options.pageCount || 10;
			_options._startPage = 1;
			_options._firstLoad = true;
			var $page = $(_tpl_page);
			$page.attr('id',_options.id);
			$('#' + _options.id).replaceWith($page);
			_this.bindEvents();
			if(_options.loadAtInited){
				_this.loadData();
			}
		},

		refreshPage : function(options){
			var _this = this;
			var _options = options;
			var _page = _options.jsonResult.datas.page;
			var $pageBar = $('#' + _options.id );
			if(_page && _page.totalPage > 1){

				$pageBar.children('div.tips').hide();
				$('#' + _options.tipsId).hide();
				$pageBar.children('ul').show();
				$pageBar.show();

				var _curPage = _page.curPage;

				if(_options._firstLoad || _options._startPage != _page.startPage || _options._endPage != _page.endPage){
					_options._startPage = _page.startPage;
					_options._endPage = _page.endPage;
					_this.createPageDetail(_options._startPage,_options._endPage,_curPage);
					_options._firstLoad = false;
				}else{
					_this.refreshPageDetail();
				}
			}else{
				if(_page && _page.totalPage === 1){
					$pageBar.hide();
					$('#' + _options.tipsId).hide();
				}else{
					if(!_options.tipsId){
						$pageBar.children('div.tips').html(_options.tips).show();
						$pageBar.children('ul').hide();
						$pageBar.show();
					}else{
						$pageBar.hide();
						$('#' + _options.tipsId).show();
					}
				}
			}

			// 共多少页
			$('.total').find('.total-page').text('共'+ _options.jsonResult.datas.page.totalPage+'页');
			// 共多少条记录
			$('.total').find('.total-size').text( _options.jsonResult.datas.page.totalSize+" 条记录");
		},

		refreshPageDetail : function(){
			var _this = this;
			var _options = _this.options;
			var _page = _options.jsonResult.datas.page;
			var $pageDetail = $('#' + _options.id + ' .pages-num>li');
			var index = (_page.curPage - _page.startPage);
			$pageDetail.removeClass('cur').eq(index).addClass('cur');
		},

		createPageDetail :function(startPage,endPage,curPage){
			var _this = this;
			var _options = _this.options;
			var $pages = $('#' + _options.id + ' .pages-num');
			$pages.empty();

			for(var index=startPage; index<=endPage; index++) {
				var $pageDetail = $(_tpl_page_detail);
				$pageDetail.children('a').html(index);
				$pageDetail.attr('pageno',index);
				if(index == curPage){
					$pageDetail.addClass('cur');
				}
				$pages.append($pageDetail);
			}
		},

		bindEvents: function() {
			var _this = this;
			var _options = _this.options;
			var $page = $('#' + _options.id);

			$page.on('click', '.j-page-item', function() {
				$(this).siblings().removeClass('cur');
				$(this).addClass('cur');
				if(_options.curPage == $(this).attr('pageno')){
					return ;
				}
				_options.curPage = parseInt($(this).attr('pageno'));
				_this.loadData();
			}).on('click', '.first', function() {
				if(_options.curPage == 1){
					return;
				}
				_options.curPage = 1;
				_this.loadData();
			}).on('click', '.prev', function() {
				if(_options.curPage == 1){
					return;
				}
				_options.curPage = _options.curPage-1;
				_this.loadData();
			}).on('click', '.next', function() {
				try{
					var _page = _options.jsonResult.datas.page;
				}catch(e){
					return;
				}
				if(_options.curPage == _page.totalPage || _page.totalPage == 0){
					return ;
				}
				_options.curPage = _options.curPage +1;
				_this.loadData();
			}).on('click', '.last', function() {
				try{
					var _page = _options.jsonResult.datas.page;
				}catch(e){
					return ;
				}
				var _page = _this.options.jsonResult.datas.page;
				if(_options.curPage == _page.totalPage || _page.totalPage == 0){
					return ;
				}
				_options.curPage = _page.totalPage;
				_this.loadData();
			}).on('click', '.j-page-ipt', function(){
				$(this).css({ 'border': '1px solid #0ba299'});
				$('.btn-wrap').animate({ 'left': '44px'});
			}).on('click', '.j-go', function(){
				var page = $('.j-page-ipt').val();
				if(page){
					// 修复手动输入超出所有页码数时，导致curPage不正确，进一步导致点击上一页不正确
					try{
						var _page = _options.jsonResult.datas.page;
					}catch(e){
						return ;
					}
					if(page >  _page.totalPage){
						_options.curPage = _page.totalPage;
					}else{
						_options.curPage = parseInt(page);
					}

					_this.loadData();
					$('.j-page-ipt').css({ 'border': '1px solid #e3e8eb'});
					$('.btn-wrap').animate({ 'left': '0'});
				}
				return false;
			});


			$(document).on('click', function(e){
				var $target = $(e.target);

				if(!$target.is('.j-page-ipt') && !$target.is('.j-go')) {
					$('.j-page-ipt').css({ 'border': '1px solid #e3e8eb'});
					$('.btn-wrap').animate({ 'left': '0'});
				}
			});


			function action(e) {
				if($.isFunction(_options.before)) {
					_options.before.apply(self, arguments);
				}
				_options.curPage = 1;
				_this.loadData();
				return false;
			}
			$('#' + _options.buttonId).click(action);
			$('#' + _options.formId).submit(action);
		},

		loadData : function() {
			var _this = this;
			var _options = _this.options;
			var _param = $('#'+_options.formId).serialize();
			if(_param){
				_param += '&curPage='+_options.curPage + '&pageSize=' + _options.pageSize;
			}else{
				_param = 'curPage='+_options.curPage + '&pageSize=' + _options.pageSize;
			}

			var _callback = function(json){
				if(json.success){
						_options.jsonResult = json;
						_this.refreshPage(_options);
						_options.callback(_options.jsonResult.datas);
					}
			}

			if(_options.jsonp){
				_param += '&jsoncallback=?';
				$.getJSON(_options.url,_param,function(json){
					_callback(json);
				});
			}else{
				$.ajax({
					type : 'post',
					url : _options.url,
					data : _param ,
					dataTaype : 'json',
					success : function(json) {
						_callback(json);
					}
				});
			}
		}


	};

	var Page = {
		create: function(options) {
			options = options || {};
			var p = new Pagination(options);
			return p;
		}
	};

	return Page;
})();