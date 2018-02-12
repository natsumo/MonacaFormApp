// APIキー
var applicationKey = "YOUR_NCMB_APPLICATION_KEY";
var clientKey = "YOUR_NCMB_CLIENT_KEY";

// SDK初期化
var ncmb = new NCMB(applicationKey, clientKey);

// 各ページ表示時の処理
document.addEventListener('show', function(event) {
    var page = event.target;
    // 一覧画面が表示されたとき
    if (page.id === 'demo1Page') {
        console.log("demo1");
        list.makeAgeList("#inputAge");
        list.makePrefectureList("#inputPrefecture");
    } else if (page.id === 'demo2Page') {
        console.log("demo2");
        mb.getAllData();
    } else if (page.id === 'demo3-1Page') {
        console.log("demo3-1");
        list.makePrefectureList("#inputSearchPrefecture");
    } else if (page.id === 'demo3-2Page') {
        console.log("demo3-2");
        list.makeAgeList("#inputAgeGreaterThan");
        list.makeAgeList("#inputAgeLessThan");
    }
});


// mBaaS関連処理
mb = {
    /***** demo1：保存 *****/
    saveData: function(data) { 
        //保存先クラスの作成
        var Inquiry = ncmb.DataStore("Inquiry"); 
        //インスタンスの生成
        var inquiry = new Inquiry();  
        //データの設定と保存
        inquiry.set("name", data[0])
                .set("emailAddress", data[1])
                .set("age", data[2])
                .set("prefecture", data[3])
                .set("title", data[4])
                .set("contents", data[5])
                .save()
                .then(function(results){
                    //保存成功
                    ons.notification.alert("問い合わせを受け付けました");
                    console.log("保存成功");
                    // list.listReset();
                })
                .catch(function(error){
                    //保存失敗
                    ons.notification.alert("問い合わせの受付に失敗したしました");
                    console.log("保存失敗：" + error);
                });
    },
    /***** demo2：全件検索 *****/
    getAllData: function() {        
        //インスタンスの生成
        var inquiry = ncmb.DataStore("Inquiry");
        //データを降順で取得する
        inquiry.order("createDate",true)
                .fetchAll()
                .then(function(results){
                    //全件取得成功理
                    console.log("全件検索成功：" + results.length + "件");
                    //テーブルにデータをセット
                    setData("全件検索", results, "#dataList");
                })
                .catch(function(error){
                    //全件取得失敗
                    ons.notification.alert("データの取得に失敗しました");
                    console.log("全件検索失敗：" + error);
                });
    },
    /***** demo3-1：条件検索 *****/
    getSearchData: function(feild, inputData) {
        var inquiry = ncmb.DataStore("Inquiry");
            
        //データの取得 
        inquiry.order("createDate",true)
               .equalTo(feild, inputData)
               .fetchAll()
               .then(function(results){
                   //検索成功
                   console.log("条件検索成功");
                   setData("条件検索", results, "#searchDataList1");
               })
               .catch(function(error){
                   //検索失敗
                   ons.notification.alert("データの取得に失敗しました");
                   console.log("条件検索失敗：" + error);
               });
    },
    /***** demo3-2：条件検索（範囲指定） *****/
    getRangeSearchData: function(feild, inputDataGreaterThan, inputDataLessThan) {
        var inquiry = ncmb.DataStore("Inquiry");
        //データの取得 
        inquiry.order("createDate",true)
               .greaterThanOrEqualTo(feild, inputDataGreaterThan)
               .lessThan(feild, inputDataLessThan)
               .fetchAll()
               .then(function(results){
                   //検索成功
                   console.log("条件検索(範囲指定)成功");
                   setData("条件検索(範囲指定)", results, "#searchDataList2");
               })
               .catch(function(error){
                   //検索失敗
                   ons.notification.alert("データの取得に失敗しました");
                   console.log("条件検索(範囲指定)失敗：" + error);
               });
    }
};


