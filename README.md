# Shopify Node

    npm install shopify-node

Now you can run the test by:

    node test/test

For setting up:

    var shopifyObj = require('shopify-node');
    
    var shopify = new shopifyObj({
    	shop_name: 'typefoo',
    	id: '639e5b59d03a4135d4f4cd176d8b0d0c',
    	secret: '07e3e4d5711054ead625ac7356552660',
    	redirect: 'http://localhost:9000/#/oauth'
    });
    
    var url = shopify.createURL();

After you have obtained the code (either via your redirect or elsewhere):

    shopify.getAccessToken(result.code, function(err, access_token) {
    		console.log(err);
    		console.log(JSON.parse(access_token));
    	});
    });

Built in Carolina & Ohio. www.typefoo.com