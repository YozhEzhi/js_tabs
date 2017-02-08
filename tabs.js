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
// TODO:
// 1. Баг при удалении первой заполненной табы: результирующая таба
// не стает активной;
// ================================================================
let content = document.querySelector('.content');
let tabsList = content.querySelector('.tabs-list'),
  dataItems = content.querySelectorAll('[data-index]'),
  inputs = content.querySelectorAll('input[data-input]'),
  resultSection = content.querySelector('#result-section'),
  dataObj = {};

const tabs = {
  init() {
    this.setUpListeners();
  },

  setUpListeners() {
    tabsList.addEventListener('click', event => this.tabsSwitch(event));
    inputs.forEach(item => item.addEventListener('keyup', event => this.inputIsFilled(event)));
  },

  tabsSwitch(event) {
    const target = event.target;
    const clickedTabId = target.dataset.index;

    if (!target.classList.contains('active') && !target.classList.contains('disabled')) {
      this.storeInputData();
      this.resetActiveClass();
      this.setActiveItems(clickedTabId);
    }

    if (target.classList.contains('result')) this.showResult(target);
  },

  resetActiveClass() {
    dataItems.forEach(item => item.classList.remove('active'));
  },

  setActiveItems(tabId) {
    const itemsToSetActive = Array.from(dataItems).filter(item => item.dataset.index === tabId);
    itemsToSetActive.forEach(item => item.classList.add('active'));
  },

  inputIsFilled(event) {
    const target = event.target;

    if (target.value.trim()) {
      target.classList.add('filled');
      this.isSectionFilled();
    } else {
      target.classList.remove('filled');
      this.tabAddDisabled();
    }
  },

  isSectionFilled() {
    const section = content.querySelector('.tab-content.active');
    const inputs = section.querySelectorAll('input');
    let inputsFilled = 0;

    inputs.forEach((item) => {
      if (item.value.trim()) inputsFilled++;
    });

    if (inputsFilled === inputs.length) {
      this.refreshTabs();
    }
  },

  storeInputData() {
    const section = content.querySelector('.tabs-item.active');
    const sectionIndex = section.dataset.index;
    const activeInputs = content.querySelectorAll('.tab-content.active input');
    let inputData = {};

    if (!sectionIndex) return;
    activeInputs.forEach(item => inputData[item.dataset.input] = item.value);
    dataObj[sectionIndex] = inputData;
  },

  tabAddDisabled() {
    const activeTab = content.querySelector('.tabs-item.active');
    const siblings = [].filter.call(activeTab.parentNode.children, item => item !== activeTab);
    siblings.forEach(item => item.classList.add('disabled'));
  },

  refreshTabs() {
    const disabledTabs = content.querySelectorAll('.tabs-item.disabled');
    disabledTabs[0].classList.remove('disabled');
  },

  showResult(target) {
    let index = 1;
    let resultHTML;

    if (target.classList.contains('disabled')) return;
    for (let prop in dataObj) {
      if (dataObj.hasOwnProperty(prop)) {
        const dataObjProp = dataObj[prop];
        resultHTML += `<hr><br><p><strong>Tab ${prop}:</strong></p>`;

        for (let subProp in dataObjProp) {
          if (dataObjProp.hasOwnProperty(subProp)) {
            resultHTML += `<p>Input #${index}: ${dataObjProp[subProp]}</p>`;
            index++;
          }
        }
      }
    }

    resultSection.innerHTML = `
      <hr>
      <br>
      <p><strong>JSON is:</strong></p>
      <p>${JSON.stringify(dataObj, null, ' ')}</p>
      <br>
      ${resultHTML}
      <br>
    `;
  }
};

tabs.init();
