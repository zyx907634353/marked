import "../../../bootstrap/css/bootstrap.css"
import "../stylesheet/app.css";

import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract'
import _edata_store_artifacts from '../../../build/contracts/EDataStore.json'

import ipfsAPI from 'ipfs-api'
//import ethUtil from 'ethereumjs-util'
import $ from 'jquery'
import {sha256} from "ethereumjs-util";

//后台水印
// import {run} from './obMark';

//文字识别库
//import Tesseract from 'tesseract.js';
//import { createWorker } from 'tesseract.js';

const ethereumNodeUrl = 'http://localhost:8545';
//实例化合约
const EDataStore = contract(_edata_store_artifacts);
//本地IPFS API端口
const ipfsApiAddress = {
    protocol: 'http',
    host: 'localhost',
    port: 5001
}
const ipfsGatewayUrl = 'http://localhost:8080'
// const ipfsApiAddress = {
//     protocol: 'https',
//     host: 'ipfs.infura.io',
//     port: 5001
// }
// const ipfsGatewayUrl = 'https://ipfs.infura.io:5001'

const ipfs = ipfsAPI(ipfsApiAddress);



//大整数库
const BN = require('bn.js');
//加密库
const CrypoUtils = require('./CryUtils');

//mongodb端口
// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb://localhost:27017/";

//rinkeby合约地址
// const contractAddress = '0xb21a6CE33A33Cf4690ad369F09085A5dfe4bD80e';
//本地合约
let contractAddress = '0x813a4405f779651bDDfc783fba1611e4745503e5';

//全局缓冲
let reader,cryReader;

window.App = {
    start: function() {
        EDataStore.setProvider(App.web3Provider)

        //web3接口
        //EDataStore.setProvider(window.web3.currentProvider);

        //checkAllBoughtProduct()
        checkAllData();

        //上架页面数据监听
        if($('#launch-page').length>0){
            getCurrentAccount().then(account => $('#eth-address').html('当前账户:'+account));

            $("#product-image").change( event => {
                if(event.target.files.length === 0) return
                const file = event.target.files[0]

                reader = new window.FileReader()
                reader.readAsArrayBuffer(file)

                cryReader = new FileReader();
                cryReader.readAsDataURL(file);

            });

            $("#add-item-to-store").submit(event => {
                event.preventDefault();
                const req = $("#add-item-to-store").serialize();
                let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                let decodedParams = {}
                Object.keys(params)
                    .forEach( k => decodedParams[k] = decodeURIComponent(decodeURI(params[k])) )
                saveProduct(cryReader,reader, decodedParams);
            })
        }
        //检索页数据监听
        if($('#data-list-page').length>0){
            getCurrentAccount().then(account => $('#eth-address').html('当前账户:'+account));
        }

        //支付页数据监听
        if($('#payment-page').length>0){
            getCurrentAccount().then(account => $('#eth-address').html('当前账户:'+account));
        }
            $("#add-password-B").submit(event => {
                event.preventDefault();
                let id = document.getElementById("product-id").value
                let pwd = document.getElementById("password-B").value;
                // console.log(id);
                // console.log(pwd);
                // saveChosenProduct(id, pwd);
                getAutoIndexForBuyer(id,pwd);
                //addCryptedPasswordToDB(id,pwd);
            })

        //举报页面数据监听
         if($('#report-page').length>0){
             getCurrentAccount().then(account => $('#eth-address').html('当前账户:'+account));
             //getContractBalance();

             $("#add-image-report").submit(event => {
                 event.preventDefault();
                 let file = document.getElementById('report-image').files[0];
                 uploadImg(file);
             });
             $("#inputPasswordOfWatermark").submit(event =>{
                 event.preventDefault();
                 let passwordOfWatermark = document.getElementById("inputHash").value;
                 //console.log(passwordOfWatermark);
                 uploadPasswordOfWaterMark(passwordOfWatermark);
             })
         }

        //购买记录页监听
        if($('#bought-list-page').length>0){
            getCurrentAccount().then(account => $('#eth-address').html('当前账户:'+account));

            getCreditValue().then(creditValue => {
                if(creditValue === 0) {
                    alert('您尚未买过东西或者您的的账户已经被拉入系统黑名单!');
                    document.getElementById("fundValue").style.display='none';
                }
                else {
                    $('#credit').html('信誉值：100');
                    checkAllBoughtProduct();
                }})

            $("#form-original-refund").submit(event => {
                event.preventDefault();
                checkQua()
                //claimRefund(refundNumber)
                //let value = document.getElementById('fundValue').value;
                //console.log(value);
            });
        }
    }
};

window.addEventListener('load', function() {
    //window.web3 = new Web3(new Web3.providers.HttpProvider(ethereumNodeUrl));
    //console.log("web3"+web3);


    // Is there is an injected web3 instance?
    // if (typeof web3 !== 'undefined') {
    //     //App.web3Provider = web3.currentProvider;
    //     web3 = new Web3(window.ethereum.currentProvider);
    //     //window.web3 = new Web3.providers.HttpProvider(web3.currentProvider);
    //     $('#eth-address').append(web3.eth.accounts[0]);
    // } else {
    //     // If no injected web3 instance is detected, fallback to Ganache CLI.
    //     App.web3Provider = new web3.providers.HttpProvider(ethereumNodeUrl);
    //     web3 = new Web3(App.web3Provider);
    // }

    // 检查新版MetaMask
    if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
            // 请求用户账号授权
            window.ethereum.request({method: 'eth_requestAccounts'})
        } catch (error) {
            // 用户拒绝了访问
            console.error("User denied account access")
        }
    }
    // 老版 MetaMask
    else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
    }
    // 如果没有注入的web3实例，回退到使用 Truffle Develop
    else {
        App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        alert('请使用安装了metamask的浏览器！');
    }

    window.web3= new Web3(App.web3Provider)
    App.start();
})

