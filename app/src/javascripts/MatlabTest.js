//function mark(){
    //let path =  '../../../node_modules/java/index1.js';
    let java = require("java"); //引入nodejs的java模块
    //let java = require(`${path}`);
    //Promise.resolve(java.classpath.push("../../../../main/test")); //导入编写的jar包
    java.classpath.push("./watermarkJava.jar");
    let TestForWaterMark = java.import('com.zyx.WaterMarkUtilTest'); //package.class
    //let TestForWaterMark = java.import('WaterMarkUtilTest');
//let TestForWaterMark = new TestForWaterMark();

    TestForWaterMark.MarkTest();  //方法调用


   // module.exports =  mark;
