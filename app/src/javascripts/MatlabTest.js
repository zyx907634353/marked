//function mark(){
    //let path =  '../../../node_modules/java/index1.js';
    let java = require("java"); //����nodejs��javaģ��
    //let java = require(`${path}`);
    //Promise.resolve(java.classpath.push("../../../../main/test")); //�����д��jar��
    java.classpath.push("./watermarkJava.jar");
    let TestForWaterMark = java.import('com.zyx.WaterMarkUtilTest'); //package.class
    //let TestForWaterMark = java.import('WaterMarkUtilTest');
//let TestForWaterMark = new TestForWaterMark();

    TestForWaterMark.MarkTest();  //��������


   // module.exports =  mark;
