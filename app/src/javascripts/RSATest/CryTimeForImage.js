//import $ from "jquery";

const NodeRSA = require('node-rsa');
const crypto = require('crypto');
const key = new NodeRSA({b:512});

$("#imageForm").submit(event => {
    console.log("Ω¯»Î¡Àjs")
    event.preventDefault();
    ImageToCiphertext();
});

key.generateKeyPair(1024,65537);

var publicDer = key.exportKey("pkcs8-public-pem");
var privateDer = key.exportKey("pkcs1-private-pem");

function Encrypt(publicKey,data){
    return crypto.publicEncrypt(publicKey,Buffer.from(data));
}
function Decrypt(privateKey,ciphertext){
    return crypto.privateDecrypt(privateKey,ciphertext);
}

function ImageToCiphertext(){
    let file = document.getElementById("imageInput")[0];
    let newReader = new FileReader();
    newReader.readAsDataURL(file);

    newReader.onload = function(result){
        //const buffer = Buffer.from(result.target.result);
        console.log(newReader.result);
    }
    //console.log(img);
}
function CiphertextToImage(){

}
// crypto.publicEncrypt(key,dataBuffer);