function sendForm() {
    // 入力値の取得
    var name    = $("#inputName").val(); 
    var emailAddress = $("#inputEmailAddress").val();
    var age      = $("#inputAge").val();
    if (age != "") {
        // 型変換（数値）
        age = Number(age);
    }
    var prefecture  = $("#inputPrefecture").val();
    var title       = $("#inputTitle").val();
    var contents     = $("#inputContents").val();
    
    var InqueryArray = [name, emailAddress, age, prefecture, title, contents];
    
    // 入力規則
    if(name == ""){
        ons.notification.alert('名前が入力されていません');
    }else if(emailAddress == ""){
        ons.notification.alert('メールアドレスが入力されていません');
    }else if(age == ""){
        ons.notification.alert('年齢が入力されていません');
    }else if(prefecture == ""){
        ons.notification.alert('都道府県が入力されていません');
    }else if(title == ""){
        ons.notification.alert('問い合わせタイトル<br>が入力されていません');
    }else if(contents == ""){
        ons.notification.alert('問い合わせ内容が入力されていません');
    }else{
        mb.saveData(InqueryArray);
        fn.load('demo1.html');
    }
}

function searchEmailAddress(){ 
    //データを変数にセット
    var emailAddress = $('#inputSearchEmailAddress').val();
    if (emailAddress == "") {
        ons.notification.alert('値を入力してください');
    } else {
        mb.getSearchData("emailAddress", emailAddress);
    }
}

function searchPrefecture() {
    var prefecture = $('#inputSearchPrefecture').val();
    if (prefecture == "") {
        ons.notification.alert('値を入力してください');
    } else {
        mb.getSearchData("prefecture", prefecture);
    }
}

function searchAge() {
    var inputAgeGreaterThan = $('#inputAgeGreaterThan').val();
    if (inputAgeGreaterThan != "") {
        inputAgeGreaterThan = Number(inputAgeGreaterThan);
    }
    var inputAgeLessThan = $('#inputAgeLessThan').val();
    if (inputAgeLessThan != "") {
        inputAgeLessThan = Number(inputAgeLessThan);
    }
    
    if (inputAgeGreaterThan == "" || inputAgeLessThan == "") {
        ons.notification.alert('値を入力してください');
    } else if (inputAgeGreaterThan >= inputAgeLessThan){
        ons.notification.alert('値が不正です');
    } else {
        mb.getRangeSearchData("age", inputAgeGreaterThan, inputAgeLessThan);
    }
    
}

//テーブルにデータをセットする処理
function setData(str, results, id) {
    $(id).empty();
    var count = results.length;
    var dom = "<li class='list-header'>" + str + " 結果：" + count + "件</li>";
    for (var i = 0; i < results.length; i++) {
        var object   = results[i];
        var title = object.get("title");
        var contents = object.get("contents");
        var name = object.get("name");
        var emailAddress = object.get("emailAddress");
        var age = object.get("age");
        var prefecture = object.get("prefecture");
        
        var objectId = object.get("objectId");
        
        var createDate = object.get("createDate");
        var jstDate = replaceTimeForm(createDate);
        
        dom = dom + "<li class='list-item list-item--material' style='text-align: left;' onClick='contentsDialog(\"" + contents + "\");'>";
        dom = dom + "<div class='list-item__center list-item--material__center'>";
        dom = dom + "<div class='list-item__title list-item--material__title'>" + title + "</div>";
        dom = dom + "<div class='list-item__subtitle list-item--material__subtitle'>";
        dom = dom + jstDate + "<br>" + name + " (" + prefecture + ") -" + age + "- " + emailAddress;
        dom = dom + "</div></div></li>";
    }
    
    $(id).append(dom);

}

// アラートダイアログ表示
function contentsDialog(str) {
    ons.notification.alert(str);
}

// 時刻変換
function replaceTimeForm(date) {
    var year     = date.slice(0,4);      //YYYYを取り出す
    var month    = date.slice(5,7);      //MMを取り出す
    var day      = date.slice(8,10);     //DDを取り出す            
    // var hour     = date.slice(11,13);    //hhを取り出す
    var minute   = date.slice(14,16);    //mmを取り出す
        
    //hourが協定時間なので、現地時間（+09:00）となるようにする
    var datehour = new Date(date);  //hourをDate型に変換
    var jsthour  = datehour.getHours();  //datehourを現地時間にする
    var jstDate  = year + "/" + month + "/" + day + " " + jsthour +":"+ minute;
    
    return jstDate;
}