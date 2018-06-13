function Model() {

    this.getData = function(id, isProducts, arg) {
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
                    resolve(JSON.parse(req.responseText), arg);
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

    this.postOrderShip = function(order, values) {

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

    this.postOrderCustomer = function(order, values) {

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

function View() {
    var orderShortInfo = document.getElementsByClassName("order-short-info")[0],
        ordersList = document.getElementsByClassName("orders-list")[0],
        orderListTemplate = document.createElement("li"),
        orderDivTemplate = document.createElement("div"),
        orderName = document.createElement("h2"),
        orderFillFieldTemplate = document.createElement("p");

    var orderInfo = document.getElementsByClassName("order-info")[0],
        mainOrder = document.getElementsByClassName("main-order")[0],
        mainOrderInfo = document.getElementsByClassName("main-order-info")[0],
        priceOrderInfo = document.getElementsByClassName("price-order-info")[0],
        chooseAdditionOrderInfo = document.getElementsByClassName("choose-addition-order-info")[0],
        additionOrderInfo = document.getElementsByClassName("addition-order-info")[0],
        orderChosenInfo = document.getElementById("order-chosen-info"),
        orderItems = document.getElementsByClassName("order-items")[0],
        itemsTable = orderItems.getElementsByClassName("table-items")[0],
        i,
        k,
        target;

    var iconSearchList = document.getElementsByClassName("fa-search")[0],
        inputSearchList = document.getElementById("input-search-list"),
        iconSearchTable = document.getElementsByClassName("fa-search")[1],
        inputSearchTable = document.getElementById("input-search-table");

    var searchProducts;

    var addOrderIcon = document.getElementById("add-order"),
        deleteOrderIcon = document.getElementById("delete-order"),
        addProductIcon = document.getElementById("add-product-icon");

    //create template of order in list
    this.createOrderListTemplate = function() {

        orderListTemplate.className = "order-single";

        var orderBasicInfo = orderDivTemplate.cloneNode(true);
        orderBasicInfo.className = "basic-info";
        orderBasicInfo.appendChild(orderName.cloneNode(true)).className = "list-order-name";
        orderBasicInfo.appendChild(orderFillFieldTemplate.cloneNode(true)).className = "list-order-customer";
        orderBasicInfo.appendChild(orderFillFieldTemplate.cloneNode(true)).className = "list-order-ship";

        var orderTimeInfo = orderDivTemplate.cloneNode(true);
        orderTimeInfo.className = "time-info";
        orderTimeInfo.appendChild(orderFillFieldTemplate.cloneNode(true)).className = "list-order-created";
        orderTimeInfo.appendChild(orderFillFieldTemplate.cloneNode(true)).className = "list-order-status";

        orderListTemplate.appendChild(orderBasicInfo);
        orderListTemplate.appendChild(orderTimeInfo);
    };

    //filling template of order in list
    this.createOrdersList = function(orders) {
        var numberOfOrders, orders;

        //Clean ordersList
        while (ordersList.firstChild) {
            ordersList.removeChild(ordersList.firstChild);
        }

        orderShortInfo.firstElementChild.lastElementChild.innerHTML = "Orders (" + orders.length + ")";

        this.normalizeOrderData(orders);

        for (i = 0; i < orders.length; i++) {
            var orderListSingle = orderListTemplate.cloneNode(true);
            orderListSingle.setAttribute("data-order-id", "" + orders[i].id);

            orderListSingle.getElementsByClassName("list-order-name")[0].innerHTML = "Order " + orders[i].id;
            orderListSingle.getElementsByClassName("list-order-customer")[0].innerHTML = "" + orders[i].summary.customer;
            orderListSingle.getElementsByClassName("list-order-ship")[0].innerHTML = "Shipped: " + orders[i].summary.shippedAt;

            orderListSingle.getElementsByClassName("list-order-created")[0].innerHTML = "" + orders[i].summary.createdAt;
            if (orders[i].summary.status === "accepted") {
                orderListSingle.getElementsByClassName("list-order-status")[0].innerHTML = "Accepted";
                orderListSingle.getElementsByClassName("list-order-status")[0].classList.add("is-in-time");
            } else {
                if (orders[i].summary.status === "pending") {
                    orderListSingle.getElementsByClassName("list-order-status")[0].innerHTML = "Pending";
                    orderListSingle.getElementsByClassName("list-order-status")[0].classList.add("is-urgent");
                }
            }
            ordersList.appendChild(orderListSingle);
        }
    };

    this.fillWithDataFirstSection = function(order) {

        var dataList = mainOrderInfo.getElementsByClassName("data-list")[0];

        //clear array of founded products for new order
        searchProducts = undefined;

        this.normalizeOrderData(order);

        mainOrderInfo.setAttribute("data-order-id", "" + order.id);
        mainOrderInfo.getElementsByClassName("order-name")[0].innerHTML = "Order " + order.id;
        dataList.getElementsByClassName("order-customer")[0].innerHTML = "Customer: " + order.summary.customer;
        dataList.getElementsByClassName("order-ordered")[0].innerHTML = "Ordered: " + order.summary.createdAt;
        dataList.getElementsByClassName("order-shipped")[0].innerHTML = "Shipped: " + order.summary.shippedAt;
        priceOrderInfo.getElementsByClassName("order-total-price")[0].innerHTML = "" + order.summary.totalPrice;
        priceOrderInfo.getElementsByClassName("order-currency")[0].innerHTML = "" + order.summary.currency;
    }

    this.fillWithDataSecondSection = function(order, numberOfCommand) {

        if (numberOfCommand) {
            this.switchTab(order, Number.parseInt(numberOfCommand));
        } else {
            //delete all chosen-action class tabs
            Array.prototype.forEach.call(chooseAdditionOrderInfo.querySelectorAll("div"), function(item) {
                item.classList.remove("chosen-action");
            });
            mainOrderInfo.lastElementChild.firstElementChild.classList.add("chosen-action");
            additionOrderInfo.firstElementChild.innerHTML = "Shipping Address";
            orderChosenInfo.setAttribute("data-info", "1");
            orderChosenInfo.innerHTML = '\n<label>Name: <input type="text" value="' +
                order.shipTo.name +
                '" readonly id="input-name-ship-local"></label>\n<label>Street: <input type="text" value="' +
                order.shipTo.address +
                '" readonly id="input-address-ship-local"></label>\n<label>ZIP Code / City: <input type="text" value="' +
                order.shipTo.ZIP +
                '" readonly id="input-zip-ship-local"></label>\n<label>Region: <input type="text" value="' +
                order.shipTo.region +
                '" readonly id="input-region-ship-local"></label>\n<label>Country: <input type="text" value="' +
                order.shipTo.country +
                '" readonly id="input-country-ship-local"></label>\n<input type="button" value="Edit" id="edit-ship">\n<input type="submit" value="Save">';

            var editShip = document.getElementById("edit-ship");

            editShip.addEventListener("click", function() {
                editShip.classList.toggle("active-edit");
                if (editShip.className === "active-edit") {
                    Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[readonly]"), function(input) {
                        input.removeAttribute("readonly");
                        input.classList.add("active");
                    });
                    editShip.value = "Cancel";
                }
                if (editShip.className === "") {
                    Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[type=text], input[type=tel], input[type=email]"), function(input) {
                        input.setAttribute("readonly", "readonly");
                        input.classList.remove("active");
                    });
                    editShip.value = "Edit";
                }
            });
        }
    }

    this.fillWithDataOrderTemplate = function(order, numberOfCommand) {

        mainOrder.classList.remove("hidden");

        this.fillWithDataFirstSection(order);

        this.fillWithDataSecondSection(order, numberOfCommand);

        this.deleteSorts();

        // Make all visible
        orderInfo.classList.remove("hidden");
        additionOrderInfo.classList.remove("hidden");
        orderItems.classList.remove("hidden");
    };

    this.createOrderItemTemplate = function() {
        var rowItemsTemplate = document.createElement("tr"),
            columnItemsTemplate = document.createElement("td"),
            itemName = document.createElement("h3"),
            itemProductInfo = columnItemsTemplate.cloneNode(true),
            itemPriceInfo = columnItemsTemplate.cloneNode(true),
            itemQuantityInfo = columnItemsTemplate.cloneNode(true),
            itemTotalInfo = columnItemsTemplate.cloneNode(true),
            itemTrash = columnItemsTemplate.cloneNode(true);

        itemProductInfo.className = "item-product";
        itemPriceInfo.className = "item-price";
        itemQuantityInfo.className = "item-quantity";
        itemTotalInfo.className = "item-total";
        itemTrash.className = "item-trash";

        itemProductInfo.appendChild(itemName);
        itemProductInfo.appendChild(orderFillFieldTemplate);

        rowItemsTemplate.appendChild(itemProductInfo);
        rowItemsTemplate.appendChild(itemPriceInfo);
        rowItemsTemplate.appendChild(itemQuantityInfo);
        rowItemsTemplate.appendChild(itemTotalInfo);
        rowItemsTemplate.appendChild(itemTrash);

        return rowItemsTemplate;
    };

    this.fillTable = function(products) {

        //Clean all rows before updating new
        while (itemsTable.firstElementChild.nextElementSibling) {
            itemsTable.removeChild(itemsTable.firstElementChild.nextElementSibling);
        }

        orderItems.getElementsByClassName("total-items")[0].innerHTML = "Line items (" + products.length + ")";

        var rowItemsTemplate = this.createOrderItemTemplate();

        for (i = 0; i < products.length; i++) {

            var rowItemSingle = rowItemsTemplate.cloneNode(true);

            rowItemSingle.getElementsByClassName("item-product")[0].firstElementChild.innerHTML = "" + products[i].name;
            rowItemSingle.getElementsByClassName("item-product")[0].lastElementChild.innerHTML = "" + products[i].id;

            rowItemSingle.getElementsByClassName("item-price")[0].innerHTML = "<strong>" + products[i].price + "</strong> " + products[i].currency;

            rowItemSingle.getElementsByClassName("item-quantity")[0].innerHTML = "" + products[i].quantity;

            rowItemSingle.getElementsByClassName("item-total")[0].innerHTML = "<strong>" + products[i].totalPrice + "</strong> " + products[i].currency;

            rowItemSingle.getElementsByClassName("item-trash")[0].innerHTML = "<i class=\"fas fa-trash-alt\" data-product-id=\"" + products[i].id + "\"></i>";

            itemsTable.appendChild(rowItemSingle);
        }
    };

    this.switchTab = function(order, command) {
        switch (command) {
            case 1:
                iconChoice.classList.add("chosen-action");
                additionOrderInfo.firstElementChild.innerHTML = "Shipping Address";
                orderChosenInfo.setAttribute("data-info", "1");
                orderChosenInfo.innerHTML = '\n<label>Name: <input type="text" value="' +
                    order.shipTo.name +
                    '" readonly id="input-name-ship-local"></label>\n<label>Street: <input type="text" value="' +
                    order.shipTo.address +
                    '" readonly id="input-address-ship-local"></label>\n<label>ZIP Code / City: <input type="text" value="' +
                    order.shipTo.ZIP +
                    '" readonly id="input-zip-ship-local"></label>\n<label>Region: <input type="text" value="' +
                    order.shipTo.region +
                    '" readonly id="input-region-ship-local"></label>\n<label>Country: <input type="text" value="' +
                    order.shipTo.country +
                    '" readonly id="input-country-ship-local"></label>\n <input type="button" value="Edit" id="edit-ship">\n<input type="submit" value="Save">';

                var editShip = document.getElementById("edit-ship");

                editShip.addEventListener("click", function() {
                    editShip.classList.toggle("active-edit");
                    if (editShip.className === "active-edit") {
                        Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[readonly]"), function(input) {
                            input.removeAttribute("readonly");
                            input.classList.add("active");
                        });
                        editShip.value = "Cancel";
                    }
                    if (editShip.className === "") {
                        Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[type=text], input[type=tel], input[type=email]"), function(input) {
                            input.setAttribute("readonly", "readonly");
                            input.classList.remove("active");
                        });
                        editShip.value = "Edit";
                    }
                });
                break;
            case 2:
                iconChoice.classList.add("chosen-action");
                additionOrderInfo.firstElementChild.innerHTML = "Map";
                orderChosenInfo.setAttribute("data-info", "2");
                orderChosenInfo.innerHTML = "<div id=\"map\">Hello</div>";
                this.addMap(order, document.getElementById("map"));
                break;
            case 3:
                iconChoice.classList.add("chosen-action");
                additionOrderInfo.firstElementChild.innerHTML = "Customer Information";
                orderChosenInfo.setAttribute("data-info", "3");
                orderChosenInfo.innerHTML = '\n<label>First Name: <input type="text" value = "' +
                    order.customerInfo.firstName +
                    '" readonly id="input-first-customer-local"></label>\n<label>Last Name: <input type="text" value = "' +
                    order.customerInfo.lastName +
                    '" readonly id="input-last-customer-local"></label>\n<label>Address: <input type="text" value = "' +
                    order.customerInfo.address +
                    '" readonly id="input-addres-customer-local"></label>\n<label>Phone: <input type="tel" value = "' +
                    order.customerInfo.phone +
                    '" readonly id="input-phone-customer-local"></label>\n<label>Email: <input type="email" value = "' +
                    order.customerInfo.email +
                    '" readonly id="input-email-customer-local"></label>\n<input type="button" value="Edit" id="edit-customer">\n<input type="submit" value="Save">';

                var editCustomer = document.getElementById("edit-customer");

                editCustomer.addEventListener("click", function() {
                    editCustomer.classList.toggle("active-edit");
                    if (editCustomer.className === "active-edit") {
                        Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[readonly]"), function(input) {
                            input.removeAttribute("readonly");
                            input.classList.add("active");
                        });
                        editCustomer.value = "Cancel";
                    }
                    if (editCustomer.className === "") {
                        Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[type=text], input[type=tel], input[type=email]"), function(input) {
                            input.setAttribute("readonly", "readonly");
                            input.classList.remove("active");
                        });
                        editCustomer.value = "Edit";
                    }
                });
                break;
        }
    };

    //implementation of sorting
    this.sortItemsTable = function(products, iconSort) {

        var sortType = iconSort.getAttribute("data-sort-type"),
            sortState = Number.parseInt(iconSort.getAttribute("data-state"));

        //if we'll want to sort founded products
        if (searchProducts) {
            this.sortActions(sortType, sortState, searchProducts);
            this.fillTable(searchProducts);
        } else { //otherwise
            this.sortActions(sortType, sortState, products);
            sortProducts = products.map(function(item) {
                return item;
            });
            this.fillTable(products);
        }
    }

    this.sortActions = function(sortType, sortState, searchProducts) {
        if (sortState === 2 && sortType === "product") {
            searchProducts.sort(function(a, b) {
                var keyA = a.name,
                    keyB = b.name;
                return ((keyA < keyB) ? -1 : ((keyA > keyB) ? 1 : 0));
            });
        }
        if (sortState === 2 && sortType === "price") {
            searchProducts.sort(function(a, b) {
                var keyA = Number.parseFloat(a.price),
                    keyB = Number.parseFloat(b.price);
                return ((keyA - keyB < 0) ? -1 : ((keyA - keyB > 0) ? 1 : 0));
            });
        }
        if (sortState === 2 && sortType === "quantity") {
            searchProducts.sort(function(a, b) {
                var keyA = Number.parseFloat(a.quantity),
                    keyB = Number.parseFloat(b.quantity);
                return ((keyA - keyB < 0) ? -1 : ((keyA - keyB > 0) ? 1 : 0));
            });
        }
        if (sortState === 2 && sortType === "total") {
            searchProducts.sort(function(a, b) {
                var keyA = Number.parseFloat(a.totalPrice),
                    keyB = Number.parseFloat(b.totalPrice);
                return ((keyA - keyB < 0) ? -1 : ((keyA - keyB > 0) ? 1 : 0));
            });
        }
        //decrease
        if (sortState === 3 && sortType === "product") {
            searchProducts.sort(function(a, b) {
                var keyA = a.name,
                    keyB = b.name;
                return ((keyA < keyB) ? 1 : ((keyA > keyB) ? -1 : 0));
            });
        }
        if (sortState === 3 && sortType === "price") {
            searchProducts.sort(function(a, b) {
                var keyA = Number.parseFloat(a.price),
                    keyB = Number.parseFloat(b.price);
                return ((keyA - keyB < 0) ? 1 : ((keyA - keyB > 0) ? -1 : 0));
            });
        }
        if (sortState === 3 && sortType === "quantity") {
            searchProducts.sort(function(a, b) {
                var keyA = Number.parseFloat(a.quantity),
                    keyB = Number.parseFloat(b.quantity);
                return ((keyA - keyB < 0) ? 1 : ((keyA - keyB > 0) ? -1 : 0));
            });
        }
        if (sortState === 3 && sortType === "total") {
            searchProducts.sort(function(a, b) {
                var keyA = Number.parseFloat(a.totalPrice),
                    keyB = Number.parseFloat(b.totalPrice);
                return ((keyA - keyB < 0) ? 1 : ((keyA - keyB > 0) ? -1 : 0));
            });
        }
        //normal
        if (sortState === 1) {
            searchProducts.sort(function(a, b) {
                var keyA = a.id,
                    keyB = b.id;
                return ((keyA < keyB) ? -1 : ((keyA > keyB) ? 1 : 0));
            });
        }
    }

    //implementation of search in list of orders
    this.searchList = function(orders) {
        var requestString = inputSearchList.value.trim().toLowerCase(),
            arrayOfPositiveOrders = [],
            normalDate;
        for (i = 0; i < orders.length; i++) {
            for (var key in orders[i].summary) {
                if (orders[i].summary[key].toString().includes(":")) {
                    normalDate = this.normalizeDate(orders[i].summary[key]);
                    orders[i].summary[key] = normalDate;
                }
                if (orders[i].summary[key].toString().toLowerCase().match(requestString)) {
                    arrayOfPositiveOrders.push(orders[i]);
                }
            }
        }
        uniquearrayOfPositiveOrders = arrayOfPositiveOrders.filter(function(item, pos) {
            return arrayOfPositiveOrders.indexOf(item) == pos;
        });
        this.createOrdersList(uniquearrayOfPositiveOrders);
    };

    //implementation of search in table of items
    this.searchTable = function(products) {
        var requestString = inputSearchTable.value.trim().toLowerCase(),
            arrayOfPositiveProducts = [];

        if (requestString === "") {
            //set all sorting actions to normal (maybe make local sorting function, get sort-attribute and make sort))
            Array.prototype.forEach.call(itemsTable.firstElementChild.querySelectorAll("i"), function(icon) {
                icon.setAttribute("data-state", "1");
                icon.className = "fas fa-angle-up";
            });
            //if we'll want to sort founded products
            searchProducts = products.map(function(item) {
                return item;
            });
            var baseNode = this.createOrderItemTemplate();
            this.fillTable(products, baseNode);
        } else {
            for (i = 0; i < products.length; i++) {
                for (var key in products[i]) {
                    if (products[i][key].toString().toLowerCase().match(requestString)) {
                        arrayOfPositiveProducts.push(products[i]);
                    }
                }
            }
            uniquearrayOfPositiveProducts = arrayOfPositiveProducts.filter(function(item, pos) {
                return arrayOfPositiveProducts.indexOf(item) == pos;
            });
            //set all sorting actions to normal
            Array.prototype.forEach.call(itemsTable.firstElementChild.querySelectorAll("i"), function(icon) {
                icon.setAttribute("data-state", "1");
                icon.className = "fas fa-angle-up";
            });
            //if we'll want to sort founded products
            searchProducts = uniquearrayOfPositiveProducts.map(function(item) {
                return item;
            });
            var baseNode = this.createOrderItemTemplate();
            this.fillTable(uniquearrayOfPositiveProducts, baseNode);
        }
    };

    this.normalizeDate = function(dateString) {

        // If it's not at least 6 characters long (8/8/88), give up.
        if (dateString.length && dateString.length < 6) {
            return '';
        }

        var date = new Date(dateString),
            month,
            day;

        // If input format was in UTC time, adjust it to local.
        if (date.getHours() || date.getMinutes()) {
            date.setMinutes(date.getTimezoneOffset());
        }

        month = date.getMonth() + 1;
        day = date.getDate();

        // Return empty string for invalid dates
        if (!day) {
            return '';
        }

        // Return the normalized string.
        return (day > 9 ? '' : '0') + day + '.' + (month > 9 ? '' : '0') + month + '.' + date.getFullYear();
    };

    //change date to comfortable for a human look
    this.normalizeOrderData = function(orders) {

        //if we get one object-order, normalize date in this order, else normalize every date in every order
        if (!orders.length) {
            for (var key in orders.summary) {
                if (orders.summary[key].toString().includes(":")) {
                    normalDate = this.normalizeDate(orders.summary[key]);
                    orders.summary[key] = normalDate;
                }
            }
        } else {
            for (i = 0; i < orders.length; i++) {
                for (var key in orders[i].summary) {
                    if (orders[i].summary[key].toString().includes(":")) {
                        normalDate = this.normalizeDate(orders[i].summary[key]);
                        orders[i].summary[key] = normalDate;
                    }
                }
            }
        }
    };

    this.fillWithEmptyOrderTemplate = function() {
        mainOrder.classList.add("hidden");
    };

    this.addMap = function(order, container) {
        var geocoder,
            map,
            address = order.shipTo.address + order.shipTo.region + order.shipTo.country;

        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions = {
            zoom: 2,
            minZoom: 2,
            center: latlng,
            gestureHandling: 'greedy',
            styles: [{
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#444444"
                }]
            }, {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{
                    "color": "#f2f2f2"
                }]
            }, {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{
                    "saturation": -100
                }, {
                    "lightness": 45
                }]
            }, {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{
                    "visibility": "simplified"
                }]
            }, {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{
                    "color": "#46bcec"
                }, {
                    "visibility": "on"
                }]
            }]
        };
        map = new google.maps.Map(container, myOptions);
        if (geocoder) {
            geocoder.geocode({
                'address': address
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                        map.setCenter(results[0].geometry.location);
                        var infowindow = new google.maps.InfoWindow({
                            content: '<b>' + address + '</b>',
                            size: new google.maps.Size(150, 50)
                        });
                        var marker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            title: address
                        });
                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.open(map, marker);
                        });
                    } else {
                        alert("No results found");
                    }
                } else {
                    alert("No results found");
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        }
    };

    //getters

    this.getOrdersList = function() {
        return ordersList;
    };

    this.getAddOrderIcon = function() {
        return addOrderIcon;
    };

    this.getDeleteOrderIcon = function() {
        return deleteOrderIcon;
    };

    this.getAddProductIcon = function() {
        return addProductIcon;
    };

    this.getItemsTable = function() {
        return itemsTable;
    };

    this.getItemsTableHeader = function() {
        return itemsTable.firstElementChild;
    };

    this.getOrderChosenInfo = function() {
        return orderChosenInfo;
    };

    this.getChooseAdditionOrderInfo = function() {
        return chooseAdditionOrderInfo;
    };

    this.getIconSearchList = function() {
        return iconSearchList;
    };

    this.getIconSearchTable = function() {
        return iconSearchTable;
    };

    this.getOrderId = function() {
        return Number.parseInt(mainOrderInfo.getAttribute("data-order-id"));
    };

    this.getAddOrderForm = function() {
        return document.getElementById("add-order-form");
    };

    this.getAddProductForm = function() {
        return document.getElementById("add-product-form");
    };

    this.getAdditionalInfoId = function(iconChoice) {
        if (iconChoice) {
            return Number.parseInt(iconChoice.getAttribute("data-action"));
        } else {
            return Number.parseInt(orderChosenInfo.getAttribute("data-info"));
        }
    };

    this.findClickedOrder = function(event) {
        var target = event.target || event.srcElement,
            orderLi = target.matches("li") ? target : target.closest("li");
        return orderLi;
    };

    this.getAttr = function(element, attr) {
        return element.getAttribute(attr);
    };

    this.addClass = function(element, cls) {
        element.classList.add(cls);
    };

    this.closeBackground = function(target, background) {
        if (target.matches("DIV") || target.matches("I")) {
            while (background.firstChild) {
                background.removeChild(background.firstChild);
            }
            background.remove();
        }
    };

    this.changeSortState = function(sortState) {
        switch (sortState) {
            case 1:
                sortState += 1;
                iconSort.setAttribute("data-state", "" + sortState);
                iconSort.className = "fas fa-angle-up sort-increase";
                break;
            case 2:
                sortState += 1;
                iconSort.setAttribute("data-state", "" + sortState);
                iconSort.className = "fas fa-angle-down sort-decrease";
                break;
            case 3:
                sortState = 1;
                iconSort.setAttribute("data-state", "" + sortState);
                iconSort.className = "fas fa-angle-up";
                break;
        }
    };

    //remove chosen-order class from all siblings
    this.removeClsFromSiblings = function(element) {
        firstLi = element.parentNode.firstElementChild;
        do {
            if (firstLi !== element) {
                firstLi.classList.remove("chosen-order");
            }
        } while (firstLi = firstLi.nextElementSibling);
    };

    //new

    this.showAddOrderForm = function() {
        var background = orderDivTemplate.cloneNode(true);
        background.className = "background-dialog";
        background.innerHTML = `<div id="cancel-form"><i class="fas fa-times"></i></div>
                                <form action="" id="add-order-form">
                                    <h2>Add order</h2>
                                    <label data-req><input type="text" placeholder="Customer" required id="input-customer"></label>

                                    <h3>Shipping Address</h3>
                                    <label><input type="text" placeholder="Name" id="input-name-ship"></label>
                                    <label><input type="text" placeholder="Address" id="input-address-ship"></label>
                                    <label><input type="text" placeholder="ZIP" id="input-zip-ship"></label>
                                    <label><input type="text" placeholder="Region" id="input-region-ship"></label>
                                    <label><input type="text" placeholder="Country" id="input-country-ship"></label>
                                    <h3>Customer Information</h3>
                                    <label><input type="text" placeholder="First name" id="input-first-name-customer"></label>
                                    <label><input type="text" placeholder="Last name" id="input-last-name-customer"></label>
                                    <label><input type="text" placeholder="Address" id="input-address-customer"></label>
                                    <label><input type="tel" placeholder="Phone number" id="input-phone-customer"></label>
                                    <label><input type="email" placeholder="Email" id="input-email-customer"></label>
                                    <input type="submit" value="Add order" id="add-order-submit">
                                </form>`;
        document.body.insertBefore(background, document.body.firstChild);
        return background;
    };

    this.showAddProductForm = function() {
        var background = orderDivTemplate.cloneNode(true);
        background.className = "background-dialog";
        background.innerHTML = "<div id=\"cancel-form\"><i class=\"fas fa-times\"></i></div>\n                            <form action=\"\" id=\"add-product-form\">\n                                <h2>Add product</h2>\n                                <label data-req><input type=\"text\" placeholder=\"Name\" required id=\"input-name-product\"></label>\n                                <label data-req><input type=\"number\" placeholder=\"Price\" required id=\"input-price-product\"></label>\n                                <label data-req><input type=\"text\" placeholder=\"Currency\" required id=\"input-currency-product\"></label>\n                                <label data-req><input type=\"number\" placeholder=\"Quantity\" required id=\"input-quantity-product\"></label>\n                                <input type=\"submit\" value=\"Add product\" id=\"add-product-submit\">\n                            </form>";
        document.body.insertBefore(background, document.body.firstChild);
        return background;
    };

    this.getAddOrderFormValues = function() {
        var arrayOfValues = [];

        var customerValue = document.getElementById("input-customer").value,
            nameShipValue = document.getElementById("input-name-ship").value,
            addressShipValue = document.getElementById("input-address-ship").value,
            zipShipValue = document.getElementById("input-zip-ship").value,
            regionShipValue = document.getElementById("input-region-ship").value,
            countryShipValue = document.getElementById("input-country-ship").value,
            firstNameCustomerValue = document.getElementById("input-first-name-customer").value,
            lastNameCustomerValue = document.getElementById("input-last-name-customer").value,
            addressCustomerValue = document.getElementById("input-address-customer").value,
            phoneCustomerValue = document.getElementById("input-phone-customer").value,
            emailCustomerValue = document.getElementById("input-email-customer").value,
            currentDateInISO = new Date().toISOString();

        arrayOfValues.push(customerValue, nameShipValue, addressShipValue, zipShipValue, regionShipValue, countryShipValue, firstNameCustomerValue, lastNameCustomerValue, addressCustomerValue, phoneCustomerValue, emailCustomerValue, currentDateInISO);

        return arrayOfValues;
    };

    this.getAddProductFormValues = function() {
        var arrayOfValues = [];

        var nameProductValue = document.getElementById("input-name-product").value,
            priceProductValue = document.getElementById("input-price-product").value,
            currencyProductValue = document.getElementById("input-currency-product").value,
            quantityProductValue = document.getElementById("input-quantity-product").value;

        arrayOfValues.push(nameProductValue, priceProductValue, currencyProductValue, quantityProductValue);

        return arrayOfValues;
    };

    this.postOrderShipValues = function() {
        var arrayOfValues = [];

        var nameShipLocalValue = document.getElementById("input-name-ship-local").value,
            addressShipLocalValue = document.getElementById("input-address-ship-local").value,
            zipShipLocalValue = document.getElementById("input-zip-ship-local").value,
            regionShipLocalValue = document.getElementById("input-region-ship-local").value,
            countryShipLocalValue = document.getElementById("input-country-ship-local").value;

        arrayOfValues.push(nameShipLocalValue, addressShipLocalValue, zipShipLocalValue, regionShipLocalValue, countryShipLocalValue);

        return arrayOfValues;
    };

    this.postOrderCustomerValues = function() {
        var arrayOfValues = [];

        var firstNameCustomerLocalValue = document.getElementById("input-first-customer-local").value,
            lastNameCustomerLocalValue = document.getElementById("input-last-customer-local").value,
            addressCustomerLocalValue = document.getElementById("input-addres-customer-local").value,
            phoneCustomerLocalValue = document.getElementById("input-phone-customer-local").value,
            emailCustomerLocalValue = document.getElementById("input-email-customer-local").value;

        arrayOfValues.push(firstNameCustomerLocalValue, lastNameCustomerLocalValue, addressCustomerLocalValue, phoneCustomerLocalValue, emailCustomerLocalValue);

        return arrayOfValues;
    };

    //delete chosen-action class from all tabs
    this.deleteChosenClassFromTabs = function() {
        Array.prototype.forEach.call(chooseAdditionOrderInfo.querySelectorAll("div"), function(item) {
            item.classList.remove("chosen-action");
        });
    };

    //delete all sorts because user must see on the bottom of table added product
    this.deleteSorts = function() {
        Array.prototype.forEach.call(itemsTable.firstElementChild.querySelectorAll("i"), function(icon) {
            icon.setAttribute("data-state", "1");
            icon.className = "fas fa-angle-up";
        });
    };

    this.deleteOthersSorts = function(iconSort) {
        Array.prototype.forEach.call(itemsTable.firstElementChild.querySelectorAll("i"), function(icon) {
            if (iconSort != icon) {
                icon.setAttribute("data-state", "1");
                icon.className = "fas fa-angle-up";
            }
        });
    };

    //check if we have sort, then show sorted products, else show unsorted products View
    this.isHaveSort = function() {
        for (i = 0; i < itemsTable.firstElementChild.querySelectorAll("i").length; i++) {
            if (itemsTable.firstElementChild.querySelectorAll("i")[i].getAttribute("data-state") === "2" || itemsTable.firstElementChild.querySelectorAll("i")[i].getAttribute("data-state") === "3") {
                //getData(sortItemsTable, orderId, true, );
                return itemsTable.firstElementChild.querySelectorAll("i")[i];
            }
        }
        return null;
    };
}

