function ShopifyConnect(params) {
    var utils         = require('./utils'),
    querystring       = require('querystring');
    https             = require('https'),
    $scope            = this;

  var defaults = {
    shop_name: '',
    scope: 'read_products,read_content,read_themes,read_customers,read_orders,read_script_tags,read_fulfillments,read_shipping,write_products,write_content,write_themes,write_customers,write_orders,write_script_tags,write_fulfillments,write_shipping',
    id: '',
    secret: '',
    redirect: '',
    access_token: null
  };
  
  $scope.config = utils.extend(defaults, params);
  
  $scope.setAccessToken = function(access_token) {
    $scope.config.access_token = access_token;
    return $scope;
  };
  
  $scope.createURL = function() {
    return 'https://' + $scope.config.shop_name + '.myshopify.com/admin/oauth/authorize?'
      + 'client_id=' + $scope.config.id 
      + '&scope=' + $scope.config.scope 
      + '&redirect_url=' + $scope.config.redirect;
  };
  
  $scope.getAccessToken = function(code, callback) {
    if(typeof code === 'undefined') {
      callback({
        error: true,
        message: 'No code parameter given'
      }, null);
    }
    
    var q = querystring.stringify({
      client_id: $scope.config.id,
      client_secret: $scope.config.secret,
      code: code
    });
    
    var opts = {
      host: $scope.config.shop_name + '.myshopify.com',
      path: '/admin/oauth/access_token',
      port: 443,
      method: 'POST',
      headers: {
        'Content-Length': + q.length
      }
    };
    
    var shReq = https.request(opts, function(res) {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
        var j = JSON.parse(data);
        if(j.error) {
          return callback(j, null);
        }
        $scope.config.access_token = j.access_token;
        callback(null, data);
      });
    });
    
    shReq.on('error', function(e) {
      callback(e, null);
    });
    
    shReq.write(q);
    shReq.end();
  };
  
  $scope.request = function(access_token, path, method, data, callback) {
    var used_args = arguments;
    if(access_token === null) {
      return callback({
        error: true,
        message: 'No access token set.'
      }, null);
    }
  
    var q = JSON.stringify(data);
    
    method = method.toLowerCase();
    
    var opts = {
      host: $scope.config.shop_name + '.myshopify.com',
      path: path,
      method: method,
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Vern.io (http://www.typefoo.com)',
        'X-Shopify-Access-Token': access_token
      }
    };
    
    if(method === 'post' || method === 'put' || method === 'delete') {
      opts.headers['Content-Length'] = q.length;
    }
    
    var req = https.request(opts, function(sock) {
      var fullData = '';
      sock.setEncoding('utf-8');
      sock.on('data', function(chunk) {
        fullData += chunk;
      });
      
      sock.on('end', function() {
        try {
          var j = JSON.parse(fullData);
          if(j.errors || j.error) {
            j.arguments = used_args;
            return callback(j, null);
          }
          callback(null, j);
        } catch(e) {
          callback({
            error: true,
            message: 'Error on: [' + method + '] ' + path,
            details: fullData,
            arguments: used_args
          }, null);
        }
      });
    });
    
    req.on('error', function(e) {
      callback(e, null);
    });
    
    if(method === 'post' || method === 'put' || method === 'delete') {
      req.write(q);
    }
    
    req.end();
  };
  
  $scope.get = function(path, callback) {
    $scope.request($scope.config.access_token, path, 'get', null, callback);
  };
  
  $scope.post = function(path, data, callback) {
    $scope.request($scope.config.access_token, path, 'post', data, callback);
  };
  
  $scope.put = function(path, data, callback) {
    $scope.request($scope.config.access_token, path, 'put', data, callback);
  };
  
  $scope.delete = function(path, callback) {
    $scope.request($scope.config.access_token, path, 'delete', null, callback);
  };
  
  return $scope;
}

module.exports = ShopifyConnect;