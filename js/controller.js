/**
 * Controller class. Orchestrates the model and view objects. A "glue" between them.
 *
 * @param {View} view view instance.
 * @param {Model} model model instance.
 *
 * @constructor
 */
function Controller(view, model) {

    /**
     * Initialize controller.
     *
     * @public
     */
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
            iconUpdateList = view.getIconUpdateList(),
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
        iconUpdateList.addEventListener("click", this._onUpdateListIconClick);
        iconSearchTable.addEventListener("click", this._onSearchTableIconClick);
    };

    /**
     * Order from list click event handler.
     *
     * @listens click
     *
     * @param {Event} event the DOM event object.
     *
     * @private
     */
    this._onOrderFromListClick = function(event) {
        var orderLi = view.findClickedOrder(event);
        if (orderLi) {
            var id = Number.parseInt(view.getAttr(orderLi, "data-order-id")),
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

    /**
     * Add order icon click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onAddOrderIconClick = function() {
        var background = view.showAddOrderForm();

        background.addEventListener("click", function(event) {
            target = event.target || event.srcElement;
            view.closeBackground(target, background);
        });

        var addOrderForm = view.getAddOrderForm();

        addOrderForm.addEventListener("submit", function(event) {

            event.preventDefault();

            var arrayOfValues = view.getAddOrderFormValues();

            model.postOrder(arrayOfValues).then(function() {
                return model.getData();
            }).then(function(orders) {
                view.createOrdersList(orders);
                view.closeBackground(background, background);
            });
        });
    };

    /**
     * Delete order icon click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onDeleteOrderIconClick = function() {
        var isAccepted = confirm("Are you sure you want to delete this order?");
        if (isAccepted) {
            id = view.getOrderId();
            model.deleteOrder(id).then(function() {
                view.backToOrders();
                return model.getData();
            }).then(function(orders) {
                view.createOrdersList(orders);
            });
        }
    };

    /**
     * Add product icon click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onAddProductIconClick = function() {
        var id = view.getOrderId(),
            background = view.showAddProductForm();

        background.addEventListener("click", function(event) {
            target = event.target || event.srcElement;
            view.closeBackground(target, background);
        });

        var addProductForm = view.getAddProductForm();

        addProductForm.addEventListener("submit", function(event) {

            event.preventDefault();

            var arrayOfValues = view.getAddProductFormValues();

            model.postProduct(id, arrayOfValues).then(function(id) {
                return model.getData(id, true);
            }).then(function(products) {
                view.fillTable(products);
                view.closeBackground(background, background);
            });

            view.deleteSorts();
        });
    };

    /**
     * Delete product icon click event handler.
     *
     * @listens click
     * 
     * @param {Event} event the DOM event object.
     *
     * @private
     */
    this._onDeleteProductIconClick = function(event) {
        target = event.target || event.srcElement, trashSection = target.matches(".item-trash") ? target : target.closest(".item-trash");
        if (trashSection) {
            var isAccepted = confirm("Are you sure you want to delete this product?");
            if (isAccepted) {
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
        }
    };

    /**
     * Save shipping or customer info button click event handler.
     *
     * @listens click
     * 
     * @param {Event} event the DOM event object.
     *
     * @private
     */
    this._onSaveAdditionalInfoClick = function(event) {
        event.preventDefault();

        chosenAdditionOrderInfo = view.getAdditionalInfoId();
        id = view.getOrderId();

        if (chosenAdditionOrderInfo === 1) {
            var values = view.updateOrderShipValues();
            model.getData(id).then(function(order) {
                return model.updateOrderShip(order, values);
            }).then(function(id) {
                return model.getData(id);
            }).then(function(order) {
                view.fillWithDataOrderTemplate(order, chosenAdditionOrderInfo);
            });
        };
        if (chosenAdditionOrderInfo === 3) {
            var values = view.updateOrderCustomerValues();
            model.getData(id).then(function(order) {
                return model.updateOrderCustomer(order, values);
            }).then(function(id) {
                return model.getData(id);
            }).then(function(order) {
                view.fillWithDataOrderTemplate(order, chosenAdditionOrderInfo);
            });
        };
    };

    /**
     * Switch addition order info icon click event handler.
     *
     * @listens click
     * 
     * @param {Event} event the DOM event object.
     *
     * @private
     */
    this._onChangeAdditionOrderInfoClick = function(event) {
        target = event.target || event.srcElement,
            iconChoice = target.matches(".icon-choice") ? target : target.closest(".icon-choice");
        if (iconChoice) {
            id = view.getOrderId();
            var numberOfCommand = view.getAdditionalInfoId(iconChoice),
                currentCommand = view.getAdditionalInfoId();

            if (numberOfCommand === currentCommand) {
                return;
            }

            view.deleteChosenClassFromTabs();

            model.getData(id).then(function(order) {
                view.switchTab(order, numberOfCommand);
            });
        }
    };

    /**
     * Sort product icon click event handler.
     *
     * @listens click
     * 
     * @param {Event} event the DOM event object.
     *
     * @private
     */
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

    /**
     * Search orders icon click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onSearchListIconClick = function() {
        model.getData().then(function(orders) {
            view.searchList(orders);
        });
    };

    /**
     * Update orders icon click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onUpdateListIconClick = function() {
        view.toggleUpdateIcon();
        model.getData().then(function(orders) {
            view.searchList(orders);
            view.toggleUpdateIcon();
        });
    };

    /**
     * Search products icon click event handler.
     *
     * @listens click
     *
     * @private
     */
    this._onSearchTableIconClick = function() {
        orderId = view.getOrderId();
        model.getData(orderId, true).then(function(products) {
            view.searchTable(products);
        });
    };
}

new Controller(new View(), new Model()).init();