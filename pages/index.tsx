import type { NextPage } from 'next'
import WalletLoader from 'components/WalletLoader'
import { useSigningClient } from 'contexts/cosmwasm'
import { getOsmoAddress, getTerraAddress } from 'util/conversion'
import Image from 'next/image'
import TerraWallet from 'components/TerraWallet'
import { suggestChain } from 'hooks/cosmwasm'
import { Chain, chainConfigs } from 'chain'

const Home: NextPage = () => {
  const { wallets } = useSigningClient()
  const asyncSuggestPhoenix = async () => { suggestChain(chainConfigs[Chain.phoenix]) }
  return (
    <WalletLoader>
      <div className="mt-3 text-2xl">
        Your Osmosis wallet address is
        <pre className="break-all whitespace-pre-wrap text-xl sm:text-2xl">
          {getOsmoAddress(wallets)}
        </pre>
      </div>
      <p>Which can be derived into 2 Terra addresses based on
        <a className="px-1 link link-primary link-hover" href="https://medium.com/chainapsis/keplr-explained-coin-type-118-9781d26b2c4e">Coin Type</a>
      </p>


      <div className='mt-6 grid grid-cols-1  gap-8 sm:grid-cols-5 sm:gap-0'>
        <div className='col-span-2'>
          <TerraWallet header='1. Coin Type 118 - Keplr/Osmo' terraAddress={getTerraAddress(wallets, 118)} />
        </div>
        <div className="hidden sm:block col-span-1">
          <Image src="/arrows-down-icon.svg" alt="arrow" width={64} height={64} />
        </div>
        <div className='col-span-2'>
          <TerraWallet header='2. Coin Type 330 - Terra Station' terraAddress={getTerraAddress(wallets, 330)} />
        </div>
      </div>
      <button className="p-4 mt-8 text-center border border-secondary hover:border-primary rounded-xl hover:text-primary focus:text-primary-focus"
        onClick={asyncSuggestPhoenix}>
        <p className="text-md sm:text-lg">
          Add Terra 2.0 to Keplr
        </p>
      </button>
      <p className="text-sm mt-2">If nothing happens, you might added Terra 2.0 to Keplr already! You can remove and add the chain again, Keplr will ask you to select either 118 or 330 account. It is recommended to use type 118, since you can you Terra Station Wallet for type 330.</p>
    </WalletLoader>
  )
}

export default Home
