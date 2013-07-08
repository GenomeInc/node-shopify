var shopifyObj = require('../lib/shopify');

var shopify = new shopifyObj({
  shop_name: 'typefoo',
  id: '639e5b59d03a4135d4f4cd176d8b0d0c',
  secret: '07e3e4d5711054ead625ac7356552660',
  redirect: 'http://localhost:9000/#/oauth'
});

var url = shopify.createURL();
console.log(url);