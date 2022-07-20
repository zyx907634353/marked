
// const ad = "MIICXQIBAAKBgQDFWnl8fChyKI/Tgo1ILB+IlGr8ZECKnnO8XRDwttBbf5EmG0qV8gs0aGkh649rb75I+tMu2JSNuVj61CncL/7Ct2kAZ6CZZo1vYgtzhlFnxd4V7Ra+aIwLZaXT/h3eE+/cFsL4VAJI5wXh4Mq4Vtu7uEjeogAOgXACaIqiFyrk3wIDAQABAoGBAKdrunYlqfY2fNUVAqAAdnvaVOxqa+psw4g/d3iNzjJhBRTLwDl2TZUXImEZQeEFueqVhoROTa/xVg/r3tshiD/QC71EfmPVBjBQJJIvJUbjtZJ/O+L2WxqzSvqewzYaTm6Te3kZeG/cULNMIL+xU7XsUmslbGPAurYmHA1jNKFpAkEA48aUogSv8VFnR2QuYmilz20LkCzffK2aq2+9iSz1ZjCvo+iuFt71Y3+etWomzcZCuJ5sn0w7lcSxnqyzCFDspQJBAN3O2VdQF3gua0Q5VHmK9AvsoXLmCfRa1RiKuFOtrtC609RfX4DCFxDxH09UVu/8Hmdau8t6OFExcBriIYJQwDMCQQCZLjFDDHfuiFo2js8K62mnJ6SBH0xlIrND2+/RUuTuBov4ZUC+rM7GTUtEodDazhyM4C4Yq0HfJNp25Zm5XALpAkBGatLpO04YI3R+dkzxQUH1PyyKU6m5X9TjM7cNKcikD4wMkjK5p+S2xjYQc1AeZEYqvc187dJPRIi4oC3PN1+tAkBuW51/5vBj+zmd73mVcTt28OmSKOX6kU29F0lvEh8IoHiLOo285vG5ZtmXiY58tAiPVQXa7eU8hPQHTHWa9qp6";
// console.log(ad.length);


// const ad = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFWnl8fChyKI/Tgo1ILB+IlGr8ZECKnnO8XRDwttBbf5EmG0qV8gs0aGkh649rb75I+tMu2JSNuVj61CncL/7Ct2kAZ6CZZo1vYgtzhlFnxd4V7Ra+aIwLZaXT/h3eE+/cFsL4VAJI5wXh4Mq4Vtu7uEjeogAOgXACaIqiFyrk3wIDAQAB"
//  console.log(ad.length);
// const crypto = require('crypto');





var timeCount = [];
var timeSum = 0;
for(var i = 0 ;i < 100 ; i++){

    const NodeRSA = require('node-rsa');
    const key = new NodeRSA({b:512});

    // 直接输出式的计时方式(*start*)
    //console.time(1);

    //开始时间
    var timeStart = Date.now();

    key.generateKeyPair(1024,65537);

    var publicDer = key.exportKey("pkcs8-public-pem");
    var privateDer  = key.exportKey("pkcs1-private-pem");

// //获取公钥及公钥长度
//     console.log(publicDer);
//     console.log(publicDer.length);
//
// //获取私钥及私钥长度
//     console.log(privateDer);
//     console.log(privateDer.length);

    //结束时间
    var timeEnd = Date.now();

    var timeDiff = timeEnd - timeStart;

    //console.log(i+" "+timeDiff);

    timeCount.push(timeDiff);
    timeSum += timeDiff;

    // 直接输出式的计时方式(*end*)
    // console.timeEnd(1);
}

console.log(timeSum/100);


// const keySize = key.getKeySize();
// console.log(keySize);
