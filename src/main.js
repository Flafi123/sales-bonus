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

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */

function calculateBonusByProfit(index, total, seller) {
    const { profit } = seller;
    // @TODO: Расчёт бонуса от позиции в рейтинге
    if (index === 0) {
        return 15;
    } else if (index === 1 || index === 2) {//второй или третий
        return 10;
    } else if (index === total) {//последний
        return 0;
    } else { // Для всех остальных
        return 5;
    }
}

function calculateSimpleRevenue(purchase, _product) {
    // @TODO: Расчёт прибыли от операции
    // purchase — это одна из записей в поле items из чека в data.purchase_records
    // _product — это продукт из коллекции data.products
    const { discount, sale_price, quantity } = purchase;
    discount = 1 - (purchase.discount / 100);   
    return sale_price * quantity * discount
}

function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных
    if (!data || !data.sellers || !data.customers || !data.products || !data.purchase_records
    ) {
        throw new Error('Некорректные входные данные');
    } 

    // @TODO: Проверка наличия опций

    typeof options === "object";

    if (!calculateSimpleRevenue || !analyzeSalesData) {
        throw new Error('Чего-то не хватает');
    } 

    // @TODO: Подготовка промежуточных данных для сбора статистики

    const sellerStats = data.sellers.map(seller => ({ //const sellerStats = data.customers.map(seller => ({
        // Заполним начальными данными
        seller_id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`
    })); 

    // @TODO: Индексация продавцов и товаров для быстрого доступа
    const someIndex = Object.fromEntries(data.sellers.map(item => [item.ID, item]));

    // @TODO: Расчёт выручки и прибыли для каждого продавца
    const { calculateRevenue, calculateBonus } = options; 
    
    // Сюда передадим функции для расчётов
    const sellerIndex = {id: sellerStats} // Ключом будет id, значением — запись из sellerStats
    
    const productIndex = {};
    data.products.forEach(product => {
        productIndex[product.sku] = product;
    });
     // Ключом будет sku, значением — запись из data.products
    console.log(sellerIndex);   
    console.log(productIndex);
    let sales_count = 0;
    let profit = 0;

    data.purchase_records.forEach(record => { // Чек 
        const seller = sellerIndex[record.seller_id]; // Продавец
        sales_count++; // Увеличить количество продаж 
        profit += record.total_amount; // Увеличить общую сумму всех продаж
        
        // Расчёт прибыли для каждого товара
        record.items.forEach(item => { 
            const product = productIndex[item.sku]; // Товар
            const cost = product.purchase_price * item.quantity; // Себестоимость 
            const revenue = calculateRevenue(item, product); // Выручка
            profit += revenue - cost; // Прибыль

            // Учёт количества проданных продуктов
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            seller.products_sold[item.sku] += item.quantity;
            // Учёт количества проданных товаров
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            // По артикулу товара увеличить его проданное количество у продавца
            seller.products_sold[item.sku] += item.quantity;
        });
    });
    // @TODO: Сортировка продавцов по прибыли
        sellerStats.sort((sellerA, sellerB) => sellerB.profit - sellerA.profit);
        // Сортируем продавцов по прибыли 
        sellerStats.forEach((seller, index) => {
        seller.bonus =  calculateBonusByProfit(index, sellerStats.length, seller); // Считаем бонус
        
        }); 
        // Формируем топ-10 товаров
        seller.top_products = (((Object.entries(seller.products_sold))
        .map( ([sku, quantity]) => ({ sku, quantity }) ))
        .sort((a, b) => b.quantity - a.quantity))
        .slice(0, 10);
    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями

    return sellerStats.map(seller => ({
        seller_id: seller.id, // Строка, идентификатор продавца
        name: seller.name,// Строка, имя продавца
        revenue: +profit.toFixed(2),// Число с двумя знаками после точки, выручка продавца
        profit: +profit.toFixed(2),// Число с двумя знаками после точки, прибыль продавца
        sales_count:  sales_count,// Целое число, количество продаж продавца
        top_products: top_products,// Массив объектов вида: { "sku": "SKU_008","quantity": 10}, топ-10 товаров продавца
        bonus: +bonus.toFixed(2)// Число с двумя знаками после точки, бонус продавца
    }));
}
