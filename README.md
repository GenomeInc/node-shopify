# Shopify Node

    npm install shopify-node

You can run the test by cloning this repo and running:

    npm install
    node test/test

For setting up:

    var shopifyObj = require('shopify-node');
    
    var shopify = new shopifyObj({
    	shop_name: 'typefoo',
    	id: '639e5b59d03a4135d4f4cd176d8b0d0c',
    	secret: '07e3e4d5711054ead625ac7356552660',
    	redirect: 'http://localhost:9000/#/oauth'
    	// scope: 'write_products', as an example. The default scope has access to all.
    	// For more on scopes: http://docs.shopify.com/api/tutorials/oauth
    });
    
    var url = shopify.createURL();

After you have obtained the "code" (either via your redirect or elsewhere):

    var code = ''; // put the short-time auth code in here.

    shopify.getAccessToken(code, function(err, access_token) {
  		console.log(JSON.parse(err));
  		console.log(JSON.parse(access_token));
  	});

Built in Carolina & Ohio. www.typefoo.com