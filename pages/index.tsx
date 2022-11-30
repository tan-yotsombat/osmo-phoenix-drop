import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { getOsmoAddress, getTerraAddress } from 'util/conversion'
import Image from 'next/image'
import TerraWallet from 'components/TerraWallet'

const Home: NextPage = () => {
  const { wallets } = useSigningClient()

  return (
    <WalletLoader>
      <div className="mt-3 text-2xl">
        Your Osmosis wallet address is
        <pre className="break-all whitespace-pre-wrap">
          {getOsmoAddress(wallets)}
        </pre>
      </div>
      <p>Which can be derived into 2 Terra addresses based on
        <a className="pl-1 link link-primary link-hover" href="https://medium.com/chainapsis/keplr-explained-coin-type-118-9781d26b2c4e">Coin Type</a>
      </p>
      
      <div>
        <Image src="/arrows-down-icon.svg" alt="arrow" width={64} height={64} />
      </div>

      <div className='grid grid-cols-2 gap-2 md:gap-16'>
        <div>
          <TerraWallet header='Coin Type 118 - Keplr/Osmo' terraAddress={getTerraAddress(wallets, 118)} addNetworkButton={true}/>
        </div>
        <div>
          <TerraWallet header='Coin Type 330 - Terra Station' terraAddress={getTerraAddress(wallets, 330)}/>
        </div>
      </div>
    </WalletLoader>
  )
}

export default Home
