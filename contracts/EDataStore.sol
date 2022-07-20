pragma solidity ^0.4.13;

contract EDataStore {

  struct Product {
    uint id;                        //0
    string name;                    //1
    string imageLink;               //2

    //string descLink;                //3

    string description;
    uint price;                     //4
    string passwordBySeller;        //5
    string passwordByBuyer;         //6
  }

  struct Buyer{

    uint boughtProductId;

    //boughtProductId => productId
    mapping(uint => uint) boughtIdToProductId;
    //boughtProductId => flag
    mapping(uint => uint) productFlag;
    //
    address buyerAddress;
    //
    uint credit;
    //productId => productID
    mapping(uint => uint) lastDateForProduct;
    //boughtProductId => passwordFinal
    mapping(uint =>string) boughtIdToPasswordFinal;
    //passwordFinal => productId
    mapping(string => uint) passwordFinalToProductId;
  }


  mapping (address => mapping(uint => Product)) stores;
  mapping (uint => address) productIdInStore;


  //
  mapping (uint => mapping(string => address)) buyerForProduct;
  //
  mapping (string => uint) getProductIdWithMarkedHash;
  //
  mapping (address => Buyer) addressForBuyer;

  mapping (string => Buyer)  pwdToBuyer;

  uint public productIndex;
  address ownerAddress;


  constructor() public {
    ownerAddress = msg.sender;
    productIndex = 0;
  }

  //function getProduct(uint _productId) view public returns (uint, string, string,string ,uint) {
  //  Product memory product = stores[productIdInStore[_productId]][_productId];
  //  return (product.id, product.name, product.imageLink, product.descLink, product.price);
  //}


  //�����Ʒ��������Ϣ���Ӵ洢
  function addMarkedHashForProduct(uint _productId,string _markedHash,string passwordByBuyer) public returns(address,string,uint){
      //������ˮӡ���ͼƬ�Ĺ�ϣֵ���Ӧ�Ĳ�Ʒ��Ž��д洢
      getProductIdWithMarkedHash[_markedHash] = _productId;
      //��ǰ�˴�����ˮӡ��ϣ�Ͳ�Ʒ�����Ϊ�� ��������ҵ�ַ ���д洢
      buyerForProduct[_productId][_markedHash] = msg.sender;
      Product memory product = stores[productIdInStore[_productId]][_productId];



      Buyer storage buyer = addressForBuyer[msg.sender];
      if(buyer.boughtProductId == 0)
        buyer.credit =100;                                              //���ι�����Ʒ������ֵ��Ϊ100
      buyer.boughtProductId++;                                          //������Ʒ����++
      buyer.buyerAddress = msg.sender;                                  //�洢�˻���ַ
      buyer.boughtIdToProductId[buyer.boughtProductId] = _productId;    //boughtId => productId
      buyer.boughtIdToPasswordFinal[buyer.boughtProductId] = strConcat(product.passwordBySeller,passwordByBuyer);
      buyer.lastDateForProduct[_productId] = now + 3 seconds;             //����ʱ����Ϊ����ʱ���������

      buyer.passwordFinalToProductId[strConcat(product.passwordBySeller,passwordByBuyer)] = _productId;
      pwdToBuyer[strConcat(product.passwordBySeller,passwordByBuyer)] = buyer;
      return (msg.sender,_markedHash,_productId);
  }
  //�ٱ�����
  function fine(string _markedHash) view public returns(address,uint){
    uint finedId = getProductIdWithMarkedHash[_markedHash];
    address finedAddress = buyerForProduct[finedId][_markedHash];
    //finedAddress.transfer(msg.value);
    return (finedAddress,finedId);
  }
  //��ȡ��Ʒ��Ϣ
  function getProduct(uint _productId) view public returns (uint,string,string,string,uint) {
    Product memory product = stores[productIdInStore[_productId]][_productId];
    return (product.id, product.name, product.imageLink, product.description,product.price );
  }
  //��ȡ��Ʒ�۸�
  function getPrice(uint _productId) view public returns(uint){
    Product memory product = stores[productIdInStore[_productId]][_productId];
    return product.price;
  }
  //��ȡˮӡ�����ͼƬ����
  function getPasswordAndImage(uint _productId,string _password) public view returns(string,string) {
      Product memory product = stores[productIdInStore[_productId]][_productId];
      return(strConcat(product.passwordBySeller,_password),product.imageLink);
  }
  //�����Ʒ��Ϣ
  function addProductToStore(string _name, string _imageLink,string _description, uint _price,string _passwordBySeller) public {

    productIndex += 1;
    Product memory product = Product(productIndex, _name, _imageLink, _description, _price,_passwordBySeller,"");

    stores[msg.sender][productIndex] = product;
    productIdInStore[productIndex] = msg.sender;
  }
  //�ַ���ƴ�Ӻ���
  function strConcat(string _a, string _b) pure internal returns(string){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    string memory ret = new string(_ba.length + _bb.length);
    bytes memory bret = bytes(ret);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++)bret[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
    return string(ret);
  }

  function getBalance() public view returns(uint){
    return msg.sender.balance;
  }

  //��ȡ��Լ���
  function getContractBalance() public view returns(uint){
    return this.balance;
  }
  //��ȡ����˻�
  function getSellerAddress(uint _productId) public view returns(address){
    return productIdInStore[_productId];
  }
  //��ȡ�˻��ѹ���Ĳ�Ʒ������
  function getBoughtProductId(address _buyerAddress) public view returns(uint){
      Buyer storage buyer = addressForBuyer[_buyerAddress];
      return buyer.boughtProductId;
  }
//��ȡ����ҳҪչʾ����Ϣ
function getAllBoughtProductForBuyer(address _buyerAddress,uint _boughtProductId) public view returns(uint,uint,string,uint,uint){
  Buyer storage buyer = addressForBuyer[_buyerAddress];
  uint _productId = buyer.boughtIdToProductId[_boughtProductId];
  Product memory product = stores[productIdInStore[_productId]][_productId];

  //���ﷵ�ص���ԭ��Ӧ����js������������
  uint fundedPrice = product.price;

  return (_boughtProductId,fundedPrice,product.name,buyer.lastDateForProduct[_productId],buyer.productFlag[_boughtProductId]);
}
    //��ȡ����ֵ
    function getBuyerCredit(address currentAddress) public view returns(uint){
        Buyer memory buyer = addressForBuyer[currentAddress];
        if(buyer.credit == 100) return 100;
          else return 0;
    }
    //���ָ���Ĳ�Ʒ�Ƿ�ɻ���
    function checkFundedProduct(address currentAccount,uint _boughtProductId) public view returns(uint){
         Buyer storage buyer = addressForBuyer[currentAccount];
         uint _productId = buyer.boughtIdToProductId[_boughtProductId];
         //Product memory product = stores[productIdInStore[_productId]][_productId];

         if(now >= buyer.lastDateForProduct[_productId])
           return 1;
         else return 0;
   }

   //�Ӻ�Լת��Ѻ��
   function refundForBuyer(uint totalFund) public payable{
        msg.sender.transfer(totalFund);
   }
   //��ΥԼ�˻�������ֵ��Ϊ��
   function setCreditToNone(address finedAddress) public payable{
      Buyer storage buyer = addressForBuyer[finedAddress];
      buyer.credit = 0;
   }
   //��������
   function rewardForBlower(uint _amountOfFine) public payable{
      msg.sender.transfer(_amountOfFine);
   }
   //����Ѻ����յı�־
   function setProductFlag(uint _boughtProductId,address currentAccount) public{
         Buyer storage buyer = addressForBuyer[currentAccount];
         buyer.productFlag[_boughtProductId] = 1;
         //uint _productId = buyer.boughtIdToProductId[_boughtProductId];
   }
   //���productId�Ƿ��boughtId����
   function getProductIdWithBoughtId(address buyerAddress,string pwd) public view returns(uint){
         Buyer storage buyer = addressForBuyer[buyerAddress];
         //buyer.productFlag[_boughtProductId] = 1;
         uint productId = buyer.passwordFinalToProductId[pwd];
         return productId;
   }
   //���������ȡ��ҵ�ַ�Ͳ�ƷId
   function getBuyerAddressByPassword(string _password) public view returns(address,uint,uint){
       Buyer storage buyer = pwdToBuyer[_password];
       uint productId = buyer.passwordFinalToProductId[_password];
       return(buyer.buyerAddress,buyer.boughtProductId,productId);
   }
   function() public payable{}
}