function Controller(view, model) {

    this.init = function() {

        view.createOrderListTemplate();

        model.getData().then(function(orders) {
            view.createOrdersList(orders);
        });

        var ordersList = view.getOrdersList(),
            addOrderIcon = view.getAddOrderIcon(),
            deleteOrderIcon = view.getDeleteOrderIcon(),
            addProductIcon = view.getAddProductIcon(),
            itemsTable = view.getItemsTable(),
            itemsTableHeader = view.getItemsTableHeader(),
            orderChosenInfo = view.getOrderChosenInfo(),
            chooseAdditionOrderInfo = view.getChooseAdditionOrderInfo(),
            iconSearchList = view.getIconSearchList(),
            iconSearchTable = view.getIconSearchTable();

        var orderId, chosenAdditionOrderInfo;

        ordersList.addEventListener("click", this._onOrderFromListClick);
        addOrderIcon.addEventListener("click", this._onAddOrderIconClick);
        deleteOrderIcon.addEventListener("click", this._onDeleteOrderIconClick);
        addProductIcon.addEventListener("click", this._onAddProductIconClick);
        itemsTable.addEventListener("click", this._onDeleteProductIconClick);
        itemsTableHeader.addEventListener("click", this._onSortProductIconClick);
        orderChosenInfo.addEventListener("submit", this._onSaveAdditionalInfoClick);
        chooseAdditionOrderInfo.addEventListener("click", this._onChangeAdditionOrderInfoClick);
        iconSearchList.addEventListener("click", this._onSearchListIconClick);
        iconSearchTable.addEventListener("click", this._onSearchTableIconClick);
    };

    //click on order from list
    this._onOrderFromListClick = function(event) {
        var orderLi = view.findClickedOrder(event);
        if (orderLi) {
            var id = view.getAttr(orderLi, "data-order-id"),
                orderId = view.getOrderId();
            view.addClass(orderLi, "chosen-order");

            //checking if we already watching clicked order
            if (id === orderId) {
                return;
            }

            view.removeClsFromSiblings(orderLi);

            model.getData(id).then(function(order) {
                view.fillWithDataOrderTemplate(order);
                return model.getData(id, true);
            }).then(function(products) {
                view.fillTable(products);
            });
        }
    };

    this._onAddOrderIconClick = function() {
        var background = view.showAddOrderForm();

        background.addEventListener("click", function(event) {
            target = event.target || event.srcElement;
            view.closeBackground(target, background);
        });

        var addOrderForm = view.getAddOrderForm();
        //post order
        addOrderForm.addEventListener("submit", function(event) {

            event.preventDefault();

            var arrayOfValues = view.getAddOrderFormValues();

            model.postOrder(arrayOfValues).then(function() {
                return model.getData();
            }).then(function(orders) {
                view.createOrdersList(orders);
            });
        });
    };

    this._onDeleteOrderIconClick = function() {
        id = view.getOrderId();
        model.deleteOrder(id).then(function() {
            view.fillWithEmptyOrderTemplate();
            return model.getData();
        }).then(function(orders) {
            view.createOrdersList(orders);
        });
    };

    //implementation of adding product
    this._onAddProductIconClick = function() {
        var id = view.getOrderId(),
            background = view.showAddProductForm();

        background.addEventListener("click", function(event) {
            target = event.target || event.srcElement;
            view.closeBackground(target, background);
        });

        var addProductForm = view.getAddProductForm();
        //post product
        addProductForm.addEventListener("submit", function(event) {

            event.preventDefault();

            var arrayOfValues = view.getAddProductFormValues();

            model.postProduct(id, arrayOfValues).then(function(id) {
                return model.getData(id, true);
            }).then(function(products) {
                view.fillTable(products);
            });

            view.deleteSorts();
        });
    };

    //cheking press on trash icon and delete product
    this._onDeleteProductIconClick = function(event) {
        target = event.target || event.srcElement, trashSection = target.matches(".item-trash") ? target : target.closest(".item-trash");
        if (trashSection) {
            var productId = view.getAttr(trashSection.firstChild, "data-product-id"),
                orderId = view.getOrderId(),
                iconSort = view.isHaveSort();

            model.deleteProduct(productId, orderId).then(function(id) {
                return model.getData(id, true);
            }).then(function(products) {
                if (iconSort) {
                    return view.sortItemsTable(products, iconSort);
                } else {
                    return view.fillTable(products);
                }
            });
        }
    };
    //implementation of editing shipping and customer info
    this._onSaveAdditionalInfoClick = function(event) {
        event.preventDefault();

        chosenAdditionOrderInfo = view.getAdditionalInfoId();
        id = view.getOrderId();

        if (chosenAdditionOrderInfo === 1) {
            var values = view.postOrderShipValues();
            model.getData(id).then(function(order) {
                return model.postOrderShip(order, values);
            }).then(function(id) {
                return model.getData(id);
            }).then(function(order) {
                view.fillWithDataOrderTemplate(order);
            });
        };
        if (chosenAdditionOrderInfo === 3) {
            var values = view.postOrderCustomerValues();
            model.getData(id).then(function(order) {
                return model.postOrderCustomer(order, values);
            }).then(function(id) {
                return model.getData(id);
            }).then(function(order) {
                view.fillWithDataOrderTemplate(order);
            });
        };
    };

    //implementation of tab-switch
    this._onChangeAdditionOrderInfoClick = function(event) {
        target = event.target || event.srcElement, iconChoice = target.matches(".icon-choice") ? target : target.closest(".icon-choice");
        if (iconChoice) {
            id = view.getOrderId();
            var numberOfCommand = view.getAdditionalInfoId(iconChoice);

            view.deleteChosenClassFromTabs();

            model.getData(id).then(function(order) {
                view.switchTab(order, numberOfCommand);
            });
        }
    };

    this._onSortProductIconClick = function(event) {
        target = event.target || event.srcElement, iconSort = target.matches("I") ? target : target.closest("I");
        if (iconSort) {

            view.deleteOthersSorts(iconSort);

            var sortState = Number.parseInt(view.getAttr(iconSort, "data-state"));

            view.changeSortState(sortState);

            var id = view.getOrderId();

            model.getData(id, true).then(function(products) {
                view.sortItemsTable(products, iconSort);
            });
        }
    };

    //search from orders list
    this._onSearchListIconClick = function() {
        model.getData().then(function(orders) {
            view.searchList(orders);
        });
    };

    //search from table of items Controller
    this._onSearchTableIconClick = function() {
        orderId = view.getOrderId();
        model.getData(orderId, true).then(function(products) {
            view.searchTable(products);
        });
    };
}

new Controller(new View(), new Model()).init();