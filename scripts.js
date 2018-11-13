/* eslint-env browser */
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let result;
  let input;


  function isAllSpace(text) {
    if (text.length === 1 && text === ' ') return true;
    if (text.length === 2 && text === '  ') return true;
    if (text.length > 1 && text.substring(0, 1) === ' ') return true;
    for (let r = 0; r + 2 < text.length; r += 1) {
      if (text.substring(r, r + 1) === text.substring(r + 1, r + 2) && text.substring(r, r + 1) === ' ') {
        return true;
      }
    }
    return false;
  }

  function element(name, child) {
    const parent = document.createElement(name);
    if (typeof child === 'string') {
      parent.appendChild(document.createTextNode(child));
    } else if (typeof child === 'object') {
      parent.appendChild(child);
    }
    return parent;
  }

  function removeAllChild(elmt) {
    for (;;) {
      if (elmt.firstChild) {
        elmt.removeChild(elmt.firstChild);
      } else return;
    }
  }

  function showError(str) {
    removeAllChild(result);

    const p = document.createElement('p');
    const errorText = document.createTextNode(str);
    p.appendChild(errorText);
    result.appendChild(p);
  }

  function showLoading() {
    removeAllChild(result);
    const loading = element('div');
    loading.classList.add('loading');

    const img = element('img');
    img.setAttribute('src', 'loading.gif');

    loading.appendChild(img);
    result.appendChild(loading);
  }

  function showData(data) {
    removeAllChild(result);

    const len = data.domain;
    const skrad = data.registered;
    const seinastBreyt = data.lastChange;
    const rennurUt = data.expires;

    const skraAd = data.registrantname;
    const netFang = data.email;
    const heimilisfang = data.address;
    const land = data.country;

    const ul = element('dl');
    ul.appendChild(element('dt', 'Lén'));
    ul.appendChild(element('dd', len));

    ul.appendChild(element('dt', 'Skráð'));
    ul.appendChild(element('dd', skrad));

    ul.appendChild(element('dt', 'Seinast breytt'));
    ul.appendChild(element('dd', seinastBreyt));

    ul.appendChild(element('dt', 'Rennur út'));
    ul.appendChild(element('dd', rennurUt));

    ul.appendChild(element('dt', 'Skráningaraðili'));
    ul.appendChild(element('dd', skraAd));

    ul.appendChild(element('dt', 'Netfang'));
    ul.appendChild(element('dd', netFang));

    ul.appendChild(element('dt', 'Heimilisfang '));
    ul.appendChild(element('dd', heimilisfang));

    ul.appendChild(element('dt', 'Land'));
    ul.appendChild(element('dd', land));

    result.appendChild(ul);
  }

  function search(str) {
    const url = API_URL + str;
    const request = new XMLHttpRequest();

    showLoading();

    request.open('GET', url, true);
    request.onload = function onload() {
      const data = JSON.parse(request.response);
      if (isAllSpace(str)) { // if only spaces
        showError('Lén er ekki skráð');
        // console.log('space only');
      } else if (typeof (data.results[0]) !== 'undefined') { // if data is defined
        // console.log(data.results[0]);
        // console.log(typeof(data.results[0]));
        // console.log(typeof(typeof(data.results[0])));
        showData(data.results[0]);
        // console.log('get here ');
        // console.log(data.results[0]);
      } else { // if data is undefined
        removeAllChild(result);
        showError('Lén er ekki skráð');
      }
    };

    request.send();
  }

  function onSubmit(e) {
    e.preventDefault();

    const [value] = [input.value];

    if (value.length === 0) {
      showError('Lén verður að vera strengur');
    } else {
      search(input.value);
    }
  }

  function init() {
    const form = document.querySelector('.domains').children[1];
    result = document.querySelector('.results');
    [input] = [form.children[0]];
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
