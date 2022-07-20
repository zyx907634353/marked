    // var db;
    // var request = window.indexedDB.open('indexedDBTest', 1);
    // //�����ɹ��Ļص�����
    // request.onsuccess = function(event){
    //     // event.target����request���󣬿�����event.target.result��ô��������ݿ�
    //     db = request.result;
    //     console.log("indexedDB open success")
    // }
    //
    // //����ʧ�ܵĻص�����
    // request.onerror = function(event){
    //     console.error("���ݿⴴ��/��ʧ��")
    // }
    //
    // //���ݿ�汾����ʱ�Ļص�����
    // request.onupgradeneeded = function(event){
    //     // ��ȡ���ݿ�
    //     db = event.target.result;
    //     // �����ݿ�汾����ʱ����������洢�ռ䣩
    //     db.createObjectStore("BuyerPWD", {keyPath: "id",autoIncrement: true})
    // }

    var db;

    var dbVersion = 1; // ȫ�ֵ�indexedDB���ݿ�ʵ����

    // 2\. ͨ��IDBFactory�ӿڵ�open������һ��indexedDB�����ݿ�ʵ��
    // ��һ�������� ���ݿ�����֣��ڶ������������ݿ�İ汾������ֵ��һ����IDBRequestʵ��,��ʵ����onerror��onsuccess�¼���
    let request = window.indexedDB.open("indexedDBTest", dbVersion);


    // �����ݿ�ɹ����Զ�����onsuccess�¼��ص���
    request.onsuccess = function (e) {
        console.log("�����ɹ�success");
        db = e.target.result; // ��ȡ�� demoDB��Ӧ�� IDBDatabaseʵ��,Ҳ�������ǵ����ݿ⡣
        db.onversionchange = () => {
            db.close();
        }
    };

    // �����ݿ�ʧ��
    request.onerror = function (e) {
        console.log("����dbʧ��" + e.currentTarget.error.message);
    };

    // ��һ�δ򿪳ɹ�����߰汾�б仯�Զ�ִ�������¼���һ�����ڳ�ʼ�����ݿ⡣
    request.onupgradeneeded = function (e) {
        console.log("�汾�޸��ˣ�");
        db = e.target.result;
        if (db.objectStoreNames.contains("users")) {
            db.deleteObjectStore("users")
        }
        db.createObjectStore("users", {
            keyPath: "username"
        })
        console.log('���ݿ�汾����Ϊ�� ' + dbVersion);
    };
    let user = {
        username: '111007',
        phone: '189111833',
        address: 'aicoder.com'
    };

    function dbTest() {
        for (let index = 0; index < 10000; index++) {
            user.username = parseInt(user.username) + 1
            // ����һ���������ͣ�IDBTransaction���ĵ���ַ�� https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction
            let transaction = db.transaction("users", "readwrite"),
                // ͨ����������ȡIDBObjectStore
                store = transaction.objectStore("users"),
                result1 = store.add(user);
            result1.onsuccess = (e) => {
                console.log("1111success");
            }
        }
    }
