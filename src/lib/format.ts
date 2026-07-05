export function formatEventDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatMoney(amount: number, currency = 'ZMW'): string {
  return `${currency} ${amount.toLocaleString('en-ZM')}`
}
