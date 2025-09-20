/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */

function calculateBonusByProfit(index, total, seller) {
   const { profit } = seller;
    // @TODO: Расчёт бонуса от позиции в рейтинге
}

function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчёт прибыли от операции
   // purchase — это одна из записей в поле items из чека в data.purchase_records
   // _product — это продукт из коллекции data.products
   const { discount, sale_price, quantity } = purchase;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */




function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных
    if (!data
        || condition1
        || condition2
    ) {
        throw new Error('Некорректные входные данные');
    } 
    
    typeof options === "object"

    if (!someVar || !otherVar) {
        throw new Error('Чего-то не хватает');
    } 

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчёт выручки и прибыли для каждого продавца
    const { calculateRevenue, calculateBonus } = options; // Сюда передадим функции для расчётов

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}

function calculateSimpleRevenue(purchase, _product) {
   // purchase — это одна из записей в поле items из чека в data.purchase_records
   // _product — это продукт из коллекции data.products
   const { discount, sale_price, quantity } = purchase;
}