(function(){

	var is_visible;

	function setup(){
		is_visible = false;

		insertStampButton();
		insertStampContainer();
		insertStampTab();

		current_stamp_view = -1;
		for(var i = 0; i < stamp_urls_list.length; i++){
			if(insertStampView(i,stamp_urls_list[i])){
				current_stamp_view = 0;
			}
		}

		switchStampView(current_stamp_view);
	}

	/**
	 * スタンプアイコン追加
	 */
	function insertStampButton(){
		var btn = document.createElement('a');
		btn.setAttribute('class', 'emo_menu');
		btn.setAttribute('aria-label', 'Stamp menu');
		btn.style.right = '40px';
		btn.addEventListener('click',function(){switchStampContainer();},false);

		var img = document.createElement('img');
		img.setAttribute('id', 'stamp_button');
		img.setAttribute('class', 'ts_icon');
		img.setAttribute('src', 'https://raw.githubusercontent.com/yysk/slack-stamp/master/images/icon.png');
		btn.appendChild(img);

		var message_input = document.getElementById('message-input');
		message_input.style.padding = '9px 80px 9px 8px';
		document.getElementById('message-form').insertBefore(btn, message_input);
	}

	/**
	 * スタンプ表示用領域追加
	 */
	function insertStampContainer(){
		var stamp_container = document.createElement('div');
		stamp_container.setAttribute('id','stamp_container');
		stamp_container.style.display = 'none';
		document.body.appendChild(stamp_container);
	}

	/**
	 * スタンプタブ追加
	 */
	function insertStampTab(){
		var stamp_tab = document.createElement('div');
		stamp_tab.setAttribute('id','stamp_tab');
		var stamp_container = document.getElementById('stamp_container');
		stamp_container.appendChild(stamp_tab);
	}

	/**
	 * タブ内アイコン追加
	 */
	function insertTabIcon(num, url){
		var img = document.createElement('img');
		img.setAttribute('id','stamp_tab_icon_' + num);
		img.setAttribute('class','stamp_tab_icon');
		img.setAttribute('src',url);
		img.setAttribute('data_tab_number', num);
		img.onclick = clickTabIcon;

		var stamp_tab = document.getElementById('stamp_tab');
		stamp_tab.appendChild(img);
	}

	/**
	 * タブアイテムをクリックでシート切り替え.
	 */
	function clickTabIcon(){
		var num = this.getAttribute('data_tab_number');
		if(num){
			switchStampView(num);
		}
	}

	/**
	 * スタンプシート.
	 */
	function insertStampView(num, stamp_list){
		if(stamp_list.length == 0){
			return false;
		}

		var stamp_view = document.createElement('div');
		stamp_view.setAttribute('id','stamp_view_' + num);
		stamp_view.setAttribute('class','stamp_view');
		stamp_view.setAttribute('data_tab_number', num);
		stamp_view.style.display = 'none';

		var stamp_view_ul = document.createElement('ul');
		stamp_view_ul.setAttribute('class','stamp_view_ul');
		stamp_view.appendChild(stamp_view_ul);

		for(var i = 0; i < stamp_list.length; i++){
			var btn = createStampButtonElement(stamp_list[i]);
			stamp_view_ul.appendChild(btn);
		}

		insertTabIcon(num,stamp_list[0]);

		var stamp_tab = document.getElementById('stamp_tab');
		var stamp_container = document.getElementById('stamp_container');
		stamp_container.appendChild(stamp_view);

		return true;
	}

	/**
	 * スタンプシートの切り替え.
	 */
	function switchStampView(num){
		var stamp_view = document.getElementById('stamp_view_' + current_stamp_view);
		if(stamp_view){
			stamp_view.style.display = 'none';
		}
		var tab = document.getElementById('stamp_tab_icon_' + current_stamp_view);
		if(tab){
			tab.setAttribute('class','stamp_tab_icon');
		}

		current_stamp_view = num;
		stamp_view = document.getElementById('stamp_view_' + current_stamp_view);
		if(stamp_view){
			stamp_view.style.display = 'block';
		}
		tab = document.getElementById('stamp_tab_icon_' + current_stamp_view);
		if(tab){
			tab.setAttribute('class','stamp_tab_icon active');
		}
		CW.view.resizeLayout();
	}

	/**
	 * スタンプボタン生成.
	 */
	function createStampButtonElement(url){
		var img = document.createElement('img');
		img.setAttribute('src', url);

		var btn = document.createElement('li');
		btn.setAttribute('class','stamp');
		btn.setAttribute('data_value', url);
		btn.onclick = onClickStampButton;
		btn.appendChild(img);

		return btn;
	}

	/**
	 * スタンプが押された時
	 */
	function onClickStampButton(){
		postStamp(this);
		switchStampContainer();
	}

	/**
	 * スタンプ投稿
	 */
	function postStamp(btn){
		var message_input = document.getElementById('message-input');
		var tmp = message_input.value;

		message_input.value = btn.getAttribute('data_value');

		var submit = document.createEvent('Event');
		submit.initEvent('submit',false,false);
		document.getElementById('message-form').dispatchEvent(submit);

		message_input.value = tmp;
	}

	/**
	 * スタンプ表示の切替
	 */
	function switchStampContainer(){
		is_visible = !is_visible;
		var stamp_container = document.getElementById('stamp_container');
		if(is_visible){
			stamp_container.style.display = 'block';
		}else{
			stamp_container.style.display = 'none';
		}
		CW.view.resizeLayout();
	}

	setup();

})();