function getCreditValue(){
    let inst;
    //let value = Number(5);
    // .then(result => {return Number(result)})
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => getCurrentAccount())
        .then(account => inst.getBuyerCredit(account))
        .then(result => {return Number(result)})
}
function checkQua(){
    console.time('yajinhuishou1');
    let inst,currentAccount;
    let max;
    let refundTime = new Date().getTime();
    let refundNumber = Number();
    let flag = Number();
    let effCount = Number(0);
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => getCurrentAccount())
        .then(account => currentAccount = account)
        .then(() => inst.getBoughtProductId(currentAccount))
        .then(index => max=index)
        .then(() => {
            for(let id=1; id<=max;id++){
                //console.log('序号：'+id);
                //claimRefund(id,currentAccount)
                inst.getAllBoughtProductForBuyer(currentAccount,id)
                    .then(product => {
                        if((refundTime >= Number(product[3]*1000)) && (Number(product[4])==0))
                        {
                            refundNumber += (Number(product[1]))*0.2;
                            flag=1;
                            effCount++;
                        }
                        //alert('可取资金：'+refundNumber/1000000000000000000+'ether')
                        if(id == max)
                            if(refundNumber != 0)
                            {
                                alert("当前可索取的押金总数为："+ refundNumber/1000000000000000000 +" ether"+"  请确认下面"+(effCount+1)+"笔交易以取回您的押金")
                                console.timeEnd('yajinhuishou1')
                                claimRefund(currentAccount,refundNumber)
                            }
                            else alert('当前无可索取的押金！')
                    }
                        )
                    .then(() => {
                        if(flag == 1)
                            inst.setProductFlag(id,currentAccount,{from:currentAccount});
                    })
                    .then(() => flag=0)
                    // .then(() => inst.getAllBoughtProductForBuyer(currentAccount,id))
                    // .then(product1 => console.log(Number(product1[4])))
            }

        })

}
/**
 * 获取合约余额
 */
function getContractBalance() {
    return EDataStore.deployed()
        .then(i => i.getContractBalance())
        .then(balance => console.log("合约余额"+Number(balance)/1000000000000000000))
}
/**
 * 索取押金
 * @param currentAccount{promise}
 * @param refundNumber{number}
 */
function claimRefund(currentAccount,refundNumber){
    //console.log('address'+currentAccount+'refund'+refundNumber);
    let inst;
    let result;
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => inst.getContractBalance())
        .then(contractBalance => result = contractBalance)

        //.then(() => console.log(Number(result)))
        // .then(() => console.timeEnd('yajinhuishou1'))
        .then(() => {
                if(result <= refundNumber)
                    return {
                    then(resolve,reject) {
                            reject('您当前申请回收的资金过多，请稍后再试！');
                        }}
            }
            )
        .then(() => inst.refundForBuyer(refundNumber,{from:currentAccount,gas:440000}))
        .catch(err => console.log(err))
}
/**
 * 检查所购商品
 */
function checkAllBoughtProduct(){

    let inst,currentAccount;
    //let boughtProduct;
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => getCurrentAccount())
        .then(account => currentAccount = account)
        .then(() => inst.getBoughtProductId(currentAccount))
        .then(index => {
            for(let id=1;id<=index;id++){
                inst.getAllBoughtProductForBuyer(currentAccount,id)
                    .then(product=>$("#all-bought-list").append(getAllBoughtProduct(product)))
            }
        })
}
/**
 * 搭建所购商品页
 * @param product{Object}
 */
function getAllBoughtProduct(product){
    let boughtProductId = Number(product[0]);
    let refund = (Number(product[1])/1000000000000000000)*0.2;
    let lastDate = new Date(product[3]*1000).toLocaleString();

    let html = `

        <h3 class="card-title text-dark text-uppercase" id="bought-product-number">
            <b>已购产品${boughtProductId}</b>
        </h3>
        
        <div class="card" id="product-details">

        <div class="card-body">
            <h5 class="card-title bg-light text-secondary" id="bought-product-name">
                <b>${product[2]}</b>
            </h5>
            <p class="card-text" id="lastDate">可回收时间：${lastDate}</p>
            <p class="card-text p-y-1">
            
            <h5 class="card-title bg-light text-secondary" id="refundFlag" style="display: none">
                <b>未回收</b>
            </h5>
            
            </p>
                <form id="fundValueDiv">
                <div class="input-group-prepend w-100" >         
                    <h5>可收回的押金：</h5>
                    <span class="nav-link text-nowrap bg-secondary text-light " id="price">${refund}</span>
                    <span class="input-group-text" id="basic-addon1" >Ether</span>                    
                        
<!--                    onclick="location.href=('fundValue.html')"-->
                </div>
<!--                    <input id="refundValue" value="{refund}">-->
<!--                    <a href=""  class="btn btn-success ml-auto" id="refundValue" >回收押金</a>-->
                </form>
        </div>
        </div>


`
    return $(html);

}

