import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { verifyPayment, createPaymentOrder, getWalletBalance, topUpWallet, walletPay } from '../services/paymentService.js'
import EmptyState from '../components/EmptyState.jsx'
import Button from '../components/Button.jsx'
import { rupeesToPaise, formatINRFromPaise, paiseToRupeesNumber } from '../utils/currency.js'

const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID
const isRazorpayEnabled = Boolean(razorpayKeyId)

const Checkout = () => {
  const { booking, resetBooking } = useBooking()
  const navigate = useNavigate()
  const { error: toastError, success: toastSuccess } = useToast()
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    guests: booking.guests || 2,
    termsAccepted: false,
  })
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('wallet')
  const [walletBalance, setWalletBalance] = useState(null)

  const nights = useMemo(() => {
    if (!booking.dates?.checkIn || !booking.dates?.checkOut) return 1
    const start = new Date(booking.dates.checkIn)
    const end = new Date(booking.dates.checkOut)
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
  }, [booking.dates])

  // Calculate amounts in paise to avoid floating point issues
  const roomPricePaise = Math.round((booking.room?.price || 0) * 100)
  const roomTotalPaise = roomPricePaise * nights
  const taxesPaise = Math.round((roomTotalPaise * 12) / 100)
  const totalAmountPaise = roomTotalPaise + taxesPaise

  const handleInput = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error('Unable to load Razorpay checkout script'))
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async () => {
    setErrorMessage('')
    if (!formState.firstName || !formState.lastName || !formState.email || !formState.phone || !booking.room || !booking.hotel || !booking.dates?.checkIn || !booking.dates?.checkOut) {
      setErrorMessage('Please complete all required fields and select a room first.')
      return
    }
    if (!formState.termsAccepted) {
      setErrorMessage('Please accept the terms and conditions to continue.')
      return
    }

    setPaymentLoading(true)

    try {
      if (isRazorpayEnabled) {
        await loadRazorpayScript()
      }

      const bookingPayload = {
        hotelId: booking.hotel._id,
        roomId: booking.room._id,
        checkIn: booking.dates.checkIn,
        checkOut: booking.dates.checkOut,
        guests: Number(formState.guests),
        totalAmount: totalAmountPaise,
        customer: {
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          phone: formState.phone,
          city: formState.city,
          country: formState.country,
        },
      }

      const orderPayload = {
        amount: totalAmountPaise,
        currency: 'INR',
        demo: !isRazorpayEnabled,
      }
      // Wallet payment
      if (paymentMethod === 'wallet') {
        try {
          const { data } = await walletPay({ amount: totalAmountPaise, bookingPayload })
          resetBooking()
          toastSuccess('Payment successful via wallet and booking confirmed.')
          navigate('/confirmation', {
            state: {
              bookingId: data.booking._id,
              hotel: booking.hotel,
              room: booking.room,
              dates: booking.dates,
              guests: formState.guests,
              total: paiseToRupeesNumber(totalAmountPaise),
              customer: bookingPayload.customer,
            },
          })
          return
        } catch (wErr) {
          const message = wErr?.message || wErr?.data?.message || 'Wallet payment failed.'
          toastError(message)
          setErrorMessage(message)
          setPaymentLoading(false)
          return
        }
      }

      const { data: orderData } = await createPaymentOrder(orderPayload)

      if (!isRazorpayEnabled) {
        const { data: verifiedBooking } = await verifyPayment({
          razorpay_order_id: orderData.id,
          razorpay_payment_id: 'demo_payment',
          razorpay_signature: 'demo_signature',
          bookingPayload,
          demo: true,
        })

        resetBooking()
        toastSuccess('Demo payment successful and booking confirmed.')
        navigate('/confirmation', {
          state: {
            bookingId: verifiedBooking._id,
            hotel: booking.hotel,
            room: booking.room,
            dates: booking.dates,
            guests: formState.guests,
            total: paiseToRupeesNumber(totalAmountPaise),
            customer: bookingPayload.customer,
          },
        })
        return
      }

      const options = {
        key: razorpayKeyId,
        amount: orderPayload.amount,
        currency: orderPayload.currency,
        name: booking.hotel.name,
        description: `${booking.room.roomType} reservation`,
        order_id: orderData.id,
        prefill: {
          name: `${formState.firstName} ${formState.lastName}`,
          email: formState.email,
          contact: formState.phone,
        },
        theme: { color: '#4b5563' },
        handler: async (response) => {
          try {
            const { data: verifiedBooking } = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingPayload,
            })

            resetBooking()
            toastSuccess('Payment successful and booking confirmed.')
            navigate('/confirmation', {
              state: {
                bookingId: verifiedBooking._id,
                hotel: booking.hotel,
                room: booking.room,
                dates: booking.dates,
                guests: formState.guests,
                total: paiseToRupeesNumber(totalAmountPaise),
                customer: bookingPayload.customer,
              },
            })
          } catch (verifyError) {
            console.error(verifyError)
            const message = verifyError?.message || 'Payment succeeded, but verification failed.'
            toastError(message)
            setErrorMessage(message)
          } finally {
            setPaymentLoading(false)
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error(error)
      const message = error?.message || 'Unable to initialize payment. Please try again.'
      toastError(message)
      setErrorMessage(message)
      setPaymentLoading(false)
    }
  }

  const loadWallet = async () => {
    try {
      const { data } = await getWalletBalance()
      setWalletBalance(data.balance)
    } catch (e) {
      // ignore when not logged in
    }
  }

  const handleTopUp = async () => {
    const input = window.prompt('Enter amount to add to wallet (e.g. 1000)')
    const amt = Number(input)
    if (!amt || amt <= 0) return
    try {
      const { data } = await topUpWallet({ amount: rupeesToPaise(amt) })
      setWalletBalance(data.wallet.balance)
      toastSuccess('Wallet topped up successfully')
    } catch (e) {
      toastError(e?.data?.message || e?.message || 'Top-up failed')
    }
  }

  useEffect(() => {
    if (!booking.hotel || !booking.room || !booking.dates?.checkIn || !booking.dates?.checkOut) {
      navigate('/hotels')
    }
    loadWallet()
  }, [booking, navigate])

  if (!booking.hotel || !booking.room) {
    return (
      <EmptyState
        icon="💳"
        title="Checkout unavailable"
        description="Please select a hotel and room before visiting checkout."
      >
        <Button variant="primary" onClick={() => navigate('/hotels')}>Browse hotels</Button>
      </EmptyState>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Secure checkout</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Confirm your reservation</h1>
          <p className="mt-2 text-slate-600">Complete your booking with guest details and secure payment.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Guest information</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { name: 'firstName', label: 'First Name' },
              { name: 'lastName', label: 'Last Name' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'phone', label: 'Phone', type: 'tel' },
              { name: 'city', label: 'City' },
              { name: 'country', label: 'Country' },
            ].map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm text-slate-600">{field.label}</span>
                <input
                  type={field.type || 'text'}
                  value={formState[field.name]}
                  onChange={(e) => handleInput(field.name, e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </label>
            ))}
            <label className="block md:col-span-2">
              <span className="text-sm text-slate-600">Number of guests</span>
              <input
                type="number"
                min="1"
                value={formState.guests}
                onChange={(e) => handleInput('guests', e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Payment method</h2>
          <div className="mt-6 rounded-3xl bg-slate-50 p-6 shadow-sm">
            <p className="text-slate-600">
              {isRazorpayEnabled
                ? 'Secure Razorpay checkout will open once you confirm.'
                : 'Razorpay is not configured for this demo. Your payment will be simulated and the booking will still complete.'}
            </p>
            <div className="mt-4 flex gap-4 items-center">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod==='wallet'} onChange={() => setPaymentMethod('wallet')} />
                <span className="text-sm">Wallet</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod==='razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                <span className="text-sm">Card / Razorpay</span>
              </label>
            </div>
            <div className="mt-4 grid gap-4">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Card ending in 4242</p>
                <p className="text-slate-500">Expires 04/26</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={paymentLoading}
                className="rounded-full bg-brand-600 px-5 py-4 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {paymentLoading ? 'Processing payment...' : isRazorpayEnabled ? 'Confirm and Pay' : 'Simulate payment'}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 p-6">
          <div className="flex items-start gap-4">
            <input
              id="terms"
              type="checkbox"
              checked={formState.termsAccepted}
              onChange={(e) => handleInput('termsAccepted', e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="terms" className="text-slate-600">
              I accept the <span className="font-semibold text-slate-900">terms and conditions</span>, cancellation policy, and privacy notice.
            </label>
          </div>
          {errorMessage && <p className="mt-4 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</p>}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="sticky top-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Wallet balance</p>
              <p className="text-lg font-semibold">{walletBalance != null ? formatINRFromPaise(walletBalance) : '—'}</p>
            </div>
            <div>
              <button onClick={handleTopUp} className="rounded-full border px-3 py-2 text-sm">Add Money</button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Reservation summary</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{booking.hotel.name}</h2>
            </div>
            <p className="text-sm text-slate-500">{booking.hotel.city}</p>
          </div>

          <div className="mt-6 space-y-4 text-slate-600">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{booking.room.name || booking.room.roomType}</p>
              <p className="mt-1 text-sm">{booking.room.description || booking.room.roomType}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>Check-in</span>
              <span className="text-right">{booking.dates?.checkIn}</span>
              <span>Check-out</span>
              <span className="text-right">{booking.dates?.checkOut}</span>
              <span>Guests</span>
              <span className="text-right">{formState.guests}</span>
              <span>Duration</span>
              <span className="text-right">{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4">
              <div className="flex items-center justify-between text-slate-700">
                <span>Room subtotal</span>
                <span>{formatINRFromPaise(roomTotalPaise)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-slate-700">
                <span>Taxes & fees</span>
                <span>{formatINRFromPaise(taxesPaise)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
              <span>Total</span>
              <span>{formatINRFromPaise(totalAmountPaise)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Checkout
