/* 4. Создал отдельный basket.js файл, подключил в html. Далее работа будет только
в данном js - файле. */
'use strict';

const el_basketCounter = document.querySelector('.cartIconWrap span');
const el_basketTotal = document.querySelector('.basketTotal');
const el_basketTotalValue = document.querySelector('.basketTotalValue');
const el_basket = document.querySelector('.basket');

/* 5. Поставил в js обработчик на открытие/закрытие окна корзины (ставлю/снимаю)
класс hidden у элемента с классом basket при клике на элемент с классом
cartIconWrap.*/

/**
 * Обработчик открытия корзины при клике на ее значок.
 */
document.querySelector('.cartIconWrap').addEventListener('click', () => {
  el_basket.classList.toggle('hidden');
});

/* 6. Создал пустой объект, который в памяти страницы будет хранить добавленные
товары:*/
/**
 * В корзине хранится количество каждого товара
 * Ключ это id продукта, значение это товар в корзине - объект, содержащий
 * id, название товара, цену, и количество штук, например:
 * {
 *    1: {id: 1, name: "product 1", price: 30, count: 2},
 *    3: {id: 3, name: "product 3", price: 25, count: 1},
 * }
 */
const basket = {};

/* 7. Далее надо сделать так, чтоб при клике на кнопки "Добавить в корзину"
(в макете "Add to cart"), мы могли обработать добавление в корзину данных.
Для этого я делегировал событие, повесил один обработчик события клика на
ближайшего общего предка всех кнопок, это элемент с классом featuredItems.
Внутри обработчика надо проверить, если мы кликнули не по тому элементу, по
которому нужно было (по кнопке добавить в корзину), то просто возвращаюсь из
функции.

Если клик был по нужному элементу (по "кнопке"), тогда получаю у родителя с
классом featuredItem данные из data-атрибутов, которые ставили в п.3. И вызываю
созданную мной функцию addToCart, в которой происходит добавление продукта. */
/**
 * Обработчик клика на кнопку "Добавить в корзину" с деленированием события.
 * Событие вешается на ближайшего общего для всех кнопок предка.
 */
document.querySelector('.featuredItems').addEventListener('click', event => {
  // Проверяем, если клик был не по кнопке с селектором ".addToCart", а также
  // такого селектора не существует среди родителей элемента, по которому был
  // произведен клик, то ничего не делаем, уходим из функции.
  if (!event.target.closest('.addToCart')) {
    return;
  }
  // Получаем ближайшего родителя с классом featuredItem, в нем записаны все
  // нужные данные о продукте, получаем эти данные.
  const el_featuredItem = event.target.closest('.featuredItem');
  const id = +el_featuredItem.dataset.id;
  const name = el_featuredItem.dataset.name;
  const price = +el_featuredItem.dataset.price;
  // Добавляем в корзину продукт.
  addToCart(id, name, price);
});

/* 8. Функция addToCart должна:
8.1. В объект basket добавить новый продукт или изменить имеющийся.
8.2. В html отрисовать новое количество добавленных товаров у значка корзины.
8.3. Отрисовать новую общую стоимость товаров в корзине.
8.4. Отрисовать правильно строку в окне корзины, в которой записаны все данные
о товаре. */
/**
 * Функция добавляет продукт в корзину.
 * @param {number} id - Id продукта.
 * @param {string} name - Название продукта.
 * @param {number} price - Цена продукта.
 */
function addToCart(id, name, price) {
  // Если такого продукта еще не было добавлено в наш объект, который хранит
  // все добавленные товары, то создаем новый объект.
  if (!(id in basket)) {
    basket[id] = { id: id, name: name, price: price, count: 0 };
  }
  // Добавляем в количество +1 к продукту.
  basket[id].count++;
  // Ставим новое количество добавленных товаров у значка корзины.
  el_basketCounter.textContent = getTotalBasketCount().toString();
  // Ставим новую общую стоимость товаров в корзине.
  el_basketTotalValue.textContent = getTotalBasketPrice().toFixed(2);
  // Отрисовываем продукт с данным id.
  renderProductInBasket(id);
}

/**
 * Считает и возвращает количество продуктов в корзине.
 * @return {number} - Количество продуктов в корзине.
 */
function getTotalBasketCount() {
  return Object.values(basket).reduce((acc, product) => acc + product.count, 0);
}

/**
 * Считает и возвращает итоговую цену по всем добавленным продуктам.
 * @return {number} - Итоговую цену по всем добавленным продуктам.
 */
function getTotalBasketPrice() {
  return Object
    .values(basket)
    .reduce((acc, product) => acc + product.price * product.count, 0);
}

/**
 * Отрисовывает в корзину информацию о продукте.
 * @param {number} productId - Id продукта.
 */
function renderProductInBasket(productId) {
  // Получаем строку в корзине, которая отвечает за данный продукт.
  const el_basketRow = el_basket
    .querySelector(`.basketRow[data-id="${productId}"]`);
  // Если такой строки нет, то отрисовываем новую строку.
  if (!el_basketRow) {
    renderNewProductInBasket(productId);
    return;
  }

  // Получаем данные о продукте из объекта корзины, где хранятся данные о всех
  // добавленных продуктах.
  const product = basket[productId];
  // Ставим новое количество в строке продукта корзины.
  el_basketRow.querySelector('.productCount').textContent = product.count;
  // Ставим нужную итоговую цену по данному продукту в строке продукта корзины.
  el_basketRow
    .querySelector('.productTotalRow')
    .textContent = (product.price * product.count).toFixed(2);
}

/**
 * Функция отрисовывает новый товар в корзине.
 * @param {number} productId - Id товара.
 */
function renderNewProductInBasket(productId) {
  const productRow = `
    <div class="basketRow" data-id="${productId}">
      <div>${basket[productId].name}</div>
      <div>
        <span class="productCount">${basket[productId].count}</span> шт.
      </div>
      <div>$${basket[productId].price}</div>
      <div>
        $<span class="productTotalRow">${(basket[productId].price * basket[productId].count).toFixed(2)}</span>
      </div>
    </div>
    `;
  el_basketTotal.insertAdjacentHTML("beforebegin", productRow);
}