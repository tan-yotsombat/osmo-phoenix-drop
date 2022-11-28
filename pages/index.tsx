import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { getOsmoAddress, getTerraAddress } from 'util/conversion'

const Home: NextPage = () => {
  const { wallets } = useSigningClient()

  return (
    <WalletLoader>
      <h1 className="text-6xl font-bold">
        Hi!
      </h1>

      <div className="mt-3 text-2xl">
        Your Osmosis wallet address is:{' '}
        <pre className="font-mono break-all whitespace-pre-wrap">
          {getOsmoAddress(wallets)}
        </pre>
      </div>

      <div className='container'>
        <div className="columns-2 text-xl font-bold">
          <div><h3>Coin Type 118 - Keplr/Osmo</h3></div>
          <div><h3>Coin Type 330 - Terra Station</h3></div>
        </div>
        <div className="columns-2 text-lg">
          <div>{getTerraAddress(wallets, 118)}</div>
          <div>{getTerraAddress(wallets, 330)}</div>
        </div>
      </div>
    </WalletLoader>
  )
}

export default Home
