var orderShortInfo = document.getElementsByClassName("order-short-info")[0],
    ordersList = document.getElementsByClassName("orders-list")[0],
    orderListTemplate = document.createElement("li"),
    orderDivTemplate = document.createElement("div"),
    orderName = document.createElement("h2"),
    orderFillFieldTemplate = document.createElement("p");

var orderInfo = document.getElementsByClassName("order-info")[0],
    mainOrderInfo = document.getElementsByClassName("main-order-info")[0],
    priceOrderInfo = document.getElementsByClassName("price-order-info")[0],
    chooseAdditionOrderInfo = document.getElementsByClassName("choose-addition-order-info")[0],
    additionOrderInfo = document.getElementsByClassName("addition-order-info")[0],
    orderChosenInfo = document.getElementById("order-chosen-info"),
    orderItems = document.getElementsByClassName("order-items")[0],
    itemsTable = orderItems.firstElementChild.nextElementSibling.nextElementSibling,
    i,
    k,
    target;

var iconSearchList = document.getElementsByClassName("fa-search")[0],
    inputSearchList = document.getElementById("input-search-list"),
    iconSearchTable = document.getElementsByClassName("fa-search")[1],
    inputSearchTable = document.getElementById("input-search-table");

var copyOforiginalProducts = Orders.map(function (item) {
    return item.products;
});

createOrderListTemplate();

createOrdersList();

setSortingActions();

//click on order from list
ordersList.addEventListener("click", function (event) {
    target = event.target || event.srcElement, orderLi = target.matches("li") ? target : target.closest("li");
    if (orderLi) {
        var id = orderLi.getAttribute("data-order-id");
        orderLi.classList.add("chosen-order");

        //remove chosen-order from all siblings
        firstLi = orderLi.parentNode.firstElementChild;
        do {
            if (firstLi !== orderLi) {
                firstLi.classList.remove("chosen-order");
            }
        } while (firstLi = firstLi.nextElementSibling);

        for (i = 0; i < Orders.length; i++) {
            if (Orders[i].id === id) {
                fillWithDataOrderTemplate(i);
            }
        }
    }
});

//realisation of tab-switch
chooseAdditionOrderInfo.addEventListener("click", function (event) {
    target = event.target || event.srcElement, iconChoice = target.matches(".icon-choice") ? target : target.closest(".icon-choice");
    if (iconChoice) {
        var orderId = mainOrderInfo.getAttribute("data-order-id"),
            numberOfCommand = Number.parseInt(iconChoice.getAttribute("data-action"));
        switch (numberOfCommand) {
            case 1:
                iconChoice.classList.add("chosen-action");
                iconChoice.nextElementSibling.classList.remove("chosen-action");
                for (i = 0; i < Orders.length; i++) {
                    if (Orders[i].id === orderId) {
                        additionOrderInfo.firstElementChild.innerHTML = "Shipping Address";
                        orderChosenInfo.innerHTML = "\n                            <label>Name: <input type=\"text\" value=\"" + Orders[i].ShipTo.name + "\" readonly></label>\n                            <label>Street: <input type=\"text\" value=\"" + Orders[i].ShipTo.Address + "\" readonly></label>\n                            <label>ZIP Code / City: <input type=\"text\" value=\"" + Orders[i].ShipTo.ZIP + "\" readonly></label>\n                            <label>Region: <input type=\"text\" value=\"" + Orders[i].ShipTo.Region + "\" readonly></label>\n                            <label>Country: <input type=\"text\" value=\"" + Orders[i].ShipTo.Country + "\" readonly></label>";
                    }
                }
                break;
            case 2:
                iconChoice.classList.add("chosen-action");
                iconChoice.previousElementSibling.classList.remove("chosen-action");
                for (i = 0; i < Orders.length; i++) {
                    if (Orders[i].id === orderId) {
                        additionOrderInfo.firstElementChild.innerHTML = "Customer Information";
                        orderChosenInfo.innerHTML = "\n                            <label>First Name: <input type=\"text\" value = \"" + Orders[i].CustomerInfo.firstName + "\" readonly></label>\n                            <label>Last Name: <input type=\"text\" value = \"" + Orders[i].CustomerInfo.lastName + "\" readonly></label>\n                            <label>Address: <input type=\"text\" value = \"" + Orders[i].CustomerInfo.address + "\" readonly></label>\n                            <label>Phone: <input type=\"text\" value = \"" + Orders[i].CustomerInfo.phone + "\" readonly></label>\n                            <label>Email: <input type=\"text\" value = \"" + Orders[i].CustomerInfo.email + "\" readonly></label>";
                    }
                }
                break;
        }
    }
});

