export const getDiscountPrice = (originalPrice, discountPrice) => {
    const discount = originalPrice - discountPrice;

    const discountPercent = (discount / originalPrice) * 100;
    return discountPercent.toFixed(2);
}