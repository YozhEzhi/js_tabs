let content = document.querySelector('.content');
let tabsList = content.querySelector('.tabs-list');
let dataItems = content.querySelectorAll('[data-index]');
let inputs = content.querySelectorAll('input[data-input]');
let resultSection = content.querySelector('#result-section');
let dataObj = {};

const tabs = {
  init() {
    tabsList.addEventListener('click', () => this.tabsSwitch());
    inputs.forEach(item => item.addEventListener('keyup', () => this.inputIsFilled()));
  },

  tabsSwitch() {
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

  inputIsFilled() {
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
    let inputsFilled = 0;
    const section = content.querySelector('.tab-content.active');
    const inputs = section.querySelectorAll('input');
    const currentTab = content.querySelector('.tabs-item.active');
    const nextTab = currentTab.nextElementSibling;
    const isDisabled = nextTab.classList.contains('disabled');

    inputs.forEach((item) => {
      if (item.value.trim()) inputsFilled++;
    });

    if (inputsFilled !== inputs.length || !isDisabled) return;
    nextTab.classList.remove('disabled');
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

  showResult(target) {
    let index = 1;
    let resultHTML = '';

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
      <p><code>${JSON.stringify(dataObj, null, ' ')}</code></p>
      <br>
      ${resultHTML}
      <br>
    `;
  }
};

tabs.init();
