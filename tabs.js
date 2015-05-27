// Дана страница с n-вкладками.
// На каждой вкладке набор текстовых инпутов: <input type="text">.
// Переход на следующую вкладку возможен только после заполнения всех инпутов
// на текущей. На последней вкладке выводится вся информация заполненная
// на предыдущих.
//
// Что большим будет плюсом:
// 1. использование stylus (нужны исходники styl)
// 2. табы в виде самостоятельного jquery плагина (jquery-tabs - это не интересно)
// 3. возможность задать заполненные данные при открытии страницы (например json)
//  3.1. ...в таком случае открывается первая не заполненная вкладка.
//  3.2. ...соблюдается последовательность (нельзя попасть на заполненную вкладку
// если перед ней есть незаполненная)
//
// На задание отводится 2-3 дня.

// ================================================================
// TODO :
// 1. Допилить showResult();
// 2. Баг при удалении первой заполненной табы: результирующая таба
// не стает активной;
// ================================================================

;(function($) {
    var $tabsList          = $(".tabs-list"),
        $tabsItemsDisabled = $(".tabs-item.disabled"),
        $tabsContent       = $(".tab-content"),
        $tabsContentActive = $(".tab-content.active"),
        $dataClassItems    = $("[data-class]"),
        $dataInputs        = $("input[data-input]"),
        $tabResult         = $("li[data-result='result']"),
        dataObj            = {},
        $inputsOnActiveContent,
        tabClicked;

    var tabs = {
        initialize : function() {
            tabs.setUpListeners();
        },

        setUpListeners : function() {
            $tabsList.on("click", ".tabs-item", this.tabsSwitch);
            // $tabResult.on("click", this.showResult);
            $dataInputs.on("keyup", this.inputIsFilled);
        },

        tabsSwitch : function() {
            var $this = $(this);

            tabClicked = $(this).data("class");

            if ( !$this.hasClass("active") && !$this.hasClass("disabled") ) {
                tabs.inputsGetData();

                $dataClassItems.removeClass("active");
                $("[data-class='" + tabClicked + "']").addClass("active");
            }

            if ( $this.hasClass("result") ) {
                tabs.showResult();
            }
        },

        inputIsFilled : function() {
            $tabsContentActive = $(".tab-content.active");

            if ( $(this).val() !== "" && $(this).val() !== " ") {
                $(this).addClass("filled");
                tabs.inputsAreFilles();
            } else {
                $(this).removeClass("filled");
                $tabsContentActive.removeClass("content-filled");
                tabs.tabAddDisabled();

                console.log("Input is empty");
            }
        },

        inputsAreFilles : function() {
            var $tabsContentActive = $(".tab-content.active"),
                inputsFilled       = 0,
                inputsLen          = 0;

            $inputsOnActiveContent = $tabsContentActive.find("input[data-input]");
            inputsLen = $inputsOnActiveContent.size();

            for (var i = 0; i < inputsLen; i++) {
                var inputCurVal = $inputsOnActiveContent.eq(i).val();

                if ( inputCurVal !== "" && inputCurVal !== " " ) {
                    inputsFilled++;
                }
            }

            if ( inputsFilled === inputsLen && !$tabsContentActive.hasClass("content-filled") ) {
                $tabsContentActive.addClass("content-filled");
                tabs.tabsRefresh();
            }
        },

        inputsGetData : function() {
            var $tabsItemActive    = $(".tabs-item.active").not(".result"),
                $tabsContentActive = $(".tab-content.active"),
                inputCurrId        = $tabsItemActive.data("class"),
                inputsLen          = 0,
                inputCurrData      = {};

            if( inputCurrId ) {
                $inputsOnActiveContent = $tabsContentActive.find("input[data-input]");
                inputsLen = $inputsOnActiveContent.size();

                for (var i = 0; i < inputsLen; i++) {
                    inputCurrData[ $inputsOnActiveContent.eq(i).data("input") ] = $inputsOnActiveContent.eq(i).val();
                }

                dataObj[inputCurrId] = inputCurrData;
            }
        },

        tabAddDisabled : function() {
            $(".tabs-item.active").nextAll().addClass("disabled");
        },

        tabsRefresh : function() {
            $tabsItemsDisabled = $(".tabs-item.disabled");
            $tabsItemsDisabled.first().removeClass("disabled");
        },

        showResult : function() {
            var resultHTML = "",
                objKeys = Object.getOwnPropertyNames(dataObj),
                i = 0,
                y = 1,
                tabContentToFill,
                tabContentData;

            if ( !$(this).hasClass("disabled") && !$(this).hasClass("active")) {
                for (var property in dataObj) {
                    if (dataObj.hasOwnProperty(property)) {
                        tabContentToFill = dataObj[property];

                        resultHTML += "<p><strong>Tab " + objKeys[i] + ":</strong></p>";
                        i++;

                        for (var subproperty in tabContentToFill) {
                            if (tabContentToFill.hasOwnProperty(subproperty)) {
                                tabContentData = tabContentToFill[subproperty];

                                resultHTML += "<p>Input " + y + ": <em>" + tabContentData + "</em></p>";
                                y++;
                            }
                        }
                    }
                }

                $("#tab-result-target").append( "<p>JSON is: " + JSON.stringify( dataObj, "", 4 ) + "</p>");
                $("#tab-result-target").append( resultHTML );
            }
        }
    };

    // Module init:
    tabs.initialize();

    $(function () {

    });
})(jQuery);
