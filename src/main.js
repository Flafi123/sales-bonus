
function calculateBonusByProfit(index, total, seller) {
    if (index === 0) {
        return seller.profit * 0.15;
    } else if (index === 1 || index === 2) {
        return seller.profit * 0.1;
    } else if (index === total - 1) {
        return 0;
    } else {
        return seller.profit * 0.05;
    }
}

function calculateSimpleRevenue(purchase, _product) {
    const { discount, sale_price, quantity } = purchase;
    return sale_price * quantity * (1 - discount / 100);
}

function analyzeSalesData(data, options) {
    if (!data || !data.sellers || !data.customers || !data.products || !data.purchase_records) {
        throw new Error('Некорректные входные данные');
    }

    if (typeof options !== "object") {
        throw new Error('Опции должны быть объектом');
    }

    const { calculateRevenue = calculateSimpleRevenue, calculateBonus = calculateBonusByProfit } = options;

    // Создаем статистику по продавцам
    const sellerStats = data.sellers.map(seller => ({
        seller_id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        products_sold: {},
        profit: 0,
        revenue: 0,
        sales_count: 0,
        bonus: 0,
        top_products: []
    }));

    // Индексы для быстрого доступа
    const sellerIndex = Object.fromEntries(sellerStats.map(s => [s.seller_id, s]));
    const productIndex = Object.fromEntries(data.products.map(p => [p.sku, p]));

    // Обработка чеков
    data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id];
        if (!seller) {
            console.warn(`Продавец не найден: ${record.seller_id}`);
            return;
        }

        seller.sales_count++;

        record.items.forEach(item => {
            const product = productIndex[item.sku];
            if (!product) {
                console.warn(`Товар не найден: ${item.sku}`);
                return;
            }

            const cost = product.purchase_price * item.quantity;
            const revenue = calculateRevenue(item, product);
            const itemProfit = revenue - cost;

            seller.profit += itemProfit;
            seller.revenue += revenue;

            // Учёт проданных товаров
            seller.products_sold[item.sku] = (seller.products_sold[item.sku] || 0) + item.quantity;
        });
    });

    // Сортировка по прибыли
    sellerStats.sort((a, b) => b.profit - a.profit);

    // Назначение бонусов и топ-товаров
    sellerStats.forEach((seller, index) => {
        seller.bonus = calculateBonus(index, sellerStats.length, seller);

        seller.top_products = Object.entries(seller.products_sold)
            .map(([sku, quantity]) => ({ sku, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10);
    });

    // Формируем результат
    return sellerStats.map(seller => ({
        seller_id: seller.seller_id,
        name: seller.name,
        revenue: +seller.revenue.toFixed(2),
        profit: +seller.profit.toFixed(2),
        sales_count: seller.sales_count,
        top_products: seller.top_products,
        bonus: +seller.bonus.toFixed(2)
    }));
}