/**
 * 测试账户余额
 */
// function checkAllBalances() {
//     var i =0;
//     web3.eth.accounts.forEach(
//         function(e){
//             console.log("  eth.accounts["+i+"]: " +  e + " \t+balance: " + web3.fromWei(web3.eth.getBalance(e), "ether") + " ether");
//             i++;
//         })
// }

/**
 * 检索所有产品
 */
function checkAllData() {
    let inst
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(()=> inst.productIndex())
        .then(next => {
            //console.log(next);
            for(let id=1;id<=next;id++){
                //console.log(id);
                inst.getProduct.call(id)
                    .then(p => $("#all-product-list").append(buildJQData(p)))
                    //.then(p => (buildJQData(p)).appendTo($("#all-product-list")))
            }
        })
}


/**
 * 搭建出售商品页
 * @param product{Object}
 */
function buildJQData(product){
        let price = Number(product[4])/1000000000000000000;
        //let src = "payment.html?product-number="+product[0]+"&product-name="+encodeURI(encodeURI(product[1]));

        //本地ipfs
        // let imgUrl = `${ipfsGatewayUrl}/ipfs/${product[2]}`;

        //infura ipfs 接口
        let imgUrl = `${ipfsGatewayUrl}/api/v0/cat?arg=${product[2]}`;

        let html = `

        <h3 class="card-title text-dark text-uppercase" id="product-number">
            <b>${product[0]}</b>
        </h3>
        
        <div class="card" id="product-details">
<!--        <img src="" alt="Card image cap" class="card-img-top mx-auto" id="product-image">-->
        <div class="card-body">
            <h5 class="card-title bg-light text-secondary" id="product-name">
                <b>${product[1]}</b>
            </h5>
            <p class="card-text" id="product-desc">${product[3]}</p>
            <p class="card-text p-y-1">
<!--                <b>Condition:&nbsp;-->
<!--                    <span class="badge badge-pill badge-primary">New</span>-->
<!--                </b>-->
            </p>         
            <img src="${imgUrl}" width="100" onclick="javascript:imgToCanvas1('${imgUrl}')">

            <div class="input-group-prepend w-100">
                <span class="input-group-text" id="basic-addon1">Ether</span>
                <span class="nav-link text-nowrap bg-secondary text-light " id="price">${price}</span>
<!--                <a href="payment.html?product-number= &price="  class="btn btn-success ml-auto" id="link-to-payment">购买产品</a>-->
                <a href="#" onclick="javascript:goToClient(${product[0]},${price})" class="btn btn-success ml-auto" id="link-to-payment">购买产品</a>
            </div>
        </div>
        </div>
        
        <script type="text/javascript">
            function goToClient(productNumber,price){
                window.location.href="payment.html?69i57j0i512j0i131i4x" + productNumber + "&j69i60j6x" + price +"&j6093x4";
            }
            
            /**
             * 图片转画布
             * @param url{string}
             */
            function imgToCanvas1(url) {
                // 创建img元素
                // const img = document.createElement("img");
                var img = new Image();
                // const canvas = document.createElement("canvas");
                var canvas = document.getElementById("innerCanvas");
                
                var ctx = canvas.getContext("2d");
                
                img.src = url;
                img.setAttribute("crossOrigin", "anonymous"); // 防止跨域引起的 Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.

                //await new Promise((resolve) => (img.onload = resolve));
                img.onload = function (){
                    // 创建canvas DOM元素，并设置其宽高和图片一样
            
                    //const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    // 坐标(0,0) 表示从此处开始绘制，相当于偏移。
                    ctx.drawImage(img, 0, 0);
                    
                    ctx.font = '30px Microsoft Yahei';
                    ctx.fillStyle = "red";
                    ctx.textBaseline = "middle";
                    ctx.fillText('newMark', canvas.width/2, canvas.height/2);
                    //ctx.fillText('${product[1]}',canvas.width*0.8,canvas.height*0.8);
                    
                }
                // return canvas;
                document.getElementById('innerCanvas').style.display ='inline-block';
            }
            
            
            // function addWatermark(canvas, text) {
            //     const ctx = canvas.getContext("2d");
            //     ctx.fillStyle = "red";
            //     ctx.textBaseline = "middle";
            //     ctx.fillText(text, 20, 20);
            //     return canvas;
            // }
            
            
            // function canvasToImg(canvas) {
            //     // 新建Image对象，可以理解为DOM
            //     var image = new Image();
            //     // canvas.toDataURL 返回的是一串Base64编码的URL
            //     // 指定格式 PNG
            //     image.src = canvas.toDataURL("image/png");
            //     return image;
            // }
            
            
            // export function run(imgUrl) {
            //     // const imgUrl =
            //     //     "http://localhost:8080/ipfs/QmUzvbh8ZeVs7MjNopDbid3PdGdDGmUoJHZk6SDWwDBTW5";
            //     // 1.图片路径转成canvas
            //     const tempCanvas = imgToCanvas(imgUrl);
            //     // 2.canvas添加水印
            //     const canvas = addWatermark(tempCanvas,"newMark");
            //     // 3.canvas转成img
            //     const img = canvasToImg(canvas);
            //     // // 查看效果
            //     // document.body.appendChild(img);
            //     return img;
            // }
        </script>

`
        return $(html);

}
/**
 * 图片上传IPFS
 * @param reader{FileReader}
 */
