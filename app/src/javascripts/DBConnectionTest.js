var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// function addPasswordToDB(address,crypoPassword){
//     let id ;
//     MongoClient.connect(url, function(err, db) {
//         if (err) throw err;
//         var dbo = db.db("crypDB1");
//         var myobj = { address: address, crypoPassword: crypoPassword };
//         // var whereStr = {"address": ""};
//
//         dbo.collection("site").insertOne(myobj, function(err, result) {
//             if (err) throw err;
//             // console.log(result.insertedId.toString());
//             id = result.insertedId.toString();
//             //console.log(id);
//             db.close();
//             return id;
//         });
//     });
// }

