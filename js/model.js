/**
 * Model class. Knows everything about API endpoint and data structure.
 *
 * @constructor
 */
function Model() {

    /**
     * Get orders, specific order by id or products of specififc order.
     *
     * @param {Number} id the order id.
     * 
     * @param {Boolean} isProducts if we want get products.
     *
     * @returns {Promise} the promise object will be resolved once XHR gets loaded/failed
     *
     * @public
     */
    this.getData = function(id, isProducts) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();

            if (id && isProducts) {
                req.open("GET", "http://localhost:3000/api/Orders/" + id + "/products");
            } else {
                if (id) {
                    req.open("GET", "http://localhost:3000/api/Orders/" + id);
                } else {
                    req.open("GET", "http://localhost:3000/api/Orders");
                }
            }

            req.addEventListener("load", function() {
                if (req.status < 400) {
                    resolve(JSON.parse(req.responseText));
                } else {
                    reject(new Error("Request failed: " + req.statusText));
                }
            });

            req.addEventListener("error", function() {
                reject(new Error("Network error "));
            });

            req.send(null);
        });
    };

    /**
     * Post new order to server.
     *
     * @param {String[]} values array of received from form values.
     *
     * @returns {Promise} the promise object will be resolved once XHR posts loaded/failed
     *
     * @public
     */
    this.postOrder = function(values) {

        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();

            req.open("POST", "http://localhost:3000/api/Orders");

            req.setRequestHeader("Content-Type", "application/json");

            var newOrder = {
                "summary": {
                    "createdAt": values[11],
                    "customer": values[0],
                    "status": "accepted",
                    "shippedAt": values[11],
                    "totalPrice": 0,
                    "currency": "EUR"
                },
                "shipTo": {
                    "name": values[1],
                    "address": values[2],
                    "ZIP": values[3],
                    "region": values[4],
                    "country": values[5]
                },
                "customerInfo": {
                    "firstName": values[6],
                    "lastName": values[7],
                    "address": values[8],
                    "phone": values[9],
                    "email": values[10]
                }
            };
            req.addEventListener("load", function() {
                if (req.status < 400) {
                    alert("Order was successfully added");
                    resolve();
                } else {
                    reject(new Error("Request failed: " + req.statusText));
                }
            });

            req.addEventListener("error", function() {
                reject(new Error("Network error "));
            });

            req.send(JSON.stringify(newOrder));
        });
    };

    /**
     * Post new shipping data to server.
     * 
     * @param {Object} order object of order.
     *
     * @param {String[]} values array of received from form values.
     *
     * @returns {Promise} the promise object will be resolved once XHR posts loaded/failed
     *
     * @public
     */
    this.updateOrderShip = function(order, values) {

        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();

            req.open("POST", "http://localhost:3000/api/Orders/" + order.id + "/replace");

            req.setRequestHeader("Content-Type", "application/json");

            order.shipTo.name = values[0];
            order.shipTo.address = values[1];
            order.shipTo.ZIP = values[2];
            order.shipTo.region = values[3];
            order.shipTo.country = values[4];

            req.addEventListener("load", function() {
                if (req.status < 400) {
                    resolve(order.id);
                } else {
                    reject(new Error("Request failed: " + req.statusText));
                }
            });
            req.addEventListener("error", function() {
                reject(new Error("Network error "));
            });
            req.send(JSON.stringify(order));
        });
    };

    /**
     * Post new customer data to server.
     * 
     * @param {Object} order object of order.
     *
     * @param {String[]} values array of received from form values.
     *
     * @returns {Promise} the promise object will be resolved once XHR posts loaded/failed
     *
     * @public
     */
    this.updateOrderCustomer = function(order, values) {

        return new Promise(function(resolve, reject) {

            var req = new XMLHttpRequest();

            req.open("POST", "http://localhost:3000/api/Orders/" + order.id + "/replace");

            req.setRequestHeader("Content-Type", "application/json");

            order.customerInfo.firstName = values[0];
            order.customerInfo.lastName = values[1];
            order.customerInfo.address = values[2];
            order.customerInfo.phone = values[3];
            order.customerInfo.email = values[4];

            req.addEventListener("load", function() {
                if (req.status < 400) {
                    resolve(order.id);
                } else {
                    reject(new Error("Request failed: " + req.statusText));
                }
            });

            req.addEventListener("error", function() {
                reject(new Error("Network error "));
            });

            req.send(JSON.stringify(order));
        });
    };

    /**
     * Post new product to server.
     * 
     * @param {Number} id the order id.
     *
     * @param {String[]} values array of received from form values.
     *
     * @returns {Promise} the promise object will be resolved once XHR posts loaded/failed
     *
     * @public
     */
    this.postProduct = function(id, values) {

        return new Promise(function(resolve, reject) {

            var req = new XMLHttpRequest();

            req.open("POST", "http://localhost:3000/api/OrderProducts");

            req.setRequestHeader("Content-Type", "application/json");

            var newProduct = {
                "name": values[0],
                "price": Number.parseFloat(values[1]),
                "currency": values[2].toUpperCase(), //check if letters > 3 return
                "quantity": Number.parseInt(values[3]),
                "totalPrice": Number.parseFloat(values[1]) * Number.parseInt(values[3]),
                "orderId": Number.parseInt(id)
            };

            req.addEventListener("load", function() {
                if (req.status < 400) {
                    alert("Product was successfully added");
                    var response = JSON.parse(req.responseText);
                    resolve(id);
                } else {
                    reject(new Error("Request failed: " + req.statusText));
                }
            });

            req.addEventListener("error", function() {
                reject(new Error("Network error "));
            });

            req.send(JSON.stringify(newProduct));
        });
    };

    /**
     * Delete order from server.
     * 
     * @param {Number} id the order id.
     *
     * @returns {Promise} the promise object will be resolved once XHR deletes loaded/failed
     *
     * @public
     */
    this.deleteOrder = function(id) {
        return new Promise(function(resolve, reject) {
            if (!id) {
                alert("Choose order");
                return;
            }

            var req = new XMLHttpRequest();

            req.open("DELETE", "http://localhost:3000/api/Orders/" + id);

            req.addEventListener("load", function() {
                if (req.status < 400) {
                    alert("Order was successful deleted");
                    resolve();
                } else {
                    reject(new Error("Request failed: " + req.statusText));
                }
            });

            req.addEventListener("error", function() {
                reject(new Error("Network error "));
            });

            req.send(null);
        });
    };

    /**
     * Delete product from server.
     * 
     * @param {Number} productId the product id.
     * 
     * @param {Number} orderId the order id.
     * 
     * @returns {Promise} the promise object will be resolved once XHR deletes loaded/failed
     *
     * @public
     */
    this.deleteProduct = function(productId, orderId) {

        return new Promise(function(resolve, reject) {
            if (!productId) {
                alert("Error");
                return;
            }

            var req = new XMLHttpRequest();

            req.open("DELETE", "http://localhost:3000/api/OrderProducts/" + productId);

            req.addEventListener("load", function() {
                if (req.status < 400) {
                    alert("Product was successfully deleted");
                    resolve(orderId);
                } else {
                    reject(new Error("Request failed: " + req.statusText));
                }
            });

            req.addEventListener("error", function() {
                reject(new Error("Network error "));
            });

            req.send(null);
        });
    };
}