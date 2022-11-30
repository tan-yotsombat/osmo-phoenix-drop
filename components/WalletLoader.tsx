import { ReactNode } from 'react'
import { useSigningClient } from 'contexts/cosmwasm'
import Loader from './Loader'

function WalletLoader({
  children,
  loading = false,
}: {
  children: ReactNode
  loading?: boolean
}) {
  const {
    wallets,
    loading: clientLoading,
    error,
    connectWallet,
  } = useSigningClient()

  if (loading || clientLoading) {
    return (
      <div className="flex justify-center">
        <Loader />
      </div>
    )
  }

  if (wallets.length === 0) {
    return (
      <div className="max-w-full">
        <h1 className="text-4xl font-bold">
          Did you know, LUNAtics? 
        </h1>
        <p className="mt-3 text-2xl md:max-w-4xl">
          If you provided liquidity on OSMO/LUNC or OSMO/USTC pool during Terra Collapse, you might get LUNA 2.0 airdrop to 2 Terra accounts.
        </p>

        <p className="mt-6 text-xl">
          Connect your
          <a className="pl-1 link link-primary link-hover" href="https://keplr.app/">Keplr wallet </a>
          and check now.
        </p>

        <div className="flex flex-wrap items-center justify-around mt-2 sm:w-full">
          <button
            className="p-6 mt-6 text-left border border-secondary hover:border-primary w-96 rounded-xl hover:text-primary focus:text-primary-focus"
            onClick={connectWallet}
          >
            <h3 className="text-2xl font-bold">Connect your wallet &rarr;</h3>
            <p className="mt-4 text-xl">
              Get your Keplr wallet connected now
            </p>
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return <code>{JSON.stringify(error)}</code>
  }

  return <>{children}</>
}

export default WalletLoader
