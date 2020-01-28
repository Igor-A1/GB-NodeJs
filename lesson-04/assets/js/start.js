let error = null,
  data = null,
  output = document.getElementById('output')
  
const showError = e => {
    output.innerHTML = `<div class="error">ОШИБКА :: ${e}</div>`
  }
  
const changeCathegories = index => {
  let d = data[index]
  opts = ''
  d.cat.forEach((cat, i) => 
    opts += `<option value="${i}"${i === 0 ? selected="selected" : ''}>${cat.title}</option>`)
  document.getElementById('cathegory').innerHTML = opts
}

// load news servers parameters
(async () => {
  try {
    let response = await fetch('./js/data.json')
    data = await response.json()
  } catch(e) {error = e; showError(e)}
})()

/*!
 * Serialize all form data into an array
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
var serializeArray = function (form) {

  // Setup our serialized data
  var serialized = [];

  // Loop through each field in the form
  for (var i = 0; i < form.elements.length; i++) {

    var field = form.elements[i];

    // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
    if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

    // If a multi-select, get all selections
    if (field.type === 'select-multiple') {
      for (var n = 0; n < field.options.length; n++) {
        if (!field.options[n].selected) continue;
        serialized.push({
          name: field.name,
          value: field.options[n].value
        });
      }
    }

    // Convert field data to a query string
    else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      serialized.push({
        name: field.name,
        value: field.value
      });
    }
  }

  return serialized;

};

async function reqNews(url, method, req) {
  let response = await fetch(url, {
    method: method,
    headers: {'Content-Type': 'application/json;charset=utf-8'},
    body: JSON.stringify(req)
  })
  return await response.json()
}

async function queryLoad(e) {
  e.preventDefault()
  let data = {};
  output.innerHTML = '<div class="loading">... загружаем новости ...</div>'
  serializeArray(form).forEach(item => data[item.name] = item.value)
  //console.log(data)
  res = await reqNews('/load', 'POST', data)
  if(res.data === null)
    showError(res.error)
  else {
    let s = '<ul class="newslist">'
    res.data.forEach(d => s += `<li>${d}</li>`)
    s += '</ul><hr>'
    output.innerHTML = s
  }
}

const form = document.getElementById('filters')
form.addEventListener('submit', queryLoad)
 