function saveImageOnIpfs(reader) {
    const buffer = Buffer.from(reader.result);
    return ipfs.add(buffer)
        .then( rsp => rsp[0].hash)
        .catch(err => console.error(err))
}

// function saveImageOnIpfs(reader) {
//     const buffer = Buffer.from(reader.result);
//     ///api/v0/add
//     return `${ipfsGatewayUrl}/api/v0/add`
//     //return ipfs.add(buffer)
//         .then( rsp => rsp[0].hash)
//         .catch(err => console.error(err))
// }

// function saveTextBlobOnIpfs(blob) {
//     const descBuffer = Buffer.from(blob, 'utf-8');
//     return ipfs.add(descBuffer)
//         .then( rsp => rsp[0].hash )
//         .catch( err => console.error(err))
// }

/**
 * 返回当前页面的一个promise账户
 */
async function getCurrentAccount(){
    const account = await ethereum.request({method:'eth_accounts'})
    //console.log(account[0]);
    return account[0];
}
/**
 * 数据上链
 * @param keyForSeller{string}
 * @param params{string}
 * @param imageId{string}
 */
function saveProductToBlockchain(keyForSeller,params, imageId, descId) {
    let currentAccount,inst;
    console.log(keyForSeller)
    console.log('imageId'+imageId);
    console.timeEnd('shangjia');
    // debugger
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => getCurrentAccount())
        .then(account => currentAccount = account)
        .then(() => console.log(currentAccount))
        .then(()=>
            inst.addProductToStore(params["product-name"],
            imageId, params["product-description"],
            web3.toWei(params["product-price"], 'ether'),
            params["password-A"],
            //parseFloat(params["product-price"]),
            {from: currentAccount, gas: 440000})
            //{from: account, gas: 440000})
        )
        .then(() =>{
            $("#msg-success-launch").show();
            $("#msg-success-launch").html("上架成功！记录您的私钥:" + keyForSeller);
            //$("#msg").html("产品成功上架！ 请记录产品图片信息 "+imageId);
            //$("#msg-success-launch").html("产品成功上架！请记录您对本产品嵌入的密码： "+params["password-A"]);
        })
        .catch(err => console.log(err))
}
/**
 * 数据加密
 * @param cryFileReader{FileReader}
 */
function cryptoDataWithRSA(cryFileReader){

    const wholeURL = cryFileReader.result.toString();


    const publicKey = CrypoUtils.pubKey;
    const privateKey = CrypoUtils.privKey;

    var URLArray = [];

    var encryptWholeURL = wholeURL;
    //slice前闭后开
    console.time("加密");
    for( var i=0 ;i<10 ;i++){

        //根据长度划分为10块
        var encryptStart = i*wholeURL.length/10;

        //每块取前22位进行加密
        var encryptPart = wholeURL.slice(encryptStart,encryptStart+22);

        var encryptDataPart = CrypoUtils.encrypt(encryptPart, publicKey);

        //密文存储入数组，后续解密使用
        if(!i) console.log(encryptDataPart.toString());

        URLArray.push(encryptDataPart);
        //将原图片URL的Base64编码的进行替换
        encryptWholeURL = encryptWholeURL.replace(encryptPart,encryptDataPart.toString("utf-8"));
        //加密完成
        //console.log("密文"+i+" "+encryptDataPart);
    }

    console.log(encryptWholeURL);
    console.timeEnd("加密");

    console.time("解密")


    for( var j=0 ;j<10 ; j++){

        //var decryptStart = i*wholeURL.length/10;
        var decryptedDataPart = CrypoUtils.decrypt(URLArray[j], privateKey);
        encryptWholeURL = encryptWholeURL.replace(URLArray[j],decryptedDataPart.toString('utf-8'))

        //获取密文，进行解密
        //const decryptedPart = CrypoUtils.decrypt(URLArray[j], privateKey).toString("utf-8");
        //获取指定替换位置

        //明文替换密文
        //wholeURL.replace(URLArray[j],decryptedPart);

        //var decryptPart = wholeURL.slice(decryptStart,decryptStart+22);
        //var decryptDataPart = CrypoUtils.encrypt(encryptPart, publicKey).toString();

    }
    //console.log(encryptWholeURL);
    console.timeEnd("解密");
    return privateKey;
}

/**
 * 数据上传IPFS+区块链
 * @param cryReader{FileReader}
 * @param reader{FileReader}
 * @param decodedParams{string}
 */
function saveProduct(cryReader,reader, decodedParams) {
    console.time('shangjia');
    let imageId;
    let descId;

    let keyForSeller = cryptoDataWithRSA(cryReader).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"');

    return saveImageOnIpfs(reader)
        .then(id => imageId = id)
        //.then(() => saveTextBlobOnIpfs(decodedParams["product-description"]) )
        //.then(id => descId = id)
        .then(() => saveProductToBlockchain(keyForSeller,decodedParams, imageId, descId))
        .catch(err => console.log(err))
}
/**
 * 上传要要购买的产品的信息
 * @param id{number}
 * @param password{string}
 * @param privateKey{string}
 */
