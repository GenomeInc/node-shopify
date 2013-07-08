var prompt     = require('prompt');
var https      = require('https');
var shopifyObj = require('../lib/shopify');

var shopify = new shopifyObj({
  shop_name: 'typefoo',
  id: '639e5b59d03a4135d4f4cd176d8b0d0c',
  secret: '07e3e4d5711054ead625ac7356552660',
  redirect: 'http://localhost:9000/#/oauth'
});

var url = shopify.createURL();
console.log('\n\nGo to the following URL:\n\n' + url + '\n\n');

prompt.start();

prompt.get([
  {
    name: 'access_token',
    message: 'Enter access token (optional)'
  }
], function(err, result) {
  if(result.access_token) {
    shopify.setAccessToken(result.access_token);
    return sampleCalls();
  }
  
  doAuthorization();
});

function doAuthorization() {

  prompt.get([
    {
      name: 'code',
      message: 'Enter the code parameter from the returned URL',
      required: true
    }
  ], function(err, result) {
    console.log('\n\nConnecting to Shopify, retrieving Access Token...\n\n');
    shopify.getAccessToken(result.code, function(err, access_token) {
      if(err) {
        console.log(err);
      }
  
      console.log(access_token);
    });
  });

}

function sampleCalls() {
  // GET
  shopify.get('/admin/orders.json', function(err, resp) {
    console.log(resp);
  });
  
  // POST
  var postData = {
    product: {
      title: 'Burton Custom Freestlye 151',
      body_html: '<strong>Good snowboard!</strong>',
      vendor: 'Burton',
      product_type: 'Snowboard',
      variants: [
        {
          option1: 'First',
          price: '10.00',
          sku: 123
        },
        {
          option1: 'Second',
          price: '20.00',
          sku: '123'
        }
      ]
    }
  };
  shopify.post('/admin/products.json', postData, function(err, resp) {
    console.log(resp);
  });
}