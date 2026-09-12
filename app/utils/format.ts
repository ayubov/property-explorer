export const formatPrice = (price: number | null): string =>
  price == null || price < 1
    ? 'Price on request'
    : new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(price)

export const formatArea = (value: number | null): string =>
  value == null || value === 0 ? '—' : `${value} m²`
