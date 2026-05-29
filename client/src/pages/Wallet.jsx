import { useEffect, useState } from 'react'
import { getWalletBalance, getWalletTransactions, topUpWallet } from '../services/paymentService.js'
import { formatINRFromPaise, rupeesToPaise } from '../utils/currency.js'
import { useToast } from '../context/ToastContext.jsx'

const Wallet = () => {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const { success: toastSuccess, error: toastError } = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [addAmount, setAddAmount] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [{ data: w }, { data: txs }] = await Promise.all([getWalletBalance(), getWalletTransactions()])
      setWallet(w)
      setTransactions(txs)
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    const amt = Number(addAmount)
    if (!amt || amt <= 0) return toastError('Enter a valid amount')
    try {
      const { data } = await topUpWallet({ amount: rupeesToPaise(amt) })
      setWallet(data.wallet)
      setTransactions((prev) => [data.transaction, ...prev])
      setShowAdd(false)
      setAddAmount('')
      toastSuccess('Wallet topped up')
    } catch (e) {
      toastError(e?.data?.message || e?.message || 'Top-up failed')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Wallet</h1>
            <p className="mt-1 text-sm text-slate-600">Manage balance and transactions</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Balance</p>
            <p className="text-xl font-semibold">{wallet ? formatINRFromPaise(wallet.balance) : '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Transactions</h2>
              <div>
                <button onClick={() => setShowAdd(true)} className="rounded-full bg-brand-600 px-3 py-2 text-sm text-white">Add money</button>
              </div>
            </div>
            <div className="mt-4">
              {loading ? (
                <p className="text-sm text-slate-500">Loading…</p>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-slate-500">No transactions yet.</p>
              ) : (
                <ul className="space-y-3">
                  {transactions.map((t) => (
                    <li key={t._id} className="flex items-center justify-between rounded-2xl border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{t.type === 'credit' ? 'Credit' : 'Debit'}</span>
                          <span className="text-sm text-slate-500">{t.method}</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">{t.description}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>{formatINRFromPaise(t.amount)}</div>
                        <div className="text-xs text-slate-500">Balance: {formatINRFromPaise(t.balanceAfter)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
            <div className="mt-4 flex flex-col gap-3">
              <button onClick={() => setShowAdd(true)} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Add money</button>
            </div>
          </div>
        </aside>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold">Add money to wallet</h3>
            <form onSubmit={handleAdd} className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm text-slate-600">Amount (INR)</span>
                <input type="number" step="1" min="1" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className="mt-2 w-full rounded-2xl border px-4 py-2" />
              </label>
              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-full border px-4 py-2">Cancel</button>
                <button type="submit" className="rounded-full bg-brand-600 px-4 py-2 text-white">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wallet
