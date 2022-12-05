import { useState } from 'react'
import { Chain, chainConfigs, IChainConfig } from 'chain';
import { Window as KeplrWindow, Key } from '@keplr-wallet/types'
import { convertFromMicroDenom } from 'util/conversion';

declare global {
  interface Window extends KeplrWindow {}
}

export interface IWalletInfo extends Key, IChainConfig { }

export interface ISigningCosmWasmClientContext {
  wallets: IWalletInfo[],
  loading: boolean
  error: any
  connectWallet: any
  disconnect: Function
}

export const suggestChain = async (config: IChainConfig) => {
  if (window.keplr && window.keplr.experimentalSuggestChain) {
    const currency = { 
      coinDenom: convertFromMicroDenom(config.denom), 
      coinMinimalDenom: config.denom, 
      coinDecimals: 6, 
      coinGeckoId: "terra-luna-2", 
    };

    try {
      await window.keplr.experimentalSuggestChain({
        chainId: config.chainId,
        chainName: config.chainName,
        rpc: config.rpcEndpoint,
        rest: config.lcdEndpoint,
        bip44: {
          coinType: config.coinType,
        },
        bech32Config: {
          bech32PrefixAccAddr: config.prefix,
          bech32PrefixAccPub: config.prefix + "pub",
          bech32PrefixValAddr: config.prefix + "valoper",
          bech32PrefixValPub: config.prefix + "valoperpub",
          bech32PrefixConsAddr: config.prefix + "valcons",
          bech32PrefixConsPub: config.prefix + "valconspub",
        },
        currencies: [ currency ],
        feeCurrencies: [{
            ...currency,
            //gasPriceStep: {
              //low: 0.01,
              //average: 0.025,
              //high: 0.04,
            //},
        }],
        stakeCurrency: currency,
      })
    } catch { }
  } else {
    alert('Please use the recent version of keplr extension')
  }
}

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [wallets, setWallets] = useState<IWalletInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = async () => {
    try {
      if (!window.keplr /*|| !window.getOfflineSigner*/) {
        alert('Please install keplr extension')
      } else {
        
        setLoading(true)
        console.log('Wallet connected!');
        
        let connectedWallets = [];
        for (const chain of [Chain.osmosis, Chain.columbus]) {
          const chainConfig = chainConfigs[chain]
          
          try {
            //try to connect the chain if added already
            await window.keplr.enable(chainConfig.chainId)
            const key = await window.keplr.getKey(chainConfig.chainId);

            connectedWallets.push({...key, ...chainConfig})
          } catch (enableError: any) {

            //if failed to connect, check if user rejected or keplr has no chain info
            if(enableError?.message.includes('rejected')) {
              //do nothing user rejected to connect to this chain
              console.log(`Failed to connect ${chainConfig.chainName}. User rejected.`)
            } else {
              //try to suggest chain
              try {
                await suggestChain(chainConfig);
                const key = await window.keplr.getKey(chainConfig.chainId);
                connectedWallets.push({...key, ...chainConfig})
              } catch (suggestError) {
                console.log(`Failed to suggest ${chainConfig.chainName}. User rejected.`)
              }
            }
          }
        }
        setWallets(connectedWallets);
        setLoading(false)
        setError(null)
      }

    } catch (error) {
      console.log('Something went wrong', error);
      setError('Something went wrong. Try reconnecting the wallet again!');
      setLoading(false)
    }
  }

  const disconnect = () => {
    setWallets([])
    setLoading(false)
  }

  return {
    wallets,
    loading,
    error,
    connectWallet,
    disconnect,
  }
}