//search from orders list
iconSearchList.addEventListener("click", function () {
    var requestString = inputSearchList.value.trim().toLowerCase(),
        arrayOfPositiveOrders = [];
    for (i = 0; i < Orders.length; i++) {
        for (var key in Orders[i].OrderInfo) {
            if (Orders[i].OrderInfo[key].toLowerCase().match(requestString)) {
                arrayOfPositiveOrders.push(Orders[i]);
            }
        }
    }
    uniquearrayOfPositiveOrders = arrayOfPositiveOrders.filter(function (item, pos) {
        return arrayOfPositiveOrders.indexOf(item) == pos;
    });
    createOrdersList(uniquearrayOfPositiveOrders);
});

//search from table of items
iconSearchTable.addEventListener("click", searchTable);

//create template of order in list
function createOrderListTemplate() {
    orderShortInfo.firstElementChild.lastElementChild.innerHTML = "Orders (" + Orders.length + ")";

    orderListTemplate.className = "order-single";

    var orderBasicInfo = orderDivTemplate.cloneNode(true);
    orderBasicInfo.className = "basic-info";
    orderBasicInfo.appendChild(orderName.cloneNode(true));
    orderBasicInfo.appendChild(orderFillFieldTemplate.cloneNode(true));
    orderBasicInfo.appendChild(orderFillFieldTemplate.cloneNode(true));

    var orderTimeInfo = orderDivTemplate.cloneNode(true);
    orderTimeInfo.className = "time-info";
    orderTimeInfo.appendChild(orderFillFieldTemplate.cloneNode(true));
    orderTimeInfo.appendChild(orderFillFieldTemplate.cloneNode(true));

    orderListTemplate.appendChild(orderBasicInfo);
    orderListTemplate.appendChild(orderTimeInfo);
}

//filling template of order in list
function createOrdersList(arrayOfOrders) {
    var numberOfOrders, filterOrders;

    //Clean ordersList
    while (ordersList.firstChild) {
        ordersList.removeChild(ordersList.firstChild);
    }

    //Checking if exist sorted list of orders
    if (arrayOfOrders) {
        numberOfOrders = arrayOfOrders.length;
        filterOrders = arrayOfOrders;
    } else {
        numberOfOrders = Orders.length;
        filterOrders = Orders;
    }

    for (i = 0; i < numberOfOrders; i++) {
        var orderListSingle = orderListTemplate.cloneNode(true);
        orderListSingle.setAttribute("data-order-id", "" + filterOrders[i].id);

        orderListSingle.firstElementChild.firstElementChild.innerHTML = "Order " + filterOrders[i].id;
        orderListSingle.firstElementChild.firstElementChild.nextElementSibling.innerHTML = "" + filterOrders[i].OrderInfo.customer;
        orderListSingle.firstElementChild.lastElementChild.innerHTML = "Shipped: " + filterOrders[i].OrderInfo.shippedAt;

        orderListSingle.lastElementChild.firstElementChild.innerHTML = "" + filterOrders[i].OrderInfo.createdAt;
        if (filterOrders[i].OrderInfo.status === "Accepted") {
            orderListSingle.lastElementChild.lastElementChild.innerHTML = "In time";
            orderListSingle.lastElementChild.lastElementChild.className = "is-in-time";
        } else {
            orderListSingle.lastElementChild.lastElementChild.innerHTML = "Urgent";
            orderListSingle.lastElementChild.lastElementChild.className = "is-urgent";
        }
        ordersList.appendChild(orderListSingle);
    }
}

