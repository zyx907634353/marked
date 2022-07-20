# 图片产品交易平台

## 介绍

基于以太坊的图片产品交易平台，部署区块链为Rinkeby测试链

## 相关技术

前端搭建：HTML + CSS + JavaScript

合约测试部署： Solidity、Truffle、Remix

项目打包：webpack

## 使用指南

### 1.前置条件

1. 安装[IPFS](https://ipfs.io/):https://docs.ipfs.io/install/command-line/#official-distributions
2. 安装MetaMask浏览器插件

### 2.项目开启步骤：

1. 初始化环境
  ` npm install `
2. IPFS启动监听
  `ipfs daemon`
3. 合约编译
  `truffle compile`
4. 合约部署
  `truffle migrate`
  `truffle migrate--reset`
  
  **注意**：合约部署需要消耗大量gas，请在Remix或本地测试链上(推荐：[Ganache](https://trufflesuite.com/ganache/))完成测试后再执行Rinkeby测试链上合约的部署
  
5. 项目启动
  `npm run serve`