function saveChosenProduct(id,password,privateKey){
    console.time('goumai');
    const index = password.toString();
    console.log("index:"+index);
    return EDataStore.deployed()
        .then(i => i.getPasswordAndImage(id,index))
        .then(product => {
            //console.log(product);
            addMarkToImage(product,id,password,privateKey);//password
        })
        .catch(err => console.log(err))
}
function addCryptedPasswordToDB(id,password){
    let DBId;
    const publicKey = CrypoUtils.pubKey;
    const privateKey = CrypoUtils.privKey;

    const cryptedData = CrypoUtils.encrypt(password, publicKey);
    const decrypted = CrypoUtils.decrypt(cryptedData, privateKey);

    console.log(cryptedData.toString('utf-8'));

    // MongoClient.connect(url, function(err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("crypDB1");
    //     var myobj = { address: 'address', crypoPassword: cryptedData };
    //     // var whereStr = {"address": ""};
    //
    //     dbo.collection("site").insertOne(myobj, function(err, result) {
    //         if (err) throw err;
    //         // console.log(result.insertedId.toString());
    //         DBId = result.insertedId.toString();
    //         //console.log(id);
    //         db.close();
    //
    //     });
    // });
    saveChosenProduct(id,"",privateKey);
}

/**
 * 加密测试
 * @param password{string}
 */
// function cryptedPasswordForBuyer(password){
//     const publicKey = CrypoUtils.pubKey;
//     const privateKey = CrypoUtils.privKey;
//
//     const cryptedData = CrypoUtils.encrypt(password, publicKey);
//     const decrypted = CrypoUtils.decrypt(cryptedData, privateKey);
//
//     return {cryptedData.toString(),privateKey};
// }

/**
 * 获取买家索引
 * @param id{number}
 * @param password{string}
 */
function getAutoIndexForBuyer(id,password){
    // var cPassword = cryptedPasswordForBuyer(password);
    
    console.time(10);
    const publicKey = CrypoUtils.pubKey;
    const privateKey = CrypoUtils.privKey;

    const cryptedData = CrypoUtils.encrypt(password, publicKey);
    const decrypted = CrypoUtils.decrypt(cryptedData, privateKey);
    console.timeEnd(10);
    var cPassword = cryptedData.toString();
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
        getCurrentAccount().then(account => {getPrimaryKey(db,cPassword,account)})
    };

    // 打开数据库失败
    request.onerror = function (e) {
        console.log("开启db失败" + e.currentTarget.error.message);
    };

    // 第一次打开成功后或者版本有变化自动执行以下事件：一般用于初始化数据库。
    request.onupgradeneeded = function (e) {
        console.log("版本修改了！");
        db = e.target.result;
        if (db.objectStoreNames.contains("indexedDBForBuyer")) {
            db.deleteObjectStore("indexedDBForBuyer")
        }
        var objectStore = db.createObjectStore("indexedDBForBuyer", {autoIncrement : true})//
        objectStore.createIndex('address', 'address', { unique: false });
        objectStore.createIndex('autoIndex', 'autoIndex', { unique: false });
        objectStore.createIndex('password', 'password', { unique: false});
        console.log('数据库版本更改为： ' + dbVersion);
        getCurrentAccount().then(account => {getPrimaryKey(db,cPassword,account)})

    };
    function getPrimaryKey(db,cPassword,account){
        
        let index;
        let transaction = db.transaction("indexedDBForBuyer","readwrite");
        // store = transaction.objectStore("users");
        var objectStore = transaction.objectStore("indexedDBForBuyer");
        var request = objectStore.count();
        request.onsuccess = function(e) {
            var result = e.target.result;
            //console.log(result);
            console.log("mima:"+cPassword);
            if(result == 0){
                objectStore.add({address:account,autoIndex:1,password:cPassword})
            }else{
                // console.log("输出了")
                objectStore.add({address:account,autoIndex:(result+1),password:cPassword})
            }
            index = result+1;

            saveChosenProduct(id,index,privateKey)
        }

    }
}

/**
 * 水印准备函数
 * @param product{object}
 * @param id{number}
 * @param password{string}
 * @param privateKey{string}
 */
function addMarkToImage(product,id,password,privateKey){
    // let imgUrl = `${ipfsGatewayUrl}/ipfs/${product[1]}`;

    let imgUrl = `${ipfsGatewayUrl}/api/v0/cat?arg=${product[1]}`;
    //console.log("imgUrl+"+imgUrl);

    let pwd = `${product[0]}`;
    console.log("最终的密码是"+pwd);
    console.timeEnd('goumai');
    let result = getCurrentAccount()
        .then(account => pay(id,account))
    result.then(
        ()=>{
            console.time('goumai3'); //计时器3
            addMark(imgUrl,pwd);
            console.timeEnd('goumai3') //计时器3
                //console.log("添加水印"+imgUrl);
                //.then(() => successPayment(id))
        },
        ()=>{
            alert("拒绝了交易，交易终止！");
            return {
                then(resolve,reject) {
                    reject();
                }
            }
        })
        //.then(() => console.log('支付成功'))
        .then(() =>
            setTimeout(()=> {
            const image = document.getElementById("myCanvas").toDataURL("image/png");
            //console.log(image);
            const buffer = Buffer.from(image);
            //console.log(sha256(buffer).length);
            //console.log("sha256:"+sha256(buffer).toString('utf-8',0));
            const imageWithMarkInSha256 = sha256(buffer).toString('utf8',0);

            addMarkedHashToBlockChain(id,imageWithMarkInSha256,password,privateKey);
        },8000))
        //.then(() => successPayment(id))
        .catch(err => console.log(err))
}

