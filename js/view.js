/**
 * View class. Knows everything about dom & manipulation and a little bit about data structure, which should be
 * filled into UI element.
 *
 * @constructor
 */
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
        iconUpdateList = document.getElementsByClassName("fa-sync")[0],
        inputSearchList = document.getElementById("input-search-list"),
        iconSearchTable = document.getElementsByClassName("fa-search")[1],
        inputSearchTable = document.getElementById("input-search-table");

    var searchProducts,
        originalShipInfo = [],
        originalCustomerInfo = [];

    var addOrderIcon = document.getElementById("add-order"),
        deleteOrderIcon = document.getElementById("delete-order"),
        addProductIcon = document.getElementById("add-product-icon");

    /**
     * Create template of order in list.
     *
     * @return {View} self object.
     *
     * @public
     */
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

        return this;
    };

    /**
     * Filling template of order in list.
     *
     * @param {Object[]} orders array of orders.
     * 
     * @return {View} self object.
     *
     * @public
     */
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

        return this;
    };

    /**
     * Filling with data first section of order template.
     *
     * @param {Object} order object of order.
     * 
     * @return {View} self object.
     *
     * @public
     */
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

        return this;
    }

    /**
     * Filling with data second section of order template.
     *
     * @param {Object} order object of order.
     * 
     * @param {Number} numberOfCommand number of chosen additional info.
     * 
     * @return {View} self object.
     *
     * @public
     */
    this.fillWithDataSecondSection = function(order, numberOfCommand) {

        if (numberOfCommand) {
            this.switchTab(order, Number.parseInt(numberOfCommand));
        } else {
            this.deleteChosenClassFromTabs();
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
                        originalShipInfo.push(input.value);
                        input.removeAttribute("readonly");
                        input.classList.add("active");
                    });
                    editShip.value = "Cancel";
                }
                if (editShip.className === "") {
                    k = 0;
                    Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[type=text], input[type=tel], input[type=email]"), function(input) {
                        input.value = originalShipInfo[k];
                        input.setAttribute("readonly", "readonly");
                        input.classList.remove("active");
                        k++;
                    });
                    editShip.value = "Edit";
                }
            });
        }
        return this;
    }

    /**
     * Filling with data order template.
     *
     * @param {Object} order object of order.
     * 
     * @param {Number} numberOfCommand number of chosen additional info.
     * 
     * @return {View} self object.
     *
     * @public
     */
    this.fillWithDataOrderTemplate = function(order, numberOfCommand) {

        mainOrder.classList.remove("hidden");

        this.fillWithDataFirstSection(order);

        this.fillWithDataSecondSection(order, numberOfCommand);

        this.deleteSorts();

        inputSearchTable.value = "";

        // Make all visible
        orderInfo.classList.remove("hidden");
        additionOrderInfo.classList.remove("hidden");
        orderItems.classList.remove("hidden");

        return this;
    };

    /**
     * Create template of product.
     * 
     * @return {HTMLTableRowElement} template of product.
     *
     * @public
     */
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

    /**
     * Filling table of products.
     *
     * @param {Object[]} products array of products.
     * 
     * @return {View} self object.
     *
     * @public
     */
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

        return this;
    };

    /**
     * Switching additional info.
     *
     * @param {Object} order object of order.
     * 
     * @param {Number} command number of chosen additional info.
     * 
     * @return {View} self object.
     *
     * @public
     */
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
                            originalShipInfo.push(input.value);
                            input.removeAttribute("readonly");
                            input.classList.add("active");
                        });
                        editShip.value = "Cancel";
                    }
                    if (editShip.className === "") {
                        k = 0;
                        Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[type=text], input[type=tel], input[type=email]"), function(input) {
                            input.value = originalShipInfo[k];
                            input.setAttribute("readonly", "readonly");
                            input.classList.remove("active");
                            k++;
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
                            originalCustomerInfo.push(input.value);
                            input.removeAttribute("readonly");
                            input.classList.add("active");
                        });
                        editCustomer.value = "Cancel";
                    }
                    if (editCustomer.className === "") {
                        k = 0;
                        Array.prototype.forEach.call(orderChosenInfo.querySelectorAll("input[type=text], input[type=tel], input[type=email]"), function(input) {
                            input.value = originalCustomerInfo[k];
                            input.setAttribute("readonly", "readonly");
                            input.classList.remove("active");
                            k++;
                        });
                        editCustomer.value = "Edit";
                    }
                });
                break;
        }

        return this;
    };

    /**
     * Sorting products.
     *
     * @param {Object[]} products array of products.
     * 
     * @param {HTMLIconElement} iconSort icon of the chosen sorting action.
     * 
     * @return {View} self object.
     *
     * @public
     */
    this.sortItemsTable = function(products, iconSort) {

        var sortType = iconSort.getAttribute("data-sort-type"),
            sortState = Number.parseInt(iconSort.getAttribute("data-state"));

        //if we'll want to sort founded products
        if (searchProducts) {
            this.sortActions(sortType, sortState, searchProducts);
            this.fillTable(searchProducts);
        } else {
            this.sortActions(sortType, sortState, products);
            sortProducts = products.map(function(item) {
                return item;
            });
            this.fillTable(products);
        }

        return this;
    }

    /**
     * Sorting actions of products.
     *
     * @param {String} sortType type of sorting.
     * 
     * @param {Number} sortState state of sorting (increase, decrease or normal).
     * 
     * @param {Object[]} searchProducts array of earlier founded products.
     * 
     * @return {View} self object.
     *
     * @public
     */
    this.sortActions = function(sortType, sortState, searchProducts) {
        //increase
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

        return this;
    }

    /**
     * Searching in list of orders.
     * 
     * @param {Object[]} orders array of orders.
     * 
     * @return {View} self object.
     *
     * @public
     */
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

        return this;
    };

    /**
     * Searching in table of products.
     * 
     * @param {Object[]} products array of products.
     * 
     * @return {View} self object.
     *
     * @public
     */
    this.searchTable = function(products) {
        var requestString = inputSearchTable.value.trim().toLowerCase(),
            arrayOfPositiveProducts = [];

        if (requestString === "") {

            this.deleteSorts();
            //if we'll want to sort founded products
            searchProducts = null;
            this.fillTable(products);
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
            this.deleteSorts();
            //if we'll want to sort founded products
            searchProducts = uniquearrayOfPositiveProducts.map(function(item) {
                return item;
            });
            this.fillTable(uniquearrayOfPositiveProducts);
        }

        return this;
    };

    /**
     * Normalizing date from ISO.
     * 
     * @param {String} dateString string of date in ISO.
     * 
     * @return {String} normalized string.
     *
     * @public
     */
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

    /**
     * Normalize dates in order from ISO.
     * 
     * @param {Object[]} orders array of orders.
     * 
     * @return {View} self object.
     *
     * @public
     */
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

        return this;
    };

    /**
     * Hide main order info.
     * 
     * @return {View} self object.
     *
     * @public
     */
    this.backToOrders = function() {
        mainOrder.classList.add("hidden");
        return this;
    };

    /**
     * Add map to additional info
     * 
     * @param {Object} order object of order.
     * 
     * @param {HTMLDivElement} container element to append map.
     * 
     * @return {View} self object.
     *
     * @public
     */
    this.addMap = function(order, container) {
        var geocoder,
            map,
            address = order.shipTo.address + order.shipTo.region + order.shipTo.country;

        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var myOptions = {
            zoom: 14,
            minZoom: 4,
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
                        alert("There is no such address");
                    }
                } else {
                    alert("There is no such address");
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        }

        return this;
    };

    /**
     * Returns the ordersList element.
     *
     * @returns {HTMLUlElement} the ul element.
     */
    this.getOrdersList = function() {
        return ordersList;
    };

    /**
     * Returns the addOrderIcon element.
     *
     * @returns {HTMLIconElement} the icon element.
     */
    this.getAddOrderIcon = function() {
        return addOrderIcon;
    };

    /**
     * Returns the deleteOrderIcon element.
     *
     * @returns {HTMLIconElement} the icon element.
     */
    this.getDeleteOrderIcon = function() {
        return deleteOrderIcon;
    };

    /**
     * Returns the addProductIcon element.
     *
     * @returns {HTMLIconElement} the icon element.
     */
    this.getAddProductIcon = function() {
        return addProductIcon;
    };

    /**
     * Returns the itemsTable element.
     *
     * @returns {HTMLTableElement} the table element.
     */
    this.getItemsTable = function() {
        return itemsTable;
    };

    /**
     * Returns the header of table element.
     *
     * @returns {HTMLTrElement} the table row element.
     */
    this.getItemsTableHeader = function() {
        return itemsTable.firstElementChild;
    };

    /**
     * Returns the orderChosenInfo element.
     *
     * @returns {HTMLFormElement} the form element.
     */
    this.getOrderChosenInfo = function() {
        return orderChosenInfo;
    };

    /**
     * Returns the chooseAdditionOrderInfo element.
     *
     * @returns {HTMLDivElement} the div element.
     */
    this.getChooseAdditionOrderInfo = function() {
        return chooseAdditionOrderInfo;
    };

    /**
     * Returns the iconSearchList element.
     *
     * @returns {HTMLIconElement} the icon element.
     */
    this.getIconSearchList = function() {
        return iconSearchList;
    };

    /**
     * Returns the iconUpdateList element.
     *
     * @returns {HTMLIconElement} the icon element.
     */
    this.getIconUpdateList = function() {
        return iconUpdateList;
    };

    /**
     * Toggles class of the update icon.
     * 
     * @return {View} self object.
     */
    this.toggleUpdateIcon = function() {
        iconUpdateList.classList.toggle("fa-spin");
        return this;
    };

    /**
     * Returns the iconSearchTable element.
     *
     * @returns {HTMLIconElement} the icon element.
     */
    this.getIconSearchTable = function() {
        return iconSearchTable;
    };

    /**
     * Returns the id of current order.
     *
     * @returns {Number} the id of order.
     */
    this.getOrderId = function() {
        return Number.parseInt(mainOrderInfo.getAttribute("data-order-id"));
    };

    /**
     * Returns the addOrderForm element.
     *
     * @returns {HTMLFormElement} the form element.
     */
    this.getAddOrderForm = function() {
        return document.getElementById("add-order-form");
    };

    /**
     * Returns the addProductForm element.
     *
     * @returns {HTMLFormElement} the form element.
     */
    this.getAddProductForm = function() {
        return document.getElementById("add-product-form");
    };

    /**
     * Returns the number of chosen additional info.
     * 
     * @param {HTMLIconElement} iconChoice the icon of chosen info.
     *
     * @returns {Number} the number of chosen info.
     */
    this.getAdditionalInfoId = function(iconChoice) {
        if (iconChoice) {
            return Number.parseInt(iconChoice.getAttribute("data-action"));
        } else {
            return Number.parseInt(orderChosenInfo.getAttribute("data-info"));
        }
    };

    /**
     * Returns the clicked order element.
     * 
     * @param {Event} event the DOM event object.
     *
     * @returns {HTMLLiElement} the order element.
     */
    this.findClickedOrder = function(event) {
        var target = event.target || event.srcElement,
            orderLi = target.matches("li") ? target : target.closest("li");
        return orderLi;
    };

    /**
     * Returns the value of attribute of element.
     * 
     * @param {HTMLElement} element the HTML element.
     * 
     * @param {String} attr the name of attribute.
     *
     * @returns {String} the value of attribute.
     */
    this.getAttr = function(element, attr) {
        return element.getAttribute(attr);
    };

    /**
     * Add class to element.
     * 
     * @param {HTMLElement} element the HTML element.
     * 
     * @param {String} cls the name of class.
     * 
     * @return {View} self object.
     */
    this.addClass = function(element, cls) {
        element.classList.add(cls);
        return this;
    };

    /**
     * Close the form.
     * 
     * @param {Event.target} target the event.target object.
     * 
     * @param {HTMLElement} background the HTML element.
     * 
     * @return {View} self object.
     */
    this.closeBackground = function(target, background) {
        if (target.matches("DIV") || target.matches("I")) {
            while (background.firstChild) {
                background.removeChild(background.firstChild);
            }
            background.remove();
        }
        return this;
    };

    /**
     * Changes sort state of table.
     * 
     * @param {Number} sortState the number of sort state.
     * 
     * @return {View} self object.
     */
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

        return this;
    };

    /**
     * Removes chosen-order class from all siblings.
     * 
     * @param {HTMLLiElement} element the html li element.
     * 
     * @return {View} self object.
     */
    this.removeClsFromSiblings = function(element) {
        firstLi = element.parentNode.firstElementChild;
        do {
            if (firstLi !== element) {
                firstLi.classList.remove("chosen-order");
            }
        } while (firstLi = firstLi.nextElementSibling);

        return this;
    };

    /**
     * Shows form for adding order.
     * 
     * @return {Node} container of form.
     */
    this.showAddOrderForm = function() {
        var background = orderDivTemplate.cloneNode(true);
        background.className = "background-dialog";
        background.innerHTML = `<div id="cancel-form"><i class="fas fa-times"></i></div>
                                <form action="" id="add-order-form">
                                    <h2>Add order</h2>
                                    <label data-req>Customer:<input type="text" placeholder="Customer" required id="input-customer"></label>

                                    <h3>Shipping Address</h3>
                                    <label>Name:<input type="text" placeholder="Name" id="input-name-ship"></label>
                                    <label>Address:<input type="text" placeholder="Address" id="input-address-ship"></label>
                                    <label>ZIP:<input type="text" placeholder="ZIP" id="input-zip-ship"></label>
                                    <label>Region:<input type="text" placeholder="Region" id="input-region-ship"></label>
                                    <label>Country:<input type="text" placeholder="Country" id="input-country-ship"></label>
                                    <h3>Customer Information</h3>
                                    <label>First name:<input type="text" placeholder="First name" id="input-first-name-customer"></label>
                                    <label>Last name:<input type="text" placeholder="Last name" id="input-last-name-customer"></label>
                                    <label>Address:<input type="text" placeholder="Address" id="input-address-customer"></label>
                                    <label>Phone number:<input type="tel" placeholder="Phone number" id="input-phone-customer"></label>
                                    <label>Email:<input type="email" placeholder="Email" id="input-email-customer"></label>
                                    <input type="submit" value="Add order" id="add-order-submit">
                                </form>`;
        document.body.insertBefore(background, document.body.firstChild);
        return background;
    };

    /**
     * Shows form for adding product.
     * 
     * @return {Node} container of form.
     */
    this.showAddProductForm = function() {
        var background = orderDivTemplate.cloneNode(true);
        background.className = "background-dialog";
        background.innerHTML = `<div id="cancel-form"><i class="fas fa-times"></i></div>
                            <form action="" id="add-product-form">
                                <h2>Add product</h2>
                                <label data-req>Name:<input type="text" required id="input-name-product"></label>
                                <label data-req>Price:<input type="number" required id="input-price-product"></label>
                                <label data-req>Currency:<input type="text" required id="input-currency-product"></label>
                                <label data-req>Quantity:<input type="number" required id="input-quantity-product"></label>
                                <input type="submit" value="Add product" id="add-product-submit">
                            </form>`;
        document.body.insertBefore(background, document.body.firstChild);
        return background;
    };

    /**
     * Return array of values from adding order form.
     * 
     * @return {String[]} array of received from form values.
     */
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

    /**
     * Return array of values from adding product form.
     * 
     * @return {String[]} array of received from form values.
     */
    this.getAddProductFormValues = function() {
        var arrayOfValues = [];

        var nameProductValue = document.getElementById("input-name-product").value,
            priceProductValue = document.getElementById("input-price-product").value,
            currencyProductValue = document.getElementById("input-currency-product").value,
            quantityProductValue = document.getElementById("input-quantity-product").value;

        arrayOfValues.push(nameProductValue, priceProductValue, currencyProductValue, quantityProductValue);

        return arrayOfValues;
    };

    /**
     * Return array of values from editing order shipping form.
     * 
     * @return {String[]} array of received from form values.
     */
    this.updateOrderShipValues = function() {
        var arrayOfValues = [];

        var nameShipLocalValue = document.getElementById("input-name-ship-local").value,
            addressShipLocalValue = document.getElementById("input-address-ship-local").value,
            zipShipLocalValue = document.getElementById("input-zip-ship-local").value,
            regionShipLocalValue = document.getElementById("input-region-ship-local").value,
            countryShipLocalValue = document.getElementById("input-country-ship-local").value;

        arrayOfValues.push(nameShipLocalValue, addressShipLocalValue, zipShipLocalValue, regionShipLocalValue, countryShipLocalValue);
        originalShipInfo = [];
        originalShipInfo.push(nameShipLocalValue, addressShipLocalValue, zipShipLocalValue, regionShipLocalValue, countryShipLocalValue);

        return arrayOfValues;
    };

    /**
     * Return array of values from editing order customer form.
     * 
     * @return {String[]} array of received from form values.
     */
    this.updateOrderCustomerValues = function() {
        var arrayOfValues = [];

        var firstNameCustomerLocalValue = document.getElementById("input-first-customer-local").value,
            lastNameCustomerLocalValue = document.getElementById("input-last-customer-local").value,
            addressCustomerLocalValue = document.getElementById("input-addres-customer-local").value,
            phoneCustomerLocalValue = document.getElementById("input-phone-customer-local").value,
            emailCustomerLocalValue = document.getElementById("input-email-customer-local").value;

        arrayOfValues.push(firstNameCustomerLocalValue, lastNameCustomerLocalValue, addressCustomerLocalValue, phoneCustomerLocalValue, emailCustomerLocalValue);
        originalCustomerInfo = [];
        originalCustomerInfo.push(firstNameCustomerLocalValue, lastNameCustomerLocalValue, addressCustomerLocalValue, phoneCustomerLocalValue, emailCustomerLocalValue);

        return arrayOfValues;
    };

    /**
     * Delete chosen-action class from all tabs.
     * 
     * @return {View} self object.
     */
    this.deleteChosenClassFromTabs = function() {
        Array.prototype.forEach.call(chooseAdditionOrderInfo.querySelectorAll("div"), function(item) {
            item.classList.remove("chosen-action");
        });
        return this;
    };

    /**
     * Delete all sorts.
     * 
     * @return {View} self object.
     */
    this.deleteSorts = function() {
        Array.prototype.forEach.call(itemsTable.firstElementChild.querySelectorAll("i"), function(icon) {
            icon.setAttribute("data-state", "1");
            icon.className = "fas fa-angle-up";
        });

        return this;
    };

    /**
     * Delete all sorts except chosen.
     * 
     * @param {HTMLIconElement} iconSort icon of the chosen sorting action.
     * 
     * @return {View} self object.
     */
    this.deleteOthersSorts = function(iconSort) {
        Array.prototype.forEach.call(itemsTable.firstElementChild.querySelectorAll("i"), function(icon) {
            if (iconSort != icon) {
                icon.setAttribute("data-state", "1");
                icon.className = "fas fa-angle-up";
            }
        });

        return this;
    };

    /**
     * Returns icon of chosen sort if we have sorting, else returns null.
     * 
     * @return {HTMLIconElement|null} icon of chosen sort or null.
     */
    this.isHaveSort = function() {
        for (i = 0; i < itemsTable.firstElementChild.querySelectorAll("i").length; i++) {
            if (itemsTable.firstElementChild.querySelectorAll("i")[i].getAttribute("data-state") === "2" ||
                itemsTable.firstElementChild.querySelectorAll("i")[i].getAttribute("data-state") === "3") {
                return itemsTable.firstElementChild.querySelectorAll("i")[i];
            }
        }
        return null;
    };
}