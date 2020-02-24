console.log('---> starting...')
let error = null,
  output = document.getElementById('notes_list')
  
const showError = e => {
    output.innerHTML = `<div class="error">ОШИБКА :: ${e}</div>`
}

function confirmDelete(id) {
  console.log(id)
  if(confirm('вы уверены ?'))
    location.href = `/delete?id=${id}`
}

function gotoEdit(id) {
  console.log(id)
  location.href = `/edit?id=${id}`
}

console.log('<--- done.')
