import { CheckIcon } from '@heroicons/react/20/solid'

const includedFeatures = [
  'Unlimited password storage',
  'Unlimited note storage',
  'Password generator',
  'Additional features',
]

export default function BuyPremium() {
  return (
    <div className="bg-black py-24 sm:py-12 w-screen h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <div className="md:py-2 text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-500 via-pink-600 to-red-600 bg-clip-text text-transparent sm:text-5xl">Get everything, forever.</div>
          <p className="mt-6 text-xl leading-8 text-zinc-200">
          Get lifetime access to unlimited password and note storage, plus any new feature we add in the future for a simple one-time price.
          </p>
        </div>
        <div className="bg-neutral-950 mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-zinc-700 sm:mt-14 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto text-white">
            <h3 className="text-2xl font-bold">Lifetime membership</h3>
            <p className="mt-6 text-base ">
              Trapped in credential chaos? Save and manage login credentials, personal information, and more in SHIELD for a simpler, more secure life.
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold ">What’s included</h4>
              <div className="h-px flex-auto bg-zinc-700" />
            </div>
            <ul
              className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 sm:grid-cols-2 sm:gap-6"
            >
              {includedFeatures.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-yellow-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 text-zinc-200">
            <div className="rounded-2xl bg-secondary py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-12">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold ">Pay once, use it forever</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight">₹1499</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide">INR</span>
                </p>
                <a
                  href="/payment"
                  className="mt-10 block w-full rounded-md bg-violet-800 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
                >
                  Get premium
                </a>
                <p className="mt-6 text-xs leading-5 text-zinc-400">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
