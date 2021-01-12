// 各ページ表示時の処理
document.addEventListener('show', function(event) {
    var page = event.target;

    if (page.id === 'demo1Page') {
        // demo1：保存
        list.makeAgeList('#inputAge');
        list.makePrefectureList('#inputPrefecture');
    } else if (page.id === 'demo2Page') {
        // demo2：全件検索
        mb.getAllData();
    } else if (page.id === 'demo3-1Page') {
        // demo3-1：条件検索
        list.makePrefectureList('#inputSearchPrefecture');
    } else if (page.id === 'demo3-2Page') {
        // demo3-2：条件検索
        list.makeAgeList('#inputAgeGreaterThan');
        list.makeAgeList('#inputAgeLessThan');
    }
});

// 「demo1：保存」送信ボタン押下時の処理
function sendForm() {
    // 入力値の取得
    var name    = $('#inputName').val(); 
    var emailAddress = $('#inputEmailAddress').val();
    var age      = $('#inputAge').val();
    if (age != '') {
        // 型変換（文字列→数値）
        age = Number(age);
    }
    var prefecture  = $('#inputPrefecture').val();
    var title       = $('#inputTitle').val();
    var contents     = $('#inputContents').val();
    
    var InqueryArray = [name, emailAddress, age, prefecture, title, contents];
    
    // 入力チェック
    if(name == ''){
        ons.notification.alert('名前が入力されていません');
    }else if(emailAddress == ''){
        ons.notification.alert('メールアドレスが入力されていません');
    }else if(age == ''){
        ons.notification.alert('年齢が入力されていません');
    }else if(prefecture == ''){
        ons.notification.alert('都道府県が入力されていません');
    }else if(title == ''){
        ons.notification.alert('問い合わせタイトル<br>が入力されていません');
    }else if(contents == ''){
        ons.notification.alert('問い合わせ内容が入力されていません');
    }else{
        // データの保存
        mb.saveData(InqueryArray);
        fn.load('demo1.html');
    }
}

// 「demo3-1：条件検索」メールアドレス「検索」ボタン押下時の処理
function searchEmailAddress(){ 
    var emailAddress = $('#inputSearchEmailAddress').val();
    // 入力チェック
    if (emailAddress == '') {
        ons.notification.alert('値を入力してください');
    } else {
        // 条件検索
        mb.getSearchData('emailAddress', emailAddress);
    }
}

// 「demo3-1：条件検索」都道府県「検索」ボタン押下時の処理
function searchPrefecture() {
    var prefecture = $('#inputSearchPrefecture').val();
    // 入力チェック
    if (prefecture == '') {
        ons.notification.alert('値を入力してください');
    } else {
        // 条件検索
        mb.getSearchData('prefecture', prefecture);
    }
}

// 「demo3-2：条件検索年齢「検索」ボタン押下時の処理
function searchAge() {
    var inputAgeGreaterThan = $('#inputAgeGreaterThan').val(); // **以上
    if (inputAgeGreaterThan != '') {
        inputAgeGreaterThan = Number(inputAgeGreaterThan);
    }
    var inputAgeLessThan = $('#inputAgeLessThan').val(); // **未満
    if (inputAgeLessThan != '') {
        inputAgeLessThan = Number(inputAgeLessThan);
    }
    
    // 入力チェック
    if (inputAgeGreaterThan === '' || inputAgeLessThan === '') {
        ons.notification.alert('値を入力してください');
    } else if (inputAgeGreaterThan >= inputAgeLessThan){
        ons.notification.alert('値が不正です');
    } else {
        // 条件検索（範囲指定）
        mb.getRangeSearchData('age', inputAgeGreaterThan, inputAgeLessThan);
    }
}

// 各ページのリストを生成
function setData(str, results, listId) {
    $(listId).empty();
    var count = results.length;
    // ヘッダー
    var dom = "<li class='list-header'>" + str + " 結果：" + count + "件</li>";
    // リストアイテム
    for (var i = 0; i < results.length; i++) {
        var object   = results[i];
        var title = object.get('title');
        var contents = object.get('contents');
        var name = object.get('name');
        var emailAddress = object.get('emailAddress');
        var age = object.get('age');
        var prefecture = object.get('prefecture');
    
        var createDate = object.get('createDate');
        var jstCreateDate = replaceTimeForm(createDate);
        
        dom = dom + "<li class='list-item list-item--material' style='text-align: left;' onClick='ons.notification.alert(\"" + contents + "\");'>";
        dom = dom + "<div class='list-item__center list-item--material__center'>";
        dom = dom + "<div class='list-item__title list-item--material__title'>" + title + "</div>";
        dom = dom + "<div class='list-item__subtitle list-item--material__subtitle'>";
        dom = dom + jstCreateDate + "<br>" + name + " (" + prefecture + ") -" + age + "- " + emailAddress;
        dom = dom + "</div></div></li>";
    }
    
    $(listId).append(dom);
}

// 時刻変換（UTF→JST）
function replaceTimeForm(date) {
    var createDate = new Date(date);  
    var year = createDate.getFullYear();
    var month = createDate.getMonth() + 1;
    var day = createDate.getDate();
    var hour = createDate.getHours();
    var minute = createDate.getMinutes();
    var second = createDate.getSeconds();
   
    var jstCreateDate  = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    
    return jstCreateDate;
}