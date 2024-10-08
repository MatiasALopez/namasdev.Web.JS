/*!
 * namasdev JS
 *
 * @version 1.0.0
 * @author Matias Lopez - https://github.com/MatiasALopez
 * @link https://github.com/MatiasALopez/namasdev.Web.JS
 * @copyright 2024 Matias Lopez
 * @license Released under the MIT license.
 */
"use strict";

var nmd = function () {

    var utils = function () {
        function stringFormat(format, ...args) {
            if (!format) {
                return format;
            }

            var values =
                $.isArray(args[0])
                    ? args[0]
                    : args;

            for (var i = 0; i < values.length; i++) {
                format = format.replace(new RegExp("\\{" + i + "\\}", "gm"), values[i]);
            }

            return format;
        }

        function repeatString(string, times) {
            var repeatedString = "";
            while (times > 0) {
                repeatedString += string;
                times--;
            }
            return repeatedString;
        }

        function throttle(func, wait, options) {
            var context, args, result;
            var timeout = null;
            var previous = 0;
            if (!options) options = {};
            var later = function () {
                previous = options.leading === false ? 0 : Date.now();
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            };
            return function () {
                var now = Date.now();
                if (!previous && options.leading === false) previous = now;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        };

        function round(value, precision) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }

        function createDateTimeFromUnixTimestamp(unixTimestamp) {
            return new Date(parseInt(unixTimestamp.match(/\d+/g)[0]));
        }

        return {
            stringFormat,
            repeatString,
            throttle,
            round,
            createDateTimeFromUnixTimestamp,
        };
    }();

    var format = function () {
        var culture = 'es-ES',
            yearFormat = 'numeric',
            monthAndDayFormat = '2-digit',
            hourAndMinuteFormat = '2-digit';

        function formateDate(date) {
            return new Date(date).toLocaleDateString(culture, { year: yearFormat, month: monthAndDayFormat, day: monthAndDayFormat });
        }

        function formateDateTime(date) {
            return new Date(date).toLocaleDateString(culture, { year: yearFormat, month: monthAndDayFormat, day: monthAndDayFormat, hour: hourAndMinuteFormat, minute: hourAndMinuteFormat, hour12: false });
        }

        function formatDateTimeFromUnixTimestamp(unixTimestamp) {
            return formateDateTime(createDateTimeFromUnixTimestamp(unixTimestamp));
        }

        function formatNumber(number, decimalDigits) {
            return numeral(number).format('0,0.' + repeatString('0', decimalDigits));
        }

        return {
            formateDate,
            formateDateTime,
            formatDateTimeFromUnixTimestamp,
            formatNumber,
        };
    }();

    var page = function () {
        function print() {
            window.print();
        }

        function getQueryStringObject() {
            var pairs = window.location.search.slice(1).split('&');

            var obj = {},
                pair;
            var len = pairs.length;
            if (window.location.search && len) {
                for (var i = 0; i < len; i++) {
                    pair = pairs[i].split('=');
                    if (pair.length == 2) {
                        obj[pair[0]] = decodeURIComponent(pair[1] || '');
                    }
                }
            }

            return obj;
        }

        function reloadPage() {
            window.location = window.location;
        }

        function isSmallScreen() {
            return window.matchMedia("(max-width: 767px)").matches;
        }

        function disableF5Refresh() {
            $(document).on('keydown', function (event) {
                return (event.which || event.keyCode) != 116;
            });
        }

        function disableCopyAndPaste(selector) {
            $(selector || document).on("cut copy paste", function (e) {
                e.preventDefault();
                return false;
            });
        }

        return {
            print,
            getQueryStringObject,
            reloadPage,
            isSmallScreen,
            disableF5Refresh,
            disableCopyAndPaste,
        };
    }();

    var ui = function () {

        var controls = function () {

            function clearControls(selector) {
                var $controls = $(selector);

                $controls.filter('input, select, textarea').val('');
                $controls.filter(':radio,:checkbox').prop('checked', false);
                clearBootstrapCustomFileInput(selector);
            }

            var autopostbackConstants = {
                class: {
                    autopostback: 'autopostback'
                }
            };

            function initAutopostback() {
                $('.' + autopostbackConstants.class.autopostback).on('change', function () {
                    var $this = $(this),
                        $form = $this.closest('form'),
                        hiddenField = $this.data('autopostback-hf');

                    if (hiddenField) {
                        var parts = hiddenField.split('=');
                        if (parts.length == 2) {
                            $form.append('<input type="hidden" name="' + parts[0] + '" value="' + parts[1] + '" />')
                        }
                    }

                    $form.submit();
                });

                $(document).on('change', utils.stringFormat('input.{0},select.{0},textarea.{0}', autopostbackConstants.class.autopostback), function () {
                    $(this).closest('form').submit();
                });
            }

            // Alert
            function showAlert(selector, message, alertType) {
                $(selector)
                    .show()
                    .html(message)
                    .attr('class', 'alert alert-' + alertType);
            }

            function hideAlert(selector) {
                $(selector)
                    .hide()
                    .empty()
                    .attr('class', '');
            }
            //---

            function initPrintButton() {
                $('.btn-print').on('click', function (ev) {
                    ev.preventDefault();
                    page.print();
                    return false;
                });
            }

            function initScrollFocus() {
                var $scrollFocus = $('.scroll-focus');
                if ($scrollFocus.length > 0) {
                    $([document.documentElement, document.body])
                        .animate({ scrollTop: $scrollFocus.first().offset().top - 30 }, 1000);
                }
            }

            var inputFileButtonsConstants = {
                dataAttr: {
                    inputFile: 'input-file',
                    autopostbackHF: 'autopostback-hf',
                },
            };

            function initInputFileButtons() {
                $(utils.stringFormat('input[data-{0}],button[data-{0}]', inputFileButtonsConstants.dataAttr.inputFile))
                    .each(function () {
                        var $btn = $(this),
                            file = $btn.data(inputFileButtonsConstants.dataAttr.inputFile),
                            $file = $('#' + file);

                        if (!$file.hasClass('d-none')) {
                            $file.addClass('d-none');
                        }

                        if ($btn.attr('name')) {
                            var btnName = $btn.attr('name'),
                                btnValue = $btn.attr('value');
                            $file.data(inputFileButtonsConstants.dataAttr.autopostbackHF, btnName + '=' + btnValue);
                        }
                    })
                    .on('click', function (ev) {
                        ev.preventDefault();

                        var $btn = $(this),
                            file = $btn.data(inputFileButtonsConstants.dataAttr.inputFile);

                        $('#' + file).click();

                        return false;
                    });
            }

            var inputFilteringConstants = {
                class: {
                    inputFiltering: 'input-filtering'
                },
                dataAttr: {
                    regex: 'regex'
                }
            };

            function initInputFiltering(selector, options) {
                var optsDefaults = {
                    pattern: null,
                }

                var opts = $.extend({}, optsDefaults, options);

                $(selector || '.' + inputFilteringConstants.class.inputFiltering)
                    .on('keypress', function (ev) {
                        if (!getRegexForInput($(this)).test(String.fromCharCode(ev.keyCode))) {
                            ev.preventDefault();
                        }
                    })
                    .on('input', function () {
                        var $input = $(this),
                            regex = getRegexForInput($input, true);
                        $input.val($input.val().replace(regex, ''));
                    });

                function getRegexForInput($input, negate) {
                    return new RegExp('[' + (negate == true ? '^' : '') + ($input.data(inputFilteringConstants.dataAttr.regex) || opts.pattern) + ']', 'g');
                }
            }

            // bootstrap tooltips (requires: bootstrap)
            function initBootstrapTooltips() {
                $('[data-toggle="tooltip"]').tooltip();
            }
            //---

            // bootstrap custom file input (requires bs-input)
            var customFileInputConstants = {
                class: {
                    input: 'custom-file-input',
                    label: 'custom-file-label',
                },
                dataAttr: {
                    browse: 'browse',
                    browseWithPrefix: 'data-browse',
                    selectedFile: 'selected-file',
                    selectedFileWithPrefix: 'data-selected-file'
                }
            };

            function initBootstrapCustomFileInput(selector, options) {
                var optsDefaults = {
                    browseText: 'Buscar',
                    selectedFileText: '...',
                }

                var opts = $.extend({}, optsDefaults, options);

                var inputBrowseText,
                    inputSelectedFileText;

                $(selector || '.' + customFileInputConstants.class.input).each(function () {
                    var $label = _getBootstrapCustomFileInputLabelForInput($(this));

                    inputBrowseText = $label.attr(customFileInputConstants.dataAttr.browseWithPrefix) || opts.browseText;
                    inputSelectedFileText = $label.attr(customFileInputConstants.dataAttr.selectedFileWithPrefix) || opts.selectedFileText;

                    $label
                        .attr(customFileInputConstants.dataAttr.browseWithPrefix, inputBrowseText)
                        .attr(customFileInputConstants.dataAttr.selectedFileWithPrefix, inputSelectedFileText)
                        .text(inputSelectedFileText);
                });

                bsCustomFileInput.init();
            }

            function clearBootstrapCustomFileInput(selector) {
                $(selector || '.' + customFileInputConstants.class.input).each(function () {
                    var $label = _getBootstrapCustomFileInputLabelForInput($(this));
                    $label.text($label.data(customFileInputConstants.dataAttr.selectedFile));
                });
            }

            function _getBootstrapCustomFileInputLabelForInput($input) {
                return $input.siblings('.' + customFileInputConstants.class.label);
            }
            //---

            // Combos
            function loadCombo(comboId, items, options) {
                var optsDefaults = {
                    emptyOptionText: null,
                    selectAllByDefault: false,
                    destroyAndRecreateSelectpicker: false,
                    itemsValueProperty: 'Value',
                    itemsTextProperty: 'Text',
                    itemsSelectedProperty: 'Selected',
                    itemsSelectedValue: null,
                }

                var opts = $.extend({}, optsDefaults, options);

                var $combo = $('#' + comboId);
                $combo.empty();

                if (opts.emptyOptionText != null) {
                    $combo.append('<option value="">' + opts.emptyOptionText + '</option>')
                }

                $.each(items, function (i, item) {
                    var itemValue = item[opts.itemsValueProperty];
                    var isSelected = opts.itemsSelectedValue === itemValue || item[opts.itemsSelectedProperty] === true;
                    $combo.append('<option value="' + itemValue + '" ' + (isSelected ? 'selected="selected"' : '') + '>' + item[opts.itemsTextProperty] + '</option>');
                });

                var isSelectpicker = $combo.hasClass(selectpickerConstants.class.selectpicker);
                var isMultiselect = $combo.hasClass(multiselectConstants.class.multiselect);
                if (isSelectpicker || isMultiselect) {
                    if (opts.destroyAndRecreateSelectpicker) {
                        $combo.selectpicker('destroy');

                        if (isMultiselect) {
                            initMultiSelect('#' + comboId, $combo.data(multiselectConstants.dataAttr.options));
                        } else {
                            $combo.selectpicker();
                        }
                    } else {
                        $combo
                            .selectpicker('val', $combo.val())
                            .selectpicker('refresh');

                        if (opts.selectAllByDefault && isMultiselect) {
                            $combo.selectpicker('selectAll');
                        }
                    }
                }

                $combo.trigger('change');
            }

            function loadComboAjax(comboId, url, options) {
                // NOTE: see "loadCombo" options also
                var optsDefaults = {
                    loadingEnabled: false,
                    loadingSelector: null,
                    itemsAddedCallback: null,
                    ajaxItemsProperty: 'items',
                    ajaxErrorProperty: 'error',
                    ajaxErrorDefaultMessage: 'An error occurred.',
                }

                var opts = $.extend({}, optsDefaults, options);

                var $combo = $('#' + comboId);
                $combo.empty();

                if (opts.loadingEnabled) {
                    showLoading(opts.loadingSelector);
                }

                $.getJSON(
                    url,
                    function (response) {
                        var error = response[opts.ajaxErrorProperty];
                        if (error) {
                            alert(error);
                            loadCombo(comboId, [], opts);

                            return;
                        }

                        loadCombo(comboId, response[opts.ajaxItemsProperty], opts);

                        if (opts.itemsAddedCallback) {
                            opts.itemsAddedCallback($('#' + comboId));
                        }
                    })
                    .fail(function (error) {
                        alert(opts.ajaxErrorDefaultMessage);
                    })
                    .always(function () {
                        if (opts.loadingEnabled) {
                            hideLoading(opts.loadingSelector);
                        }

                        $combo.trigger('change');
                    });
            }

            function initComboCascadeAjax(comboId, parentComboId, urlFormat, options) {
                var parentComboIdSelector = '#' + parentComboId.replace(',', ',#');

                $(parentComboIdSelector)
                    .on('change', function () {
                        var url = buildUrl();
                        if (!url) {
                            loadCombo(comboId, [], options);
                            return;
                        }

                        loadComboAjax(comboId, buildUrl(), options);
                    });

                function buildUrl() {
                    var hasEmptyIDs = false;

                    var ids = $(parentComboIdSelector).map(function () {
                        var $parentCombo = $(this);
                        var value = $parentCombo.hasClass(multiselectConstants.class.multiselect)
                            ? $parentCombo.val().join(',')
                            : $parentCombo.val();

                        if (!value) {
                            hasEmptyIDs = true;
                        }

                        return value;
                    }).get();

                    return !hasEmptyIDs
                        ? nmd.utils.stringFormat(urlFormat, ids)
                        : null;
                }
            }

            function initComboCascadeJson(comboId, parentComboId, jsonItems, options) {
                var optsDefaults = {
                    comboSelectedValue: null,
                    parentComboSelectedValue: null,
                }

                var opts = $.extend({}, optsDefaults, options);

                var itemsObj = buildItemsObject(jsonItems);

                loadCombo(parentComboId, itemsObj.items, { itemsSelectedValue: opts.parentComboSelectedValue });
                loadComboBasedOnParent(opts.comboSelectedValue);

                $('#' + parentComboId).on('change', function () {
                    loadComboBasedOnParent();
                });

                function buildItemsObject(jsonItems) {
                    var itemsObj = { items: [] };

                    var tmpItems = typeof jsonItems === "string" ? JSON.parse(jsonItems) : jsonItems;
                    var tmpItemsLen = tmpItems.length;
                    var tmpSubItemsLen = 0;
                    for (var i = 0; i < tmpItemsLen; i++) {
                        itemsObj.items.push(tmpItems[i]);
                        itemsObj[tmpItems[i].Value] = {};

                        tmpSubItemsLen = tmpItems[i].Items.length;
                        itemsObj[tmpItems[i].Value] = [];
                        for (var j = 0; j < tmpSubItemsLen; j++) {
                            itemsObj[tmpItems[i].Value].push(tmpItems[i].Items[j]);
                        }
                    }

                    return itemsObj;
                }

                function loadComboBasedOnParent(selectedValue) {
                    var items = [];

                    var parentComboValue = $('#' + parentComboId).val();
                    if (parentComboValue) {
                        items = itemsObj[parentComboValue];
                    }

                    loadCombo(comboId, items, $.extend({}, opts, { itemsSelectedValue: selectedValue }));
                }
            }
            //---

            // Elapsed time (requires: moment)
            var elapsedTimeConstants = {
                dataAttr: {
                    intervalId: 'elapsed-time-interval-id',
                    minutesReachedTriggered: 'elapsed-time-minutes-reached-triggered'
                }
            };

            function initElapsedTime(controlId, dateTimeStart, options) {
                var optsDefaults = {
                    minutesReachedValue: null,
                    minutesReachedCallback: null,
                }

                var opts = $.extend({}, optsDefaults, options);

                var $control = $('#' + controlId);
                if ($control.length === 0) {
                    return;
                }

                var timeStart = moment(dateTimeStart);
                var timeNow = null;

                var intervalId = setInterval(function () {
                    $control = $('#' + controlId);
                    timeNow = moment();

                    var diff = timeNow - timeStart;
                    var diffDuracion = moment.duration(diff);
                    var diffMin = diffDuracion.asMinutes();

                    $control.text(
                        diffMin < 60
                            ? moment(diff).format('mm:ss')
                            : diffDuracion.humanize()
                    );

                    if (opts.minutesReachedValue && opts.minutesReachedCallback
                        && diffMin > opts.minutesReachedValue
                        && !$control.data(elapsedTimeConstants.dataAttr.minutesReachedTriggered)) {
                        try {
                            opts.minutesReachedCallback();
                        } catch (e) { }

                        $control.data(elapsedTimeConstants.dataAttr.minutesReachedTriggered, true);
                    }

                }, 800);

                $control.data(elapsedTimeConstants.dataAttr.intervalId, intervalId);
            }

            function stopElapsedTime(controlId) {
                var intervalId = $('#' + controlId).data(elapsedTimeConstants.dataAttr.intervalId);
                if (intervalId) {
                    clearInterval(parseInt(intervalId));
                }
            }
            //---

            // Tablas
            var tableCheckBoxSelectionConstants = {
                class: {
                    checkBoxSelection: 'checkbox-selection'
                }
            };

            function initTableCheckBoxSelection(tableSelector) {
                tableSelector = tableSelector || '.' + tableCheckBoxSelectionConstants.class.checkBoxSelection;

                var selectAllSelector = 'thead input[type=checkbox]',
                    selectOneSelector = 'tbody input[type=checkbox]',
                    selectAllFullSelector = tableSelector + ' ' + selectAllSelector,
                    selectOneFullSelector = tableSelector + ' ' + selectOneSelector;

                setCheckboxSelectAllState();

                $(tableSelector).on('change', selectAllSelector, function (e) {
                    setCheckboxState(
                        $(selectOneFullSelector),
                        $(this).is(':checked')
                    );
                });

                $(tableSelector).on('change', selectOneSelector, function (e) {
                    setCheckboxSelectAllState();
                });

                function setCheckboxSelectAllState() {
                    if ($(selectOneFullSelector).length == 0) {
                        return;
                    }

                    setCheckboxState(
                        $(selectAllFullSelector),
                        $(selectOneFullSelector + ':not(:checked)').length == 0
                    );
                }

                function setCheckboxState($checkbox, checked) {
                    $checkbox.prop('checked', checked);
                }
            }

            var tableSortingConstants = {
                class: {
                    sortable: 'table-sortable',
                    sortedNone: 'sorted-none',
                    sortedAsc: 'sorted-asc',
                    sortedDesc: 'sorted-desc'
                },
                dataAttr: {
                    sort: 'sort',
                    sortValue: 'sort-value',
                    sortAsc: 'sort-asc',
                    noSort: 'no-sort'
                }
            };

            function initTableSorting(tableSelector) {
                tableSelector = tableSelector || '.' + tableSortingConstants.class.sortable;

                var sortableColHeadSelector = utils.stringFormat('th:not([data-{0}])', tableSortingConstants.dataAttr.noSort);

                setColSortedStatusAndUI();

                $(tableSelector)
                    .on('click', sortableColHeadSelector, function () {
                        var $col = $(this),
                            $tbody = $(tableSelector).find('tbody'),
                            columnIndex = $col.index(),
                            asc = ($col.data(tableSortingConstants.dataAttr.sortAsc) || '1') === '1';

                        $tbody.find('tr').sort(function (tr1, tr2) {
                            var res = getRowColSortValue($(tr1), columnIndex).localeCompare(getRowColSortValue($(tr2), columnIndex));
                            return asc ? res : -res;
                        }).appendTo($tbody);

                        setColSortedStatusAndUI($col, asc);
                    });

                function getRowColSortValue($row, colIndex) {
                    var $col = $row.find(utils.stringFormat('td:nth-child({0})', colIndex + 1));
                    return $col.data(tableSortingConstants.dataAttr.sortValue) || $col.text();
                }

                function setColSortedStatusAndUI($col, asc) {
                    var $theadSortableCols = $(tableSelector + ' ' + sortableColHeadSelector);
                    $theadSortableCols
                        .removeClass(tableSortingConstants.class.sortedNone)
                        .removeClass(tableSortingConstants.class.sortedAsc)
                        .removeClass(tableSortingConstants.class.sortedDesc);

                    $theadSortableCols.addClass(tableSortingConstants.class.sortedNone);

                    if ($col && $col.length == 1) {
                        $col
                            .removeClass(tableSortingConstants.class.sortedNone)
                            .addClass(asc ? tableSortingConstants.class.sortedAsc : tableSortingConstants.class.sortedDesc)
                            .data(tableSortingConstants.dataAttr.sortAsc, asc ? '0' : '1');
                    }
                }
            }

            var tableOrderPOSTConstants = {
                class: {
                    tableOrderPost: 'table-order-post',
                },
                dataAttr: {
                    order: 'order',
                }
            };

            function initTableOrderPOST(tableSelector, options) {
                var optsDefaults = {
                    orderInputName: 'Order',
                };

                var opts = $.extend({}, optsDefaults, options);

                tableSelector = tableSelector || '.' + tableOrderPOSTConstants.class.tableOrderPost;

                var sortableColHeadSelector = utils.stringFormat('th[data-{0}]', tableOrderPOSTConstants.dataAttr.order);

                $(tableSelector)
                    .on('click', sortableColHeadSelector, function () {
                        var $col = $(this),
                            $form = $col.closest('form'),
                            order = $col.data(tableOrderPOSTConstants.dataAttr.order);

                        $form
                            .append('<input type="hidden" name="' + opts.orderInputName + '" value="' + order + '" />')
                            .submit();
                    });
            }
            //---

            // modals (requires: bootbox)
            function initModals(options) {
                var optsDefaults = {
                    locale: 'es',
                    swapButtonOrder: true
                };

                var opts = $.extend({}, optsDefaults, options);
                bootbox.setDefaults(opts);
            }

            function showErrorModal(message, callback) {
                showMessageModal(message, 'danger', 'fa-times-circle', callback);
            }

            function showSuccessModal(message, callback) {
                showMessageModal(message, 'success', 'fa-check-circle', callback);
            }

            function showMessageModal(message, type, icon, callback) {
                bootbox.alert({
                    message: '<div class="mt-3 text-center text-' + type + '">\
<i class="fa ' + icon + ' fa-2x"></i>\
    <div class="mt-1">' + message + '</div>\
</div>',
                    buttons: {},
                    callback
                });
            }

            function showConfirmModal(title, message, callback, options) {
                var optsDefaults = {
                    buttons: {},
                }

                var opts = $.extend({}, optsDefaults, options);

                bootbox.confirm({
                    title: title,
                    message: message,
                    buttons: opts.buttons,
                    callback: callback,
                });
            }
            //---

            // (TODO: try bootbox, requires bootbox)
            var iframeModalsConstants = {
                templates: {
                    modal: '<div class="modal fade" id="{0}" tabindex="-1" role="dialog" aria-labelledby="{0}Label"  aria-hidden="true"><div class="modal-dialog" role="document" ><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="{0}Label"></h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"></div></div></div></div>',
                },
                defaults: {
                    height: '350px',
                },
                dataAttr: {
                    iframe: 'iframe',
                    title: 'iframe-title',
                    modalSize: 'iframe-modal-size',
                    height: 'iframe-height',
                    onHidden: 'iframe-onhidden',
                }
            };

            function initIframeModalsLinks() {
                $(utils.stringFormat('a[data-{0}]', iframeModalsConstants.dataAttr.iframe)).each(function () {
                    var $link = $(this),
                        modalId = 'mdIframe' + Math.floor(Math.random() * 99999),
                        modalSelector = '#' + modalId;

                    if ($(modalSelector).length == 0) {
                        $('body').append(utils.stringFormat(iframeModalsConstants.templates.modal, modalId));
                    }

                    $link
                        .attr('data-toggle', 'modal')
                        .attr('data-target', modalSelector);

                    $(modalSelector)
                        .on('shown.bs.modal', function () {
                            var $modal = $(this),
                                modalTitle = $link.data(iframeModalsConstants.dataAttr.title) || '',
                                modalSize = $link.data(iframeModalsConstants.dataAttr.modalSize);

                            $modal.find('.modal-title')
                                .html(modalTitle);

                            if (modalSize) {
                                modalSize = 'modal-' + modalSize;
                            }

                            $modal.find('.modal-dialog')
                                .attr('class', 'modal-dialog ' + modalSize);

                            $modal
                                .find('.modal-body')
                                .empty()
                                .append('<iframe src="' + $link.prop('href') + '" class="border-0 w-100" style="height: ' + ($link.data(iframeModalsConstants.dataAttr.height) || iframeModalsConstants.defaults.height) + '"></iframe>');
                        })
                        .on('hidden.bs.modal', function (ev) {
                            $(this)
                                .find('.modal-body')
                                .empty();

                            if ($link.data(iframeModalsConstants.dataAttr.onHidden)) {
                                var context = window;
                                var namespaces = $link.data(iframeModalsConstants.dataAttr.onHidden).split('.');
                                var func = namespaces.pop();
                                for (var i = 0; i < namespaces.length; i++) {
                                    context = context[namespaces[i]];
                                }
                                return context[func].apply(context, [ev, $link]);
                            }
                        });
                });
            };

            // auth (requires bootbox)
            // TODO: revisar
            function initSessionTimeoutCheck(options) {
                var optsDefaults = {
                    timeoutInMin: 10,
                    timeoutAlertInMin: 1,
                    checkSessionUrl: '/Home/CheckSession',
                    extendSessionUrl: '/Home/ExtendSession',
                    sessionExpiredUrl: '/Home/SessionExpired',
                    confirmModalTitle: 'Session',
                    confirmModalMessage: 'Your session is expiring soon.',
                    confirmModalExtendSessionButton: 'Extend session',
                }

                var opts = $.extend({}, optsDefaults, options);

                var timeoutInMil = opts.timeoutInMin * 60000,
                    timeoutAlertInMil = timeoutInMil - (opts.timeoutAlertInMin * 60000);

                var checkSessionTimeoutId;

                scheduleCheckSession();
                scheduleAlert();

                function scheduleCheckSession() {
                    if (checkSessionTimeoutId) {
                        clearTimeout(checkSessionTimeoutId);
                    }

                    checkSessionTimeoutId = setTimeout(
                        function () {
                            $.getJSON(
                                opts.checkSessionUrl,
                                function (response) {
                                    if (response.authenticated === false) {
                                        window.location = opts.sessionExpiredUrl;
                                    } else {
                                        scheduleCheckSession();
                                    }
                                });
                        },
                        timeoutInMil
                    );
                }

                function scheduleAlert() {
                    setTimeout(
                        function () {
                            showConfirmModal(
                                opts.confirmModalTitle,
                                opts.confirmModalMessage,
                                function (resp) {
                                    if (resp) {
                                        $.post(
                                            opts.extendSessionUrl,
                                            nmd.ui.forms.createDataWithAntiForgeryToken(),
                                            function () {
                                                scheduleCheckSession();
                                                scheduleAlert();
                                            }
                                        );
                                    }
                                },
                                {
                                    buttons: {
                                        confirm: {
                                            label: opts.confirmModalExtendSessionButton,
                                            className: 'btn-primary'
                                        },
                                        cancel: {
                                            className: 'd-none'
                                        }
                                    }
                                }
                            );
                        },
                        timeoutAlertInMil
                    );
                }
            }
            //---

            // loading (requires: LoadingOverlay)
            function showLoading(selector) {
                var options = { image: '', fontawesome: 'fa fa-spinner fa-spin', size: 15 };
                if (selector) {
                    $(selector).LoadingOverlay('show', options);
                } else {
                    $.LoadingOverlay('show', options);
                }
            }

            function hideLoading(selector) {
                if (selector) {
                    $(selector).LoadingOverlay('hide');
                } else {
                    $.LoadingOverlay('hide');
                }
            }
            //---


            // Selectpicker (requires: boostrap-select)
            var selectpickerConstants = {
                class: {
                    selectpicker: 'selectpicker'
                }
            };

            var multiselectConstants = {
                class: {
                    multiselect: 'multiselect'
                },
                dataAttr: {
                    options: 'multiselect-opts'
                }
            };

            function initMultiSelect(selector, options) {
                var optsDefaults = {
                    maxIndividualOptions: 3,
                    allSelectedText: 'All',
                    countSelectedTextFormat: '{0} of {1}',
                }

                var opts = $.extend({}, optsDefaults, options);

                $(selector || '.' + multiselectConstants.class.multiselect)
                    .selectpicker({
                        actionsBox: true,
                        selectedTextFormat: 'count > ' + opts.maxIndividualOptions,
                        countSelectedText: function (selected, total) {
                            if (selected == total) {
                                return opts.allSelectedText;
                            } else {
                                return utils.stringFormat(opts.countSelectedTextFormat, selected, total);
                            }
                        }
                    })
                    .data(multiselectConstants.dataAttr.options, opts);
            }
            //---

            // selectpicker-ajax (requires: ajax-bootstrap-select)
            var selectpickerAjaxConstants = {
                class: {
                    selectpickerAjax: 'selectpicker-ajax'
                }
            };

            function initSelectpickerAjax(selector, options) {
                var optsDefaults = {
                    minLength: 3,
                    preserveSelected: false,
                }

                var opts = $.extend({}, optsDefaults, options);

                $(selector || '.' + selectpickerAjaxConstants.class.selectpickerAjax)
                    .selectpicker({ liveSearch: true })
                    .ajaxSelectPicker(opts);
            }
            //---

            // datepicker (requires: datepicker)
            var datepickerConstants = {
                class: {
                    datepicker: 'datepicker'
                }
            };

            function initDatePicker(selector, options) {
                var optsDefaults = {
                    maxViewMode: 2,
                    todayBtn: 'linked',
                    clearBtn: true,
                    autoclose: true
                }

                var opts = $.extend({}, optsDefaults, options);

                $(selector || '.' + datepickerConstants.class.datepicker)
                    .datepicker(opts)
                    .on('hide', function (e) {
                        e.stopPropagation();
                    });
            }
            //---

            // CharacterCounter (requires: characterCounter)
            var characterCounterConstants = {
                class: {
                    characterCounter: 'character-counter'
                }
            };

            function initCharacterCounter(selector, options) {
                var optsDefaults = {
                    renderTotal: true,
                    countNewLineChars: false,
                    counterWrapper: 'small',
                    counterCssClass: 'float-right',
                    counterFormat: '%1',
                    counterExceededCssClass: 'text-danger',
                };

                var opts = $.extend({}, optsDefaults, options);

                $(selector || '.' + characterCounterConstants.class.characterCounter).characterCounter(opts);
            }
            //---

            // numeric (requires: numeric)
            var numericConstants = {
                class: {
                    numeric: 'numeric',
                    numericInteger: 'numeric-integer'
                }
            };

            function initNumeric(selector, options) {
                var optsDefaults = {
                    decimal: '.',
                    negative: false,
                    decimalPlaces: -1
                };

                var opts = $.extend({}, optsDefaults, options);

                $(selector || '.' + numericConstants.class.numeric).numeric(opts);
            }

            function initNumericInteger(selector, options) {
                var optsDefaults = {
                    negative: false
                };

                var opts = $.extend({}, optsDefaults, options);

                $(selector || '.' + numericConstants.class.numericInteger).numeric({
                    decimal: false,
                    negative: opts.negative
                });
            }
            //---

            return {
                clearControls: clearControls,

                initAutopostback: initAutopostback,

                showAlert,
                hideAlert,

                initPrintButton,
                initScrollFocus,
                initInputFileButtons,
                initInputFiltering,

                initBootstrapTooltips,

                initBootstrapCustomFileInput,
                clearBootstrapCustomFileInput,

                loadCombo,
                loadComboAjax,
                initComboCascadeAjax,
                initComboCascadeJson,

                initElapsedTime,
                stopElapsedTime,

                initTableCheckBoxSelection,
                initTableSorting,
                initTableOrderPOST,

                initModals,
                showErrorModal,
                showSuccessModal,
                showMessageModal,
                showConfirmModal,

                initIframeModalsLinks,

                initSessionTimeoutCheck,

                showLoading,
                hideLoading,

                initMultiSelect,

                initSelectpickerAjax,

                initDatePicker,

                initCharacterCounter,

                initNumeric,
                initNumericInteger
            };
        }();

        var forms = function () {
            function setAntiForgeryTokenToData(data, form) {
                data["__RequestVerificationToken"] = $("input[name=__RequestVerificationToken]", form).val();
            }

            function createDataWithAntiForgeryToken(form) {
                var data = {};
                setAntiForgeryTokenToData(data, form);

                return data;
            }

            function setAntiForgeryTokenToFormData(formData, form) {
                formData.append("__RequestVerificationToken", $("input[name=__RequestVerificationToken]", form).val());
            }

            function disableEnterSubmit() {
                $(document).on('keydown', ':input:not(textarea)', function (event) {
                    return event.key != 'Enter';
                });
            }

            function initDisableOnSubmitButtons() {
                var selector = '.disable-on-submit',
                    cssDisabledOnSubmit = 'disabled-on-submit';

                $(document).on('invalid-form.validate', 'form', function () {
                    var $controlsToDisable = $(this).find(selector + ' .' + cssDisabledOnSubmit);
                    setTimeout(
                        function () {
                            $controlsToDisable
                                .prop('disabled', false)
                                .removeClass(cssDisabledOnSubmit);
                        }, 1);
                });

                $(document).on('submit', 'form', function () {
                    var $controlsToDisable = $(this).find(selector);
                    setTimeout(
                        function () {
                            $controlsToDisable
                                .prop('disabled', true)
                                .addClass(cssDisabledOnSubmit);
                        }, 0);
                });
            }

            function setValidationSummaryVisibility() {
                if ($(".validation-summary-errors li:visible").length === 0) {
                    $(".validation-summary-errors").hide();
                }
            }
            //---

            return {
                setAntiForgeryTokenToData,
                createDataWithAntiForgeryToken,
                setAntiForgeryTokenToFormData,
                disableEnterSubmit,

                initDisableOnSubmitButtons,
                setValidationSummaryVisibility,
            };
        }();

        return {
            controls,
            forms
        };
    }();

    return {
        utils,
        format,
        page,
        ui,
    }

}();
