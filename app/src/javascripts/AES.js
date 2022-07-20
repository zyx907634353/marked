
const utils = require('./CryUtils');
//const keys = require('./keys');
// const plainText = ''
//
// const crypted = utils.encrypt(plainText, utils.pubKey); // 加密
// const decrypted = utils.decrypt(crypted, utils.privKey); // 解密
//
// // var publicDer = key.exportKey('pkcs1-public-pem');
// // var privateDer = key.exportKey('pkcs1-private-pem');
// //
// // console.log(publicDer.length);
// // console.log(privateDer.length);
//
// // console.log(utils.pubKey.length);
// //
// // console.log(utils.privKey.length);
// // console.log(utils.pubKey);
// //
// // console.log(utils.privKey);
//
// console.log(decrypted.toString('utf-8')); // 你好，我是程序猿小卡

const publicKey=utils.pubKey;
const privateKey=utils.privKey;

console.time(1);
var wholeURL= "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADBAMkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3wAsTn8f8KfTU+6D6806gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBqfcX6CnU1PuL9BTqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAGp9xfoKdTU+4v0FOoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAan3F+gp1NT7i/QU6gAooooAKKKwPEHiW30iEqCGmI4UVMpKKuzSlSnVkoQV2bFxdwWqF5pFUD1Nc5feOdPtWKx5kYegrzzUtbvNTmLSyttPRQajs9Ivb4jyIGbPfFcU8VJu0EfQUcnpU481eR10nxFfPyWwx9aZ/wsSf/n3X86zYvA+qSAFgF+oqX/hAtS/vL+VTzYhmvsssWl195d/4WJP/AM+6/nR/wsSf/n3X86pf8IFqX95fyo/4QLUv7y/lRzYgPZ5Z5F3/AIWJP/z7r+dH/CxJ/wDn3X86pf8ACBal/eX8qP8AhAtS/vL+VHNiA9nlnkXf+FiT/wDPuv50f8LEn/591/OqX/CBal/eX8qP+EC1L+8v5Uc2ID2eWeRd/wCFiT/8+6/nSj4iTZ5tx+dUf+EC1L+8v5UjeA9TA4Kn8KObEB7PLPI3bX4hW7sBPEU9xk10thrthqCjyZlyexOK8su/C+qWYJeBmUdxWYktxZy5QtG4/ChYmpB++iZ5VhayvRl+p7wDnpRXnvhzxo25ba/OQeA9d/HIkqB0YFTyCK7adSNRXR4OJwtTDy5ZofRRRWhzBRRRQA1PuL9BTqan3F+gp1ABRRRQBm65fyafpsksUZdwOMCvHLu5uL+7Z5SzSMehr3N40kUq6hgexFYj+FNOa/W7EeGBzjtXNXoyqNWZ62XY6lhk+aOvc5nwz4NEqrdXw4PIQ13sFpBbRhIo1UD0FSqoRQqjAFLWtOlGCsjjxOLqYiXNJ6dgooorQ5QooooAKKKKACiiigAooooAayKwwwBFc/rnhW01OJmjQRzdiBXRUVMoqSszWlWnSlzQdmeG6jp1xpd20MykEHg123gfWbmX/RJVZkH3W9K6fVtBtNX2mdeVPUVastNtdPiCQRKuO+Oa5aeHlCd09D1sTmdOvh+SUfeLdFFFdh4gUUUUANT7i/QU6mp9xfoKdQAUUUUAFFFFABRXNeMdXn0uwUwHDucZrz7/AISjVf8An4Nc9TERhLlZ6WFyuriKftItJHs1FcH4M8QXd9eNb3LbhjINd5WtOopx5kcuJw0sPU9nIKKKDwDVnOFFea+KPE19DqskED7EQ4rEXxTqoYHzzXLLFRi7WPXpZNWqQU7rU9lorG8NajJqWkxzS/f6GtmumMlJXR5dSm6c3CW6CiiimQFFFFABRRRQAUUUUAFFFFADU+4v0FOpqfcX6CnUAFFFFABRRRQBxPxD/wCPKH/eNeb16V8QY3ewiZVJAY5xXmuD6GvLxX8Rn2GUP/ZV8zrPAX/IaP8Aun+VepV5h4Bic6sX2naAea9Prrwv8M8XOX/tPyCkP3T9KWkPQ10nknjnir/kP3H+9WLW74sikTXpyykAtxWFtJPQ141T42feYV/uIeiPWfBH/IBT610tc54LjePQo96kZ55ro69Wj8CPjcb/ALxP1CiiitDlCiiigAooooAKKKKACiiigBqfcX6CnU1PuL9BTqACiiigAoophmjVwhcBj0FAWGXFtDdRmOZA6nsaz/8AhG9L/wCfZfyFa1FS4p7o0jVnBWi7FW0061sQfs8Spn0FWqKKaSWxEpOTuwooopiKV3pNlevvnhVm9cVXHhzSwQRbLx7CtWipcIvoaqtUSspMZFEkMYSNQqjoBT6KKoybuFFFFABRRRQAUUx5UjALsFz604EEZFAWFooooAKKKKAGp9xfoKdTU+4v0FOoAKKKKAMzXbq6tNNkltU3OBXlL69f/wBoi5klbep+7nivZ3UOhVhkHqK898U+EXR2u7JMqeWQVyYmE370T2spr0It06i1fU6bQPEdvq1soLhZgOQa3q8IhnuLGfdGzRyKa63TfH1xAoS7TzAP4h1qaWKVrTNMXk80+ahqux6VRXKRePNNdfmyp9zUn/CcaV/z0/Wuj21PueY8DiV9hnT0VzH/AAnGlf8APT9aP+E40r/np+tP21PuL6jiP5GdPRXMf8JxpX/PT9aP+E40r/np+tHtqfcPqOI/kZ09Fcx/wnGlf89P1o/4TjSv+en60e2p9w+o4j+RnT0VzH/CcaV/z0/WkbxzpYHDk/jR7an3D6jiP5GdRUF1eQ2cLSzOFUDua4y9+IUIUi1hJb1Ncfqmv3uqufOkOz+6DxWNTFQivd1O3DZRWqO9TRGl4l8Ty6jdbLdykSHjBxmt7wXrGpXj+TKC8Kj7xrktE0C61e4UKhEWeWIr1jStKg0q0WGJQMDk+tZUFUnPnbOzMZ4ehR9hFXf5F+iiiu8+cCiiigBqfcX6CnU1PuL9BTqACiiigApGUMMEZBpaKAOc1jwhZall0Xy5PUVxd94I1G2YmICRfrXq9FYTw8J6noYfM8RRVk7rzPEn0LUozg2r/gppn9j6h/z6yf8AfJr24op6qKTyo/7g/Ksfqa7ncs9n/KjxL+x9Q/59ZP8Avk0f2PqH/PrJ/wB8mvbfKj/uD8qPKj/uD8qPqa7h/bs/5DxL+x9Q/wCfWT/vk0f2PqH/AD6yf98mvbfKj/uD8qPKj/uD8qPqa7h/bs/5DxL+x9Q/59ZP++TR/Y+of8+sn/fJr23yo/7g/Kjyo/7g/Kj6mu4f27P+Q8S/sfUP+fWT/vk0o0bUCcC1k/75Ne2eVH/cH5UvloP4R+VH1Ndw/t2f8h49a+FNUuWAEG0ercV1GleAUjZZLx9x/uiu6AA6ClrSGFhHfU5q2b4iorLQgtbOCziEcMYVR6Cp6KK6UrHlttu7CiiigQUUUUANT7i/QU6mp9xfoKdQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA1PuL9BTqan3F+lOoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAan3fxNOoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z";
var encryptWholeURL = wholeURL;
var encryptedURL = [];
//加密
for( var i=0 ;i<10 ;i++){
    //根据长度划分为10块
    var encryptStart = i*(wholeURL.length)/10;
    //每块取前22位进行加密
    var encryptPart = wholeURL.slice(encryptStart,encryptStart+22);
    var encryptDataPart = utils.encrypt(encryptPart, publicKey);
    //将原图片URL的Base64编码的进行替换
    encryptWholeURL = encryptWholeURL.replace(encryptPart,encryptDataPart.toString('utf-8'));

    //加密完成
    //console.log("密文"+i+" "+encryptDataPart);

    //密文存储入数组，后续解密使用
    encryptedURL.push(encryptDataPart);

}
 console.timeEnd(1);
 console.log(encryptWholeURL);
 console.log('---------------------------------------------------------------------------------------------------------------------------------');

 //解密
for(var j=0 ; j<10 ;j++){
    console.log("ciphertext"+encryptWholeURL[j]);
    var decryptDataPart = utils.decrypt(encryptedURL[j], privateKey);
    encryptWholeURL = encryptWholeURL.replace(encryptWholeURL[j],decryptDataPart.toString("utf-8"));
}
console.log(encryptWholeURL);
