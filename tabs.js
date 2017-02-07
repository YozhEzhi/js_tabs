// Переход на следующую вкладку возможен только после заполнения всех инпутов
// на текущей. На последней вкладке выводится вся информация заполненная на предыдущих.
//
// Что будет плюсом:
// 1. табы в виде самостоятельного jquery плагина (jquery-tabs - это не интересно)
// 2. возможность задать заполненные данные при открытии страницы (например json)
//  2.1. ...в таком случае открывается первая не заполненная вкладка.
//  2.2. ...соблюдается последовательность (нельзя попасть на заполненную вкладку
// если перед ней есть незаполненная)

// ================================================================
// TODO :
// 1. Допилить showResult();
// 2. Баг при удалении первой заполненной табы: результирующая таба
// не стает активной;
// ================================================================
let content = document.querySelector('.content');
let tabsList = content.querySelector('.tabs-list'),
  dataItems = content.querySelectorAll('[data-index]'),
  inputs = content.querySelectorAll('input[data-input]'),
  $tabResult = $('li[data-result="result"]'),
  tabResultTarget = '#tab-result-target',
  dataObj = {};

const tabs = {
  init() {
    this.setUpListeners();
  },

  setUpListeners() {
    tabsList.addEventListener('click', event => this.tabsSwitch(event));
    $tabResult.on('click', this.showResult);
    inputs.forEach(item => item.addEventListener('keyup', event => this.inputIsFilled(event)));
  },

  tabsSwitch(event) {
    const target = event.target;
    const clickedTabId = target.dataset.index;

    if (!target.classList.contains('active') && !target.classList.contains('disabled')) {
      this.inputsGetData();

      this.resetActiveClass();
      this.setActiveItems(clickedTabId);
    }

    if (target.classList.contains('result')) this.showResult();
  },

  resetActiveClass() {
    dataItems.forEach(item => item.classList.remove('active'));
  },

  setActiveItems(tabId) {
    const itemsToSetActive = Array.from(dataItems).filter(item => item.dataset.index === tabId);
    itemsToSetActive.forEach(item => item.classList.add('active'));
  },

  inputIsFilled(event) {
    const activeContent = content.querySelector('.tab-content.active');
    const target = event.target;

    if (target.value.trim()) {
      target.classList.add('filled');
      this.isSectionFilled();
    } else {
      target.classList.remove('filled');
      activeContent.classList.remove('content-filled');
      this.tabAddDisabled();

      console.log('Input is empty');
    }
  },

  isSectionFilled() {
    const section = content.querySelector('.tab-content.active');
    const inputs = section.querySelectorAll('input');
    let inputsFilled = 0;

    inputs.forEach((item) => {
      if (item.value.trim()) inputsFilled++;
    });

    if (inputsFilled === inputs.length && !section.classList.contains('content-filled')) {
      section.classList.add('content-filled');
      this.refreshTabs();
    }
  },

  inputsGetData() {
    const section = content.querySelector('.tabs-item.active:not(.result)');
    const sectionIndex = section.dataset.index;
    const activeInputs = content.querySelectorAll('.tab-content.active input');
    let inputData = {};

    if (!sectionIndex) return;

    activeInputs.forEach(item => inputData[item.dataset.input] = item.value);
    dataObj[sectionIndex] = inputData;
  },

  tabAddDisabled() {
    $('.tabs-item.active').nextAll().addClass('disabled');
  },

  refreshTabs() {
    const $tabsItemsDisabled = $('.tabs-item.disabled');
    $tabsItemsDisabled.first().removeClass('disabled');
  },

  showResult() {
    let resultHTML = '',
      objKeys = Object.getOwnPropertyNames(dataObj),
      i = 0,
      y = 1,
      tabContentToFill,
      tabContentData;

    if (!$(this).hasClass('disabled') && !$(this).hasClass('active')) {
      for (let property in dataObj) {
        if (dataObj.hasOwnProperty(property)) {
          tabContentToFill = dataObj[property];

          resultHTML += '<p><strong>Tab ' + objKeys[i] + ':</strong></p>';
          i++;

          for (let subProp in tabContentToFill) {
            if (tabContentToFill.hasOwnProperty(subProp)) {
              tabContentData = tabContentToFill[subProp];

              resultHTML += '<p>Input ' + y + ': <em>' + tabContentData + '</em></p>';
              y++;
            }
          }
        }
      }

      $(tabResultTarget).append('<p>JSON is: ' + JSON.stringify(dataObj, '', 4) +'</p>');
      $(tabResultTarget).append(resultHTML);
    }
  }
};

tabs.init();