// function successPayment(id){
//     console.log('走了successPayment函数');
//     const image = document.getElementById("myCanvas").toDataURL("image/png");
//     console.log(image);
//     console.log(image.src);
//     const buffer = Buffer.from(image);
//     console.log(sha256(buffer).length);
//     console.log("sha256:"+sha256(buffer).toString('utf-8',0));
//     const imageWithMarkInSha256 = sha256(buffer).toString('utf8',0);
//     //console.log('添加Hash'+id);
//     addMarkedHashToBlockChain(id,imageWithMarkInSha256);
// }

/**
 * 加水印
 * @param id{number}
 * @param buyer{string}
 */

function pay(id,buyer){
    //console.log(id,buyer)
    let inst,productPrice;
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(()=>console.time('goumai2'))  //计时器2
        .then(() => inst.getPrice(id))
        .then(price => productPrice = price)
        .then(()=>console.timeEnd('goumai2'))   //计时器2
        .then(() => inst.getSellerAddress(id))
        //.then(seller => console.log(seller))
        //.then(seller => web3.eth.sendTransaction({
        //     from: buyer,
        //     to:seller,
        //     value: productPrice
        // }))
        .then(seller => ethereum.request({
            method:'eth_sendTransaction',
            params:[
                {
                    from:buyer,
                    to:seller,
                    //这里value要转化为bignumber，再转化为16进制的字符串
                    value:new BN(productPrice.toString(),10).toString(16),
                }
            ]
        }))
        .then(() => ethereum.request({
            method:'eth_sendTransaction',
            params:[
                {
                    from:buyer,
                    to:contractAddress,
                    //这里value要转化为bignumber，再转化为16进制的字符串
                    value:new BN((productPrice*0.2).toString(),10).toString(16),
                }
            ]
        }))
        //.then(() => $("#msg-success-payment").html("请支付一定的手续费，否则不可获得图片！"))
        //.then(txHash => console.log(txHash))//记录交易哈希
        .then(()=> alert('手续费用于您购买信息的正确保存，请务必等待系统处理完成，同意交易！'))
        //.catch(error => console.log(error))
}
/**
 * 树荫图片哈希上链
 * @param MarkHash{string}
 * @param id{number}
 * @param password{string}
 * @param privateKey{string}
 */
function addMarkedHashToBlockChain(id,MarkHash,password,privateKey){
    
    let inst;
    let currentAccount;
    let passwordIndexForBuyer = password.toString();
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => getCurrentAccount())
        .then(account => currentAccount = account)
        .then(() =>
            inst.addMarkedHashForProduct(id,MarkHash,passwordIndexForBuyer,{from: currentAccount, gas: 440000})//{from: currentAccount, gas: 440000}
        )
        .then(() => console.time('goumai1'))
        .then(() =>inst.fine(MarkHash))

        .then(() => {
            document.getElementById("myCanvas").style.display='inline-block';
        })
        .then(() =>{
            $("#msg-success-payment").show();
            $("#msg-success-payment").html("购买成功！请保存私钥"+privateKey);
            alert('请右键保存图片，并记得保留私钥！');
        })
        .then(() => inst.getProductIdWithBoughtId(currentAccount,1))
        //.then(address => console.log(address))
        .then(() => console.timeEnd('goumai1'))
        .catch(err => {console.log(err);alert("拒绝支付手续费！交易取消")})
}

//添加水印
function addMark(url,pwd) {
    var canvas = document.getElementById("myCanvas")
    var ctx = canvas.getContext("2d")
    let img = new Image();
    var textData, originalData;
    img.src = url;
    img.setAttribute("crossOrigin", "anonymous"); // 防止跨域引起的 Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
    //图片加载完成
    img.onload = function () {
        //设置画布宽高为图片宽高
        canvas.width = img.width;
        canvas.height = img.height;
        //设置水印字体
        ctx.font = '30px Microsoft Yahei';
        //由于图片宽度固定为800，我们需要在每一行添加三个水印,每隔100像素新增一行水印
        for (var i = 50; i < canvas.height; i += 100) {
            ctx.fillText(pwd, 50, i);
            //ctx.fillText(pwd, 300, i);
            //ctx.fillText(pwd, 600, i);
        }

        //此时画布上已经有了水印的信息，我们获取水印的各个像素的信息
        textData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        //将图片绘入画布
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        //获取图片各个像素点的信息，将originalData打印出来，会发现是一个非常大的数组（由于文字和图片在同一块画布，因此textData的长度等于originalData长度）
        //这个数组的长度等于图片width*height*4，即图片像素宽乘以高乘以4，0-3位是第一个点的RGBA值，第4-7位是第二个点的RGBA值，以此类推
        originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        //调用盲水印算法
        mergeData(ctx, textData, 'R', originalData)
    }

    function mergeData(ctx, textData, color, originalData) {
        var oData = originalData.data;
        var newData = textData.data
        var bit, offset;  // offset的作用是找到结合bit找到对应的A值，即透明度

        switch (color) {
            case 'R':
                bit = 0;
                offset = 3;
                break;
            case 'G':
                bit = 1;
                offset = 2;
                break;
            case 'B':
                bit = 2;
                offset = 1;
                break;
        }

        for (var i = 0; i < oData.length; i++) {
            //此处是为了筛选我们要修改的RGB中那一项，在此处，过滤出来的就是每个坐标点的R值
            if (i % 4 == bit) {

                //我们获取到R值的位置，那对应这个点的A值就是i+offset
                if (newData[i + offset] === 0 && (oData[i] % 2 === 1)) {
                    //此处先判断该坐标点的透明度，如果为0，说明这个点是没有水印的，将没有水印信息点的R值变为偶数，并且不能超过0-255的范围
                    if (oData[i] === 255) {
                        oData[i]--;
                    } else {
                        oData[i]++;
                    }
                } else if (newData[i + offset] !== 0 && (oData[i] % 2 === 0)) {
                    //透明度非0，该点有信息，若该点的R值是偶数，将其改为奇数
                    oData[i]++;
                }
            }
        }
        //至此，整个图片中所有包含水印信息的点的R值都是奇数，没有水印信息的点的R值都是偶数，再将图片绘入画布，即完成整个水印添加过程
        ctx.putImageData(originalData, 0, 0);
    }

    //return canvas;
}

