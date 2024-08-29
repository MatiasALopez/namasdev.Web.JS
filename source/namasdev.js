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

    var ui = function () {

        var controls = function () {

            function clearControls(selector) {
                var $controls = $(selector);

                $controls.filter('input, select, textarea').val('');
                $controls.filter(':radio,:checkbox').prop('checked', false);
                clearBootstrapCustomFileInput(selector);
            }

            function initAutopostback() {
                $('.autopostback').on('change', function () {
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

                $(document).on('change', 'input.autopostback,select.autopostback,textarea.autopostback', function () {
                    $(this).closest('form').submit();
                });
            }

            // Alert control
            function showAlertControl(selector, message, alertType) {
                $(selector)
                    .html(message)
                    .attr('class', 'alert alert-' + alertType);
            }

            function clearAlertControl(selector) {
                $(selector)
                    .empty()
                    .attr('class', '');
            }
            //---

            // message modals (requires: bootbox)
            function initMessageModals() {
                bootbox.setDefaults({ locale: 'es', swapButtonOrder: true });
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

            function showMessageConfirm(title, message, callback, options) {
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

            // scroll focus
            function initScrollFocus() {
                var $scrollFocus = $('.scroll-focus');
                if ($scrollFocus.length > 0) {
                    $([document.documentElement, document.body])
                        .animate({ scrollTop: $scrollFocus.first().offset().top - 30 }, 1000);
                }
            }
            //---

            // bootstrap (requires: bootstrap)
            function initBootstrapTooltips() {
                $('[data-toggle="tooltip"]').tooltip();
            }
            //---

            // bootstrap custom file input (requires bs-input)
            function initBootstrapCustomFileInput(options) {
                var optsDefaults = {
                    browseText: 'Buscar',
                    selectedFileText: '...',
                }

                var opts = $.extend({}, optsDefaults, options);

                $('.custom-file-label')
                    .attr('data-selected-file', opts.selectedFileText)
                    .attr('data-browse', opts.browseText)
                    .text(opts.selectedFileText);

                bsCustomFileInput.init();
            }

            function clearBootstrapCustomFileInput(selector) {
                $(selector).filter('.custom-file-input').each(function () {
                    var $input = $(this),
                        $label = $input.parent().find('.custom-file-label');
                    $label.text($label.data('selected-file'));
                });
            }

            function resetBootstrapCustomFileInput() {
                bsCustomFileInput.destroy();
                bsCustomFileInput.init();
            }
            //---

            // loading (requires: LoadingOverlay)
            function showLoading(selector) {
                var options = { image: "", fontawesome: "fa fa-spinner fa-spin", size: 15 };
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
                    $.LoadingOverlay("hide");
                }
            }
            //---


            // Print
            function initPrintButton() {
                $('.btn-imprimir').on('click', function (ev) {
                    ev.preventDefault();
                    imprimir();
                    return false;
                });
            }
            //---

            // Selectpicker (requires: boostrap-select)
            function initMultiSelect(selector, options) {
                var optsDefaults = {
                    allSelectedText: 'Todos',
                    countSelectedTextFormat: '{0} de {1}',
                }

                var opts = $.extend({}, optsDefaults, options);

                $(selector || '.multiselect').selectpicker({
                    actionsBox: true,
                    selectedTextFormat: 'count > 3',
                    countSelectedText: function (selected, total) {
                        if (selected == total) {
                            return opts.allSelectedText;
                        } else {
                            return stringFormat(allSelectedText.countSelectedTextFormat, selected, total);
                        }
                    }
                });
            }
            //---

            // selectpicker-ajax (requires: ajax-bootstrap-select)
            function initSelectpickerAjax() {
                $('.selectpicker-ajax')
                    .selectpicker({ liveSearch: true })
                    .ajaxSelectPicker({ minLength: 3, preserveSelected: false });
            }
            //---


            // Combos
            function loadCombo(comboId, items, options) {
                var optsDefaults = {
                    emptyOptionText: null,
                    itemsValueProperty: 'Value',
                    itemsTextProperty: 'Text',
                    itemsSelectedProperty: 'Selected',
                    itemsSelectedValue: null,
                    selectAllByDefault: false,
                    destroyAndRecreateSelectpicker: false,
                }

                var opts = $.extend({}, optsDefaults, options);

                var $combo = $('#' + comboId);
                $combo.empty();

                if (opts.emptyOptionText != null) {
                    $combo.append('<option value="">' + opts.emptyOptionText + '</option>')
                }

                $.each(items, function (i, item) {
                    var itemValue = item[opts.itemsValueProperty];
                    $combo.append('<option value="' + itemValue + '" ' + (opts.itemsSelectedValue === itemValue || item[opts.itemsSelectedProperty] ? 'selected="selected"' : '') + '>' + item[opts.itemsTextProperty] + '</option>');
                });

                var isSelectpicker = $combo.hasClass('selectpicker');
                var isMultiselect = $combo.hasClass('multiselect');
                if (isSelectpicker || isMultiselect) {
                    if (opts.destroyAndRecreateSelectpicker) {
                        $combo.selectpicker('destroy');

                        if (isMultiselect) {
                            initMultiSelect('#' + idCombo);
                        } else {
                            $combo.selectpicker();
                        }
                    } else {
                        $combo
                            .selectpicker('val', null)
                            .selectpicker('refresh');

                        if (opts.selectAllByDefault && isMultiselect) {
                            $combo.selectpicker('selectAll');
                        }
                    }
                }

                $combo.trigger('change');
            }

            function loadComboAjax(comboId, url, options) {
                var optsDefaults = {
                    emptyOptionText: null,
                    selectAllByDefault: true,
                    itemsAddedCallback: null,
                    destroyAndRecreateSelectpicker: false,
                    ajaxErrorDefaultMessage: 'An error occurred.',
                    ajaxErrorProperty: 'error',
                    ajaxItemsProperty: 'items',
                    loadingEnabled: false,
                    loadingSelector: null,
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
                        var error = response[opts.ajaxItemsProperty];
                        if (error) {
                            alert(error);
                            loadCombo(comboId, [], opts);

                            return;
                        }

                        loadCombo(comboId, response[opts.ajaxErrorProperty], opts);

                        if (opts.itemsAddedCallback) {
                            opts.itemsAddedCallback($('#' + comboId));
                        }
                    })
                    .fail(function (error) {
                        alert(opts.ajaxErrorDefaultMessage);
                    })
                    .always(function () {
                        if (opts.showLoading) {
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
                            return;
                        }

                        loadComboAjax(comboId, buildUrl(), options);
                    });

                function buildUrl() {
                    var hasEmptyIDs = false;

                    var ids = $(parentComboIdSelector).map(function () {
                        var $parentCombo = $(this);
                        var value = $parentCombo.hasClass('multiselect')
                            ? $parentCombo.val().join(',')
                            : $parentCombo.val();

                        if (!value) {
                            hasEmptyIDs = true;
                        }

                        return valor;
                    }).get();

                    return !hasEmptyIDs
                        ? stringFormat(urlFormat, ids)
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

                    loadCombo(comboId, items, { itemsSelectedValue: selectedValue });
                }
            }
            //---

            // CharacterCounter (requires: characterCounter)
            function initCharacterCounter() {
                $(".character-counter")
                    .each(function () {
                        var $this = $(this),
                            limit = $this.attr('maxlength') || 100;

                        $(this).characterCounter({
                            maximumCharacters: limit,
                            renderTotal: true,
                            countNewLineChars: true,
                            counterWrapper: 'small',
                            counterCssClass: 'text-muted',
                            counterFormat: '%1',
                            counterExceededCssClass: 'text-danger',
                            customFields: {
                                'class': 'float-right'
                            }
                        });
                    });
            }
            //---

            // datepicker (requires: datepicker)
            function initDatePicker() {
                $('.datepicker').datepicker({
                    format: 'dd/mm/yyyy',
                    maxViewMode: 2,
                    todayBtn: "linked",
                    clearBtn: true,
                    language: "es",
                    autoclose: true
                }).on('hide', function (e) {
                    e.stopPropagation();
                });
            }
            //---

            // input file button
            function initInputFileButtons() {
                $('input[data-input-file],button[data-input-file]')
                    .each(function () {
                        var $btn = $(this),
                            file = $btn.data('input-file'),
                            $file = $('#' + file),
                            autopostback = $btn.data('input-file-autopostback');

                        $file.addClass('d-none');

                        if ($btn.attr('name')) {
                            var btnName = $btn.attr('name'),
                                btnValue = $btn.attr('value');
                            $file.data('autopostback-hf', btnName + '=' + btnValue);
                        }

                        if (autopostback || autopostback == '') {
                            $file.addClass('autopostback');
                        }
                    })
                    .on('click', function (ev) {
                        ev.preventDefault();

                        var $btn = $(this),
                            file = $btn.data('input-file');

                        $('#' + file).click();

                        return false;
                    });
            }
            //---

            // numeric (requires: numeric)
            function initNumeric(selectorContainer) {
                $((selectorContainer || '') + ' .numeric').numeric();

                $((selectorContainer || '') + ' .numeric-integer').numeric({
                    decimal: false,
                    negative: false
                });
            }
            //---

            // InputFiltering
            function initInputFiltering() {
                $(".input-filtering").on('input', function () {
                    var $input = $(this),
                        regex = $input.data("regex") || '[^a-zA-Z0-9-]',
                        valor = $input.val();

                    $input.val(valor.replace(new RegExp(regex, 'g'), ''));
                });
            }
            //---

            // Elapsed time
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
                    $control = $('#' + elementoTiempoId);
                    timeNow = moment();

                    var diff = timeNow - timeStart;
                    var diffDuracion = moment.duration(diff);
                    var diffMin = diffDuracion.asMinutes();

                    $control.text(
                        diffMin < 60
                            ? moment(diff).format('mm:ss')
                            : diffDuracion.humanize()
                    );

                    if (opts.minutesReachedValue && opts.minutesReachedCallback && diffMin > opts.minutesReachedValue) {
                        optsDefaults.minutesReachedCallback();
                    }

                }, 800);

                $control.data('elapsedTimeIntervalId', intervalId);
            }

            function stopElapsedTime(controlId) {
                var intervalId = $('#' + controlId).data('elapsedTimeIntervalId');
                if (intervalId) {
                    clearInterval(parseInt(intervalId));
                }
            }
            //---

            // Tablas
            function initTableCheckBoxSelection(containerSelector) {
                var selectAllSelector = 'thead input[type=checkbox]',
                    selectOneSelector = 'tbody input[type=checkbox]',
                    selectAllFullSelector = containerSelector + ' ' + selectAllSelector,
                    selectOneFullSelector = containerSelector + ' ' + selectOneSelector;

                setCheckboxSelectAllState();

                $(containerSelector).on('change', selectAllSelector, function (e) {
                    setCheckboxState(
                        $(selectOneFullSelector),
                        $(this).is(':checked')
                    );
                });

                $(containerSelector).on('change', selectOneSelector, function (e) {
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

            function initTableOrdering(tableSelector) {
                $(tableSelector)
                    .on('click', 'th > a[data-order]', function (ev) {
                        ev.preventDefault();

                        var $link = $(this),
                            $tbody = $(tableSelector).find('tbody'),
                            columnCss = $link.data('order'),
                            asc = ($link.data('order-asc') || '1') === '1';

                        $tbody.find('tr').sort(function (a, b) {
                            var res = $(a).find('td.' + columnCss).text().localeCompare($(b).find('td.' + columnCss).text());
                            return asc ? res : -res;
                        }).appendTo($tbody);

                        $link.data('order-asc', asc ? '0' : '1');

                        return false;
                    });
            }

            function initTableOrderLinkPOST(tableSelector, options) {
                var optsDefaults = {
                    orderInputName: null,
                    operationInputName: null,
                }

                var opts = $.extend({}, optsDefaults, options);

                $(tableSelector)
                    .on('click', 'a[data-order]', function (ev) {
                        ev.preventDefault();

                        var $link = $(this),
                            $form = $link.closest('form'),
                            order = $link.data('order');
                        operation = $link.data('operation');

                        $form.append('<input type="hidden" name="' + opts.orderInputName + '" value="' + order + '" />');

                        if (operation) {
                            $form.append('<input type="hidden" name="' + opts.operationInputName + '" value="' + operation + '" />');
                        }

                        $form.submit();

                        return false;
                    });
            }
            //---

            // iframe (TODO: try bootbox)
            function initIframeModalsLinks(owner) {
                var $elements;
                if (owner) {
                    $elements = $('a[data-iframe]', owner);
                } else {
                    $elements = $('a[data-iframe]');
                }

                $elements.each(function () {
                    var $a = $(this),
                        modalId = 'mdIframe' + Math.floor(Math.random() * 99999),
                        modalSelector = '#' + modalId;
                    if ($(modalSelector).length == 0) {
                        $('body').append(
                            '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="' + modalId + 'Label"  aria-hidden="true">\
                        <div class="modal-dialog" role="document" >\
                            <div class="modal-content">\
                                <div class="modal-header"\>\
                                    <h5 class="modal-title" id="' + modalId + 'Label"></h5>\
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                </div>\
                                <div class="modal-body"></div>\
                            </div>\
                        </div>\
                    </div>');
                    }
                    $a.attr('data-toggle', 'modal')
                        .attr('data-target', modalSelector);

                    $(modalSelector)
                        .on('shown.bs.modal', function () {
                            var $modal = $(this),
                                modalTitle = $a.data('iframe-title') || '',
                                modalSize = $a.data('iframe-modal-size');

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
                                .append('<iframe src="' + $a.prop('href') + '" class="border-0 w-100" style="height: ' + ($a.data('iframe-height') || '350px') + '"></iframe>');
                        })
                        .on('hidden.bs.modal', function (ev) {
                            $(this)
                                .find('.modal-body')
                                .empty();

                            if ($a.data('iframe-onhidden')) {
                                var context = window;
                                var namespaces = $a.data('iframe-onhidden').split(".");
                                var func = namespaces.pop();
                                for (var i = 0; i < namespaces.length; i++) {
                                    context = context[namespaces[i]];
                                }
                                return context[func].apply(context, [ev, $a]);
                            }
                        });
                });
            };
            //---

            // auth (TODO: revisar)
            function initSessionTimeoutCheck(options) {
                var optsDefaults = {
                    timeoutInMin: 10,
                    timeoutAlertInMin: 1,
                    checkSessionUrl: '/Home/CheckSession',
                    extendSessionUrl: '/Home/ExtendSession',
                    sessionExpiredUrl: '/Home/SessionExpired',
                    confirmModalTitle: 'Sesi�n',
                    confirmModalMessage: 'Tu sesi�n expirar� pronto.<br />Haz clic en el bot�n <strong>Continuar conectado</strong> para mantener tu sesi�n activa.',
                    confirmModalButton: 'Continuar conectado'
                }

                var opts = $.extend({}, optsDefaults, options);

                var timeoutInMil = opts.timeoutInMin * 60000,
                    timeoutAlertInMil = opts.timeoutInMil - (opts.timeoutAlertInMin * 60000);

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
                            showMessageConfirm(
                                opts.confirmModalTitle,
                                opts.confirmModalMessage,
                                function (resp) {
                                    if (resp) {
                                        $.post(
                                            opts.extendSessionUrl,
                                            createDataWithAntiForgeryToken(),
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
                                            label: opts.confirmModalButton,
                                            className: 'btn-primary'
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

            return {
                clearControls: clearControls,
                initAutopostback: initAutopostback,

                showAlertControl,
                clearAlertControl,

                showLoading,
                hideLoading,

                initMessageModals,
                showErrorModal,
                showSuccessModal,
                showMessageModal,
                showMessageConfirm,

                initScrollFocus,

                initBootstrapTooltips,

                initBootstrapCustomFileInput,
                clearBootstrapCustomFileInput,
                resetBootstrapCustomFileInput,

                loadCombo,
                loadComboAjax,
                initComboCascadeAjax,
                initComboCascadeJson,

                initPrintButton,
                initInputFileButtons,
                initInputFiltering,

                initMultiSelect,

                initSelectpickerAjax,

                initDatePicker,

                initNumeric,

                initCharacterCounter,

                initElapsedTime,
                stopElapsedTime,

                initTableCheckBoxSelection,
                initTableOrdering,
                initTableOrderLinkPOST,

                initIframeModalsLinks,

                initSessionTimeoutCheck,
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
                $(document).on('keydown', 'form', function (event) {
                    return event.key != 'Enter';
                });
            }

            // validation (requires: jQuery validator)
            function configJQueryValidationDates() {
                $.validator.methods.date = function (value, element) {
                    return this.optional(element) || moment(value, 'DD/MM/YYYY').isValid() || moment(value, 'MM/YYYY').isValid();
                }
            }

            function initDisableOnSubmitButtons() {
                var selector = '.disable-on-submit',
                    cssDisabledOnSubmit = 'disabled-on-submit';

                $(document).on('invalid-form.validate', 'form', function () {
                    var $btn = $(this)
                        .find(selector + ' .' + cssDisabledOnSubmit);
                    setTimeout(function () {
                        $btn
                            .prop('disabled', false)
                            .removeClass(cssDisabledOnSubmit);
                    }, 1);
                });

                $(document).on('submit', 'form', function () {
                    var $btn = $(this)
                        .find(selector);
                    setTimeout(function () {
                        $btn
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

                configJQueryValidationDates,
                initDisableOnSubmitButtons,
                setValidationSummaryVisibility,
            };
        }();

        return {
            controls,
            forms
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

        function isMobileScreen() {
            return $(window).width() < 768;
        }

        function disablePageRefresh() {
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
            isMobileScreen,
            disablePageRefresh,
            disableCopyAndPaste,
        };
    }();

    var utils = function () {
        function stringFormat(format) {
            if (!format) {
                return format;
            }

            var values =
                $.isArray(arguments[0])
                    ? arguments[0]
                    : arguments;

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

    return {
        ui,
        format,
        page,
        utils
    }

}();
