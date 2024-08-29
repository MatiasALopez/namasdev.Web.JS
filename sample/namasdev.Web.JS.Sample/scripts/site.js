var sampleApp = function () {

    function init() {
        nmd.ui.forms.configJQueryValidationDates();
        nmd.ui.forms.initDisableOnSubmitButtons();
        nmd.ui.forms.setValidationSummaryVisibility();

        nmd.ui.controls.initAutopostback();
        nmd.ui.controls.initDatePicker();
        nmd.ui.controls.initNumeric();
        nmd.ui.controls.initMultiSelect();
        nmd.ui.controls.initMessageModals();
        nmd.ui.controls.initCharacterCounter();
        nmd.ui.controls.initSelectpickerAjax();
        nmd.ui.controls.initBootstrapCustomFileInput();
        nmd.ui.controls.initBootstrapTooltips();
        nmd.ui.controls.initInputFileButtons();
        nmd.ui.controls.initInputFiltering();
        nmd.ui.controls.initScrollFocus();
        nmd.ui.controls.initTableOrderLinkPOST();
        nmd.ui.controls.initPrintButton();
    }

    return {
        init
    };
}();