function fillWithDataOrderTemplate(i, arrayOfPositiveProducts) {

    // First Section
    var dataList = mainOrderInfo.firstElementChild.nextElementSibling,
        totalPriceOfOrder = 0;

    mainOrderInfo.setAttribute("data-order-id", "" + Orders[i].id);
    mainOrderInfo.firstElementChild.innerHTML = "Order " + Orders[i].id;
    dataList.firstElementChild.innerHTML = "Customer: " + Orders[i].OrderInfo.customer;
    dataList.firstElementChild.nextElementSibling.innerHTML = "Ordered: " + Orders[i].OrderInfo.createdAt;
    dataList.lastElementChild.innerHTML = "Shipped: " + Orders[i].OrderInfo.shippedAt;
    for (k = 0; k < Orders[i].products.length; k++) {
        totalPriceOfOrder += Number.parseFloat(Orders[i].products[k].totalPrice);
    }
    priceOrderInfo.firstElementChild.innerHTML = "" + totalPriceOfOrder;
    priceOrderInfo.lastElementChild.innerHTML = "EUR";

    mainOrderInfo.lastElementChild.firstElementChild.classList.add("chosen-action");
    mainOrderInfo.lastElementChild.firstElementChild.nextElementSibling.classList.remove("chosen-action");

    // Second Section (form)
    additionOrderInfo.firstElementChild.innerHTML = "Shipping Address";
    orderChosenInfo.innerHTML = "\n                            <label>Name: <input type=\"text\" value=\"" + Orders[i].ShipTo.name + "\" readonly></label>\n                            <label>Street: <input type=\"text\" value=\"" + Orders[i].ShipTo.Address + "\" readonly></label>\n                            <label>ZIP Code / City: <input type=\"text\" value=\"" + Orders[i].ShipTo.ZIP + "\" readonly></label>\n                            <label>Region: <input type=\"text\" value=\"" + Orders[i].ShipTo.Region + "\" readonly></label>\n                            <label>Country: <input type=\"text\" value=\"" + Orders[i].ShipTo.Country + "\" readonly></label>";

    // Third Section
    orderItems.firstElementChild.innerHTML = "Line items (" + Orders[i].products.length + ")";
    var rowItemsTemplate = document.createElement("tr"),
        columnItemsTemplate = document.createElement("td"),
        itemName = document.createElement("h3"),
        itemProductInfo = columnItemsTemplate.cloneNode(true),
        itemPriceInfo = columnItemsTemplate.cloneNode(true),
        itemQuantityInfo = columnItemsTemplate.cloneNode(true),
        itemTotalInfo = columnItemsTemplate.cloneNode(true);

    itemProductInfo.className = "item-product";
    itemPriceInfo.className = "item-price";
    itemQuantityInfo.className = "item-quantity";
    itemTotalInfo.className = "item-total";

    itemProductInfo.appendChild(itemName);
    itemProductInfo.appendChild(orderFillFieldTemplate);

    rowItemsTemplate.appendChild(itemProductInfo);
    rowItemsTemplate.appendChild(itemPriceInfo);
    rowItemsTemplate.appendChild(itemQuantityInfo);
    rowItemsTemplate.appendChild(itemTotalInfo);

    //Clean all rows before updating new
    while (itemsTable.firstElementChild.nextElementSibling) {
        itemsTable.removeChild(itemsTable.firstElementChild.nextElementSibling);
    }

    sortItemsTable(i);

    if (arrayOfPositiveProducts) {
        for (k = 0; k < arrayOfPositiveProducts.length; k++) {

            var rowItemSingle = rowItemsTemplate.cloneNode(true);

            rowItemSingle.firstElementChild.firstElementChild.innerHTML = "" + arrayOfPositiveProducts[k].name;
            rowItemSingle.firstElementChild.lastElementChild.innerHTML = "" + arrayOfPositiveProducts[k].id;

            rowItemSingle.firstElementChild.nextElementSibling.innerHTML = "<strong>" + arrayOfPositiveProducts[k].price + "</strong> " + arrayOfPositiveProducts[k].currency;

            rowItemSingle.lastElementChild.previousElementSibling.innerHTML = "" + arrayOfPositiveProducts[k].quantity;

            rowItemSingle.lastElementChild.innerHTML = "<strong>" + arrayOfPositiveProducts[k].totalPrice + "</strong> " + arrayOfPositiveProducts[k].currency;

            itemsTable.appendChild(rowItemSingle);
        }
    } else {
        for (k = 0; k < Orders[i].products.length; k++) {

            var rowItemSingle = rowItemsTemplate.cloneNode(true);

            rowItemSingle.firstElementChild.firstElementChild.innerHTML = "" + Orders[i].products[k].name;
            rowItemSingle.firstElementChild.lastElementChild.innerHTML = "" + Orders[i].products[k].id;

            rowItemSingle.firstElementChild.nextElementSibling.innerHTML = "<strong>" + Orders[i].products[k].price + "</strong> " + Orders[i].products[k].currency;

            rowItemSingle.lastElementChild.previousElementSibling.innerHTML = "" + Orders[i].products[k].quantity;

            rowItemSingle.lastElementChild.innerHTML = "<strong>" + Orders[i].products[k].totalPrice + "</strong> " + Orders[i].products[k].currency;

            itemsTable.appendChild(rowItemSingle);
        }
    }

    // Make all visible
    orderInfo.classList.remove("hidden");
    additionOrderInfo.classList.remove("hidden");
    orderItems.classList.remove("hidden");
}

