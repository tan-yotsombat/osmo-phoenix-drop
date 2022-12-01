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
          <TerraWallet header='Coin Type 118 - Keplr/Osmo' terraAddress={getTerraAddress(wallets, 118)}/>
        </div>
        <div>
          <TerraWallet header='Coin Type 330 - Terra Station' terraAddress={getTerraAddress(wallets, 330)}/>
        </div>
      </div>
      <button className="p-2 mt-4 text-center border border-secondary hover:border-primary rounded-xl hover:text-primary focus:text-primary-focus"
        onClick={ asyncSuggestPhoenix }>
        <p className="text-lg">
          Add Terra 2.0 to Keplr
        </p>
      </button>
      <p className="text-sm mt-1">If nothing happens, you might added Terra 2.0 to Keplr already! You can remove and add the chain again, Keplr will ask you to select either 118 or 330 account.</p>
    </WalletLoader>
  )
}

export default Home
