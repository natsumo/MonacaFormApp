/** ニフクラ mobile backend 連携処理 **/

// APIキー
var applicationKey = 'YOUR_NCMB_APPLICATION_KEY';
var clientKey = 'YOUR_NCMB_CLIENT_KEY';

// SDK初期化
var ncmb = new NCMB(applicationKey, clientKey);

mb = {
    /***** demo1：保存 *****/
    saveData: function(data) { 
        // 保存先クラスの作成
        var Inquiry = ncmb.DataStore('Inquiry'); 
        // インスタンスの生成
        var inquiry = new Inquiry();  
        // データの設定と保存
        inquiry.set('name', data[0])
                .set('emailAddress', data[1])
                .set('age', data[2])
                .set('prefecture', data[3])
                .set('title', data[4])
                .set('contents', data[5])
                .save()
                .then(function(results){
                    // 保存成功
                    ons.notification.alert('問い合わせを受け付けました');
                    console.log('保存成功');
                })
                .catch(function(error){
                    //保存失敗
                    ons.notification.alert('問い合わせの受付に失敗したしました');
                    console.log('保存失敗：' + error);
                });
    },
    /***** demo2：全件検索 *****/
    getAllData: function() {        
        // インスタンスの生成
        var inquiry = ncmb.DataStore('Inquiry');
        // データを全件検索取得
        inquiry.order('createDate',true) // 保存日時降順
                .fetchAll()
                .then(function(results){
                    //全件取得成功理
                    console.log('全件検索成功：' + results.length + '件');
                    setData('全件検索', results, '#dataList');
                })
                .catch(function(error){
                    //全件取得失敗
                    ons.notification.alert('データの取得に失敗しました');
                    console.log('全件検索失敗：' + error);
                });
    },
    /***** demo3-1：条件検索 *****/
    getSearchData: function(feild, inputData) {
        // インスタンスの生成
        var inquiry = ncmb.DataStore('Inquiry');
        // データの条件検索取得（完全一致）
        inquiry.order('createDate',true) // 保存日時降順
               .equalTo(feild, inputData)
               .fetchAll()
               .then(function(results){
                   // 検索成功
                   console.log('条件検索成功');
                   setData('条件検索', results, '#searchDataList1');
               })
               .catch(function(error){
                   // 検索失敗
                   ons.notification.alert('データの取得に失敗しました');
                   console.log('条件検索失敗：' + error);
               });
    },
    /***** demo3-2：条件検索（範囲指定） *****/
    getRangeSearchData: function(feild, inputDataGreaterThan, inputDataLessThan) {
        // インスタンスの生成
        var inquiry = ncmb.DataStore('Inquiry');
        // データのの条件検索取得（範囲指定） 
        inquiry.order('createDate',true) // 保存日時降順
               .greaterThanOrEqualTo(feild, inputDataGreaterThan)
               .lessThan(feild, inputDataLessThan)
               .fetchAll()
               .then(function(results){
                   // 検索成功
                   console.log('条件検索(範囲指定)成功');
                   setData('条件検索(範囲指定)', results, '#searchDataList2');
               })
               .catch(function(error){
                   // 検索失敗
                   ons.notification.alert('データの取得に失敗しました');
                   console.log('条件検索(範囲指定)失敗：' + error);
               });
    }
};