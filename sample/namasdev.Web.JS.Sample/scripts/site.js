var sampleApp = function () {

    function init() {
        nmd.ui.forms.initDisableOnSubmitButtons();
        nmd.ui.forms.setValidationSummaryVisibility();

        nmd.ui.controls.initAutopostback();
        nmd.ui.controls.initPrintButton();
        nmd.ui.controls.initScrollFocus();
        nmd.ui.controls.initInputFileButtons();
        nmd.ui.controls.initInputFiltering();
        nmd.ui.controls.initClickControls();
        nmd.ui.controls.initToggleStateControls();
        nmd.ui.controls.initBootstrapTooltips();
        nmd.ui.controls.initBootstrapCustomFileInput();
        nmd.ui.controls.initTableCheckBoxSelection();
        nmd.ui.controls.initTableSorting();
        nmd.ui.controls.initTableOrderPOST();
        nmd.ui.controls.initModals();
        nmd.ui.controls.initIframeModalsLinks();
        nmd.ui.controls.initMultiSelect();
        nmd.ui.controls.initSelectpickerAjax();
        nmd.ui.controls.initDatePicker();
        nmd.ui.controls.initCharacterCounter();
        nmd.ui.controls.initNumeric();
        nmd.ui.controls.initNumericInteger();
        nmd.ui.controls.initInputMaskNumeric();
        nmd.ui.controls.initInputMaskInteger();
        nmd.ui.controls.initPasswordVisibility();
    }

    return {
        init
    };
}();
