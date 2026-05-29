import api from './api'

export const createPaymentOrder = (payload) => api.post('/api/payments/create-order', payload)
export const verifyPayment = (payload) => api.post('/api/payments/verify', payload)
export const getWalletBalance = () => api.get('/api/wallets/balance')
export const getWalletTransactions = () => api.get('/api/wallets/transactions')
export const topUpWallet = (payload) => api.post('/api/wallets/topup', payload)
export const walletPay = (payload) => api.post('/api/wallets/pay', payload)
