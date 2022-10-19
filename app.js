const input = document.querySelector('.js_input') //инпут
const list = document.querySelector('.js_list') //список подсказок
const topItems = document.querySelectorAll('.js_top_item') //поля подсказок
const bottomList = document.querySelector('.js_bottom_list') //нижний список

let clearResults = {} //хранилище результатов поиска

// слушаем ввод в инпут
input.addEventListener('keyup', debounce(getRepositories, 500))

// получаем репозитории
async function getRepositories() {
  // если поле ввода не пустое
  if (input.value) {
    let answer = await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5&sort=stars`);
    let result = await answer.json();

    // все результаты поиска сохраняем в очищенном виде
    result.items.forEach(item => {
      let name = item['name']
      let login = item['owner']['login']
      let stars = item['stargazers_count']
      clearResults[name] = [login, stars]

      console.log('clearResults[name]', clearResults[name]);
    })

    // открываем список подсказок
    list.classList.add('active')

    // заполняем список подсказок
    for (let i = 0; i < 5; i++) {
      topItems[i].innerHTML = `${result.items[i]['name']}`
    }

    // console.log(clearResults);

  } else {
    // если поле очистили, то списко подсказок скрыли
    list.classList.remove('active')
  }
}

// игнорируем лишние промежуточные запросы
function debounce(fn, debounceTime) {
  let curentTimeout = null;

  let wrapper = function () {
    const fnCall = () => {
      fn.apply(this, arguments)
    }

    clearTimeout(curentTimeout)

    curentTimeout = setTimeout(fnCall, debounceTime)
  }

  return wrapper
}

// при клике на название из списка создаём карточку с описанием
list.addEventListener('click', (e) => {
  if (e.target.closest('.js_top_item')) {
    
    makeCard(e.target.innerHTML)

    list.classList.remove('active')
    input.value = ''
  }
})

function makeCard(content) {
  const item = document.createElement('li')
  item.classList.add('bottom__item')
  item.classList.add('js_bottom_card')

  // вытаскиваем из "чистых" результатов поиска дополительные данные по ключу Имя 
  let owner = clearResults[content][0]
  let stars = clearResults[content][1]

  item.innerHTML = `
                <div class="bottom__content">
                    <div class="bottom__row">
                        <span class="bottom__span">Name: </span>
                        <span class="bottom__span">${content}</span>
                    </div>
                    <div class="bottom__row">
                        <span class="bottom__span">Owner: </span>
                        <span class="bottom__span">${owner}</span>
                    </div>
                    <div class="bottom__row">
                        <span class="bottom__span">Stars: </span>
                        <span class="bottom__span">${stars}</span>
                    </div>
                </div>

                <button class="bottom__delete-btn js_card_delete_btn" type="button"></button>
  `

  bottomList.append(item)

  // навешиваем слушатель на закрывашку
  activateDeleteBtns()
}



// вешаем карточкам закрывашки
function activateDeleteBtns() {
  let repCards = document.querySelectorAll('.js_bottom_card')

  repCards.forEach(card => {
    card.addEventListener('click', (e) => {

      // удаляем при клике на кнопку
      if (e.target.closest('.js_card_delete_btn')) {
        console.log('if');

        card.remove()
      }
    })
  })

}