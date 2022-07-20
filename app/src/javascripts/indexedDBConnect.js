    // var db;
    // var request = window.indexedDB.open('indexedDBTest', 1);
    // //操作成功的回调函数
    // request.onsuccess = function(event){
    //     // event.target就是request对象，可以用event.target.result获得创建的数据库
    //     db = request.result;
    //     console.log("indexedDB open success")
    // }
    //
    // //操作失败的回调函数
    // request.onerror = function(event){
    //     console.error("数据库创建/打开失败")
    // }
    //
    // //数据库版本更新时的回调函数
    // request.onupgradeneeded = function(event){
    //     // 获取数据库
    //     db = event.target.result;
    //     // 在数据库版本更新时创建表（对象存储空间）
    //     db.createObjectStore("BuyerPWD", {keyPath: "id",autoIncrement: true})
    // }

    var db;

    var dbVersion = 1; // 全局的indexedDB数据库实例。

    // 2\. 通过IDBFactory接口的open方法打开一个indexedDB的数据库实例
    // 第一个参数： 数据库的名字，第二个参数：数据库的版本。返回值是一个：IDBRequest实例,此实例有onerror和onsuccess事件。
    let request = window.indexedDB.open("indexedDBTest", dbVersion);


    // 打开数据库成功后，自动调用onsuccess事件回调。
    request.onsuccess = function (e) {
        console.log("开启成功success");
        db = e.target.result; // 获取到 demoDB对应的 IDBDatabase实例,也就是我们的数据库。
        db.onversionchange = () => {
            db.close();
        }
    };

    // 打开数据库失败
    request.onerror = function (e) {
        console.log("开启db失败" + e.currentTarget.error.message);
    };

    // 第一次打开成功后或者版本有变化自动执行以下事件：一般用于初始化数据库。
    request.onupgradeneeded = function (e) {
        console.log("版本修改了！");
        db = e.target.result;
        if (db.objectStoreNames.contains("users")) {
            db.deleteObjectStore("users")
        }
        db.createObjectStore("users", {
            keyPath: "username"
        })
        console.log('数据库版本更改为： ' + dbVersion);
    };
    let user = {
        username: '111007',
        phone: '189111833',
        address: 'aicoder.com'
    };

    function dbTest() {
        for (let index = 0; index < 10000; index++) {
            user.username = parseInt(user.username) + 1
            // 创建一个事务，类型：IDBTransaction，文档地址： https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
            let transaction = db.transaction("users", "readwrite"),
                // 通过事务来获取IDBObjectStore
                store = transaction.objectStore("users"),
                result1 = store.add(user);
            result1.onsuccess = (e) => {
                console.log("1111success");
            }
        }
    }