function uploadImg(file){
    //const file = document.getElementById('report-image').files[0];
    //console.log(file);

    //将图片读作缓冲区
    // let newReader1 = new FileReader();
    // newReader1.readAsArrayBuffer(file);
    // newReader1.onload = function(result){
    //     const buffer = Buffer.from(newReader1.result);
    //     console.log(buffer);
    //     console.log(sha256(buffer).length);
    //     console.log("sha256:"+sha256(buffer).toString('utf-8',0));
    // }
    console.time('shangchuantupianjubao1');
    //将图片读作URl
    let newReader = new FileReader();
    newReader.readAsDataURL(file);
    //console.log(reader.result);
    newReader.onload = function(result){
        let showUploadFile = document.getElementById('showUploadFile');
        showUploadFile.src = result.target.result;

        const buffer = Buffer.from(result.target.result);
        // console.log(newReader.result);
        // console.log(sha256(buffer).length);
        // console.log("sha256:"+sha256(buffer).toString('utf-8',0));

        //选择显示不显示原图
        //showUploadFile.style.display ='inline-block'

        const promise = reportWithMarkedHash(sha256(buffer).toString('utf-8',0));
        promise.then(result => {
                if(result[0].search("0x0000000000000000000000000000000000000000") === 0)
                {
                    $("#Hash").show();
                    $("#Hash").html("上传的图片哈希不存在！已经为您展示识别的水印！");
                    getMark(showUploadFile.src);
                    document.getElementById("report-image").style.display='none';
                    document.getElementById('submitToReport').style.display='none';
                    document.getElementById("label-image").style.display='none';

                    document.getElementById("label-inputHash").style.display='inline-block';
                    document.getElementById('myCanvas1').style.display ='inline-block';
                    document.getElementById('inputHash').style.display ='inline-block';
                    // document.getElementById('inputLink').style.display ='inline-block';
                    document.getElementById('submitPasswordOfWatermark').style.display ='inline-block';

                    console.timeEnd('shangchuantupianjubao1');
                }else{
                    $("#Hash").show();
                    $("#Hash").html("举报成功！");

                    document.getElementById("label-image").style.display='none';
                    document.getElementById("report-image").style.display='none';
                    document.getElementById('submitToReport').style.display='none';

                    console.log("违约地址"+result[0]);
                    console.log("产品ID："+result[1]);

                    console.timeEnd('shangchuantupianjubao1');
                    //扣钱的操作
                    fineWithAddress(result[0],result[1]);
                }
            }
        );
    }
}
//获取输入的密码
function uploadPasswordOfWaterMark(password){
    //第一步在前端app.start函数里获取输入的密码
    //第二步修改合约，上传密码得到买家地址和产品ID
    let currentAccount,inst;
    let buyerPartInformation;
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => inst.getBuyerAddressByPassword(password))
        .then(result => buyerPartInformation = result)
        //.then(result => console.log("买家地址:"+result[0]+"产品ID"+result[1]))
        //.then(() => console.log(Number(result[2])))
        //.then(() => console.log("买家地址:"+buyerPartInformation[0]+"产品ID"+buyerPartInformation[1]))
        //.then(() => console.log(buyerPartInformation))
        // .then(() => console.log(Number(buyerPartInformation[2])))
        .then(()=> inst.getProductIdWithBoughtId(buyerPartInformation[0],password))
        //.then(id => console.log(Number(id)))
        .then(productId =>fineWithAddress(buyerPartInformation[0],productId))
}
//检举
function reportWithMarkedHash(MarkedHash){
    let inst,resultAddress;
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => inst.fine(MarkedHash))
        .then(address => resultAddress = address)
        .catch(error => console.log(error));
}

