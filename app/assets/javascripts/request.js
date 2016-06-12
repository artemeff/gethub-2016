var requestHandleError = function(msg) {
  console.error(msg);
}

var postRequest = function(url, body, onSuccess) {
  var req = new XMLHttpRequest();

  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json')

  req.onreadystatechange = function() {
    if (req.readyState != 4) {
      return;
    }

    clearTimeout(timeout);

    if (req.status == 200) {
      onSuccess(JSON.parse(req.response));
    } else {
      requestHandleError(req.statusText);
    }
  }

  req.send(JSON.stringify(body));

  var timeout = setTimeout(function() {
    req.abort();
    requestHandleError('Time over');
  }, 10000);
}

var getRequest = function(url, onSuccess) {
  var req = new XMLHttpRequest();

  req.open('GET', url, true);
  req.setRequestHeader('Content-Type', 'application/json');

  req.onreadystatechange = function() {
    if (req.readyState != 4) {
      return;
    }

    clearTimeout(timeout);

    if (req.status == 200) {
      onSuccess(req.response);
    } else {
      requestHandleError(req.statusText);
    }
  }

  req.send(null);

  var timeout = setTimeout(function() {
    req.abort();
    requestHandleError('Time over');
  }, 10000);
}