//set icons of sorting
function setSortingActions() {
    itemsTable.firstElementChild.addEventListener("click", function (event) {
        target = event.target || event.srcElement, iconSort = target.matches("I") ? target : target.closest("I");
        if (iconSort) {
            Array.prototype.forEach.call(itemsTable.firstElementChild.querySelectorAll("i"), function (icon) {
                if (iconSort !== icon) {
                    icon.setAttribute("data-state", "1");
                    icon.className = "fas fa-angle-up";
                }
            });

            var sortState = Number.parseInt(iconSort.getAttribute("data-state"));
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

            var orderId = Number.parseInt(mainOrderInfo.getAttribute("data-order-id")) - 1;

            sortItemsTable(orderId, iconSort);
        }
    });
}

//realization of sorting
function sortItemsTable(orderId, iconSort) {
    if (iconSort) {
        var sortType = iconSort.getAttribute("data-sort-type"),
            sortState = Number.parseInt(iconSort.getAttribute("data-state"));

        if (!inputSearchTable.value) {
            //return products to original
            Orders[orderId].products = copyOforiginalProducts[orderId].map(function (item) {
                return item;
            });
        }

        //now we can sort it
        //increase
        if (sortState === 2 && sortType === "product") {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = a.name,
                    keyB = b.name;
                return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
            });
        }
        if (sortState === 2 && sortType === "price") {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = Number.parseFloat(a.price),
                    keyB = Number.parseFloat(b.price);
                return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
            });
        }
        if (sortState === 2 && sortType === "quantity") {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = Number.parseFloat(a.quantity),
                    keyB = Number.parseFloat(b.quantity);
                return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
            });
        }
        if (sortState === 2 && sortType === "total") {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = Number.parseFloat(a.totalPrice),
                    keyB = Number.parseFloat(b.totalPrice);
                return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
            });
        }
        //decrease
        if (sortState === 3 && sortType === "product") {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = a.name,
                    keyB = b.name;
                return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
            });
        }
        if (sortState === 3 && sortType === "price") {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = Number.parseFloat(a.price),
                    keyB = Number.parseFloat(b.price);
                return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
            });
        }
        if (sortState === 3 && sortType === "quantity") {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = Number.parseFloat(a.quantity),
                    keyB = Number.parseFloat(b.quantity);
                return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
            });
        }
        if (sortState === 3 && sortType === "total") {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = Number.parseFloat(a.totalPrice),
                    keyB = Number.parseFloat(b.totalPrice);
                return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
            });
        }
        //normal
        if (sortState === 1) {
            Orders[orderId].products.sort(function (a, b) {
                var keyA = a.id,
                    keyB = b.id;
                return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
            });
        }

        fillWithDataOrderTemplate(orderId);
    } else {
        Array.prototype.forEach.call(itemsTable.firstElementChild.querySelectorAll("i"), function (icon) {
            if (Number.parseInt(icon.getAttribute("data-state")) !== 1) {
                var sortType = icon.getAttribute("data-sort-type"),
                    sortState = Number.parseInt(icon.getAttribute("data-state"));

                if (!inputSearchTable.value) {
                    //return products to original
                    Orders[orderId].products = copyOforiginalProducts[orderId].map(function (item) {
                        return item;
                    });
                }

                //now we can sort it
                //increase
                if (sortState === 2 && sortType === "product") {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = a.name,
                            keyB = b.name;
                        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
                    });
                }
                if (sortState === 2 && sortType === "price") {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = Number.parseFloat(a.price),
                            keyB = Number.parseFloat(b.price);
                        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
                    });
                }
                if (sortState === 2 && sortType === "quantity") {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = Number.parseFloat(a.quantity),
                            keyB = Number.parseFloat(b.quantity);
                        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
                    });
                }
                if (sortState === 2 && sortType === "total") {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = Number.parseFloat(a.totalPrice),
                            keyB = Number.parseFloat(b.totalPrice);
                        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
                    });
                }
                //decrease
                if (sortState === 3 && sortType === "product") {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = a.name,
                            keyB = b.name;
                        return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
                    });
                }
                if (sortState === 3 && sortType === "price") {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = Number.parseFloat(a.price),
                            keyB = Number.parseFloat(b.price);
                        return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
                    });
                }
                if (sortState === 3 && sortType === "quantity") {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = Number.parseFloat(a.quantity),
                            keyB = Number.parseFloat(b.quantity);
                        return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
                    });
                }
                if (sortState === 3 && sortType === "total") {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = Number.parseFloat(a.totalPrice),
                            keyB = Number.parseFloat(b.totalPrice);
                        return keyA < keyB ? 1 : keyA > keyB ? -1 : 0;
                    });
                }
                //normal
                if (sortState === 1) {
                    Orders[orderId].products.sort(function (a, b) {
                        var keyA = a.id,
                            keyB = b.id;
                        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
                    });
                }
            }
        });
    }
}

//realization of search in table of items
function searchTable() {
    var requestString = inputSearchTable.value.trim().toLowerCase(),
        arrayOfPositiveProducts = [],
        orderId = Number.parseInt(mainOrderInfo.getAttribute("data-order-id")) - 1;
    if (requestString === "") {
        fillWithDataOrderTemplate(orderId, copyOforiginalProducts[orderId]);
    } else {

        for (i = 0; i < Orders[orderId].products.length; i++) {
            for (var key in Orders[orderId].products[i]) {
                if (Orders[orderId].products[i][key].toLowerCase().match(requestString)) {
                    arrayOfPositiveProducts.push(Orders[orderId].products[i]);
                }
            }
        }
        uniquearrayOfPositiveProducts = arrayOfPositiveProducts.filter(function (item, pos) {
            return arrayOfPositiveProducts.indexOf(item) == pos;
        });

        Orders[orderId].products = uniquearrayOfPositiveProducts.map(function (item) {
            return item;
        });
        fillWithDataOrderTemplate(orderId, uniquearrayOfPositiveProducts);
    }
}