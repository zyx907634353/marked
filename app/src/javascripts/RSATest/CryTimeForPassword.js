
const NodeRSA = require('node-rsa');
const crypto = require('crypto');

const key = new NodeRSA({b:512});
key.generateKeyPair(1024,65537);
//公钥
var publicDer = key.exportKey("pkcs8-public-pem");
//私钥
var privateDer = key.exportKey("pkcs1-private-pem");


function Encrypt(publicKey,data){
    return crypto.publicEncrypt(publicKey,Buffer.from(data));
}
function Decrypt(privateKey,ciphertext){
    return crypto.privateDecrypt(privateKey,ciphertext);
}
var encryptTimeCount = [];
var decryptTimeCount = [];
var EncryptTimeSum = 0;
var DecryptTimeSum = 0;
function runEncrypt(len){
    // const randomString = crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
    //生成随机密码
    var rString = randomString(len, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/*&');

    //开始时间
    var timeStart = Date.now();
    const ciphertext = Encrypt(publicDer,rString);


    //结束时间
    var timeEnd = Date.now();

    var timeForEncrypt =  timeEnd - timeStart;

    const timeForDecrypt = runDecrypt(privateDer,ciphertext);
    return [timeForEncrypt,timeForDecrypt];
    //if(len === 40) console.log(plaintext);

    //timeSum += timeDiff;
    // console.log(ciphertext);
}
function runDecrypt(privateDer,ciphertext){
    //开始时间
    var timeStart = Date.now();

    const plaintext = Decrypt(privateDer,ciphertext);

    //结束时间
    var timeEnd = Date.now();

    return timeEnd - timeStart;
}
//随机字符
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
//执行
function run(){
    for(var i=0 ;i<40 ;i++){
        for(var j=0; j<10; j++){
            var Time = runEncrypt(i+1);
            EncryptTimeSum+= Time[0];
            DecryptTimeSum+= Time[1];
        }
        // encryptTimeCount.push(accDiv(EncryptTimeSum,10));
        // decryptTimeCount.push(accDiv(DecryptTimeSum,10));
        encryptTimeCount.push(EncryptTimeSum/10);
        decryptTimeCount.push(DecryptTimeSum/10);
        EncryptTimeSum=0;
        DecryptTimeSum=0;
    }
    console.log("EN-timeConsume:"+encryptTimeCount.toString());
    console.log("DE-timeConsume:"+decryptTimeCount.toString());
}

function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    with(Math){
        r1=Number(arg1.toString().replace(".",""))
        r2=Number(arg2.toString().replace(".",""))
        return (r1/r2)*pow(10,t2-t1);
    }
}

run();