//获取水印
function getMark(ImgUrl){
    var canvas = document.getElementById("myCanvas1")
    var ctx = canvas.getContext("2d")
    var img = new Image()
    img.src = ImgUrl;
    img.setAttribute("crossOrigin", "anonymous"); // 防止跨域引起的 Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
    // 图片加载完成
    var originalData;
    img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // 将带有盲水印的图片绘入画布，获取到像素点的RGBA数组信息
        originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        processData(ctx,originalData);
    }

    function processData(ctx, originalData) {
        var data = originalData.data;
        for (var i = 0; i < data.length; i++) {
            //筛选每个像素点的R值
            if (i % 4 == 0) {
                if (data[i] % 2 == 0) {//如果R值为偶数，说明这个点是没有水印信息的，将其R值设为0
                    data[i] = 0;
                } else {//如果R值为奇数，说明这个点是有水印信息的，将其R值设为255
                    data[i] = 255;
                }
            } else if (i % 4 == 3) {//透明度不作处理
                continue;
            } else {
                // G、B值设置为0，不影响
                data[i] = 0;
            }
        }
        // 至此，带有水印信息的点都将展示为255,0,0   而没有水印信息的点将展示为0,0,0  将结果绘制到画布
        ctx.putImageData(originalData, 0, 0);
    }
}

/**
 * 惩罚泄密地址
 * @param address{string}
 * @param productId{string}
 */
function fineWithAddress(address,productId){
    console.log("泄露人地址"+address);
    console.log("产品ID"+productId);

    console.time('shangchuantupianjubao2');

    let inst,balance;
    //let productPrice;
    let sellerAddress;
    let currentAccount;
    let maxIndex;
    //let flag = Number();
    // refundTime = new Date().getTime();
    let refundNumber = Number();
    let currentProduct;
    return EDataStore.deployed()
        .then(i => inst = i)
        .then(() => getCurrentAccount())
        .then(account => currentAccount = account)
        .then(() => alert('将发起交易用于为您申请举报资格'))
        .then(() => console.timeEnd('shangchuantupianjubao2'))
        .then(() => inst.setCreditToNone(address,{from:currentAccount}))//将被举报人的信誉值置为0，这里举报人扣除手续费

        // .then(() => getCreditValue(address))
        // .then(creditValue => console.log(creditValue))

        .then(() => console.time('shangchuantupianjubao3'))

        .then(() => inst.getSellerAddress(productId))      //获取卖家地址
        .then(seller => sellerAddress = seller)

        .then(() => inst.getBoughtProductId(address))
        .then(index => maxIndex=index)

        .then(() => console.timeEnd('shangchuantupianjubao3'))
        
        .then(() => {
            for(let id=1; id<=maxIndex;id++){
                inst.getAllBoughtProductForBuyer(address,id)
                    .then(product => currentProduct = product)
                    .then(() => {
                                if(Number(currentProduct[4])==0)
                                {
                                    refundNumber += (Number(currentProduct[1]))*0.2;
                                    console.log('当前产品的flag='+currentProduct[4])
                                }
                        }
                    )
                    .then(() => {
                        if(Number(currentProduct[4]) == 0)
                            //console.log('要将flag设为1了哦')
                            inst.setProductFlag(id,address,{from:currentAccount});
                    })
                    .then(() => {
                        if(id == maxIndex)
                            if(refundNumber!=0)
                            {   alert('将发起交易为您发放奖励金');
                                inst.rewardForBlower(refundNumber,{from:currentAccount})
                            }else{
                                alert('感谢您的反馈，系统已对违规账户做出惩罚')
                            }
                    })
                 //0.将get合约balance添加进来
                 // 1.没买过东西的人进入押金索取页面会报问题，因为他没买过东西，所以他的所有初始化都是零，包括credit
                 // 2.信用值为0的账户不能再买东西了！，但是没买过东西的账户是可以的，要区分开！！
                 // 3.如果合约钱不够，申请回收押金，这样收不到押金，但是押金Flag已经置为已回收了

                 // 1.要对没有获取到奖励的举报人进行补偿！
                 // 2.卖家的补偿无法实现：考虑为卖家添加一个补偿领取页面，每次有人举报成功之后就将flag置为1.卖家去领取补偿时如果flag=1，则可以领取补偿。
                 // .then(() => {
                 //     if(id == maxIndex)
                 //         inst.rewardForBlower(refundNumber,{from:sellerAddress})}
                 // )
            }
        })


        //这里有逻辑问题：metamask发起交易要求当前页面的账户必须是交易的发起方，也就是违约方，但违约方是不可能同意交易的
        // .then(seller => ethereum.request({
        //     method:'eth_sendTransaction',
        //     params:[
        //         {
        //             from:address,
        //             to:seller,
        //             //这里value要转化为bignumber，再转化为16进制的字符串
        //             value:new BN(productPrice.toString(),10).toString(16),
        //         }
        //     ]
        // }))

        //metamask账户不支持getBalance函数
        //.then(() => balance = Number(web3.eth.getBalance(address)))


        //metamask账户不支持直接转账
        // .then(seller => web3.eth.sendTransaction({
        //     from: address,
        //     //向卖家赔钱
        //     to: seller,
        //     value : productPrice
        // }))
        // .then(hash => console.log("TransactionHash:"+hash))
        // // .then(() => inst.rewardForBlower(balance/2,id,{from:web3.eth.accounts[3]}))
        // .then(() => getCurrentAccount())
        // .then(account  => web3.eth.sendTransaction({
        //     from:address,
        //     to: account,
        //     value : productPrice
        // }))
        //.then(hash => console.log("TransactionHash:"+hash))

        .catch(error => console.log(error))

}






