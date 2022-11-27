import { useState } from 'react'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import chains, { Chain } from 'chain';
import { suggestChain } from 'services/keplr';

declare let window: Window;

export interface ISigningCosmWasmClientContext {
  walletAddress: string
  walletAddress330: string
  //signingClient: SigningCosmWasmClient | null
  loading: boolean
  error: any
  connectWallet: any
  disconnect: Function
}

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [walletAddress, setWalletAddress] = useState('')
  const [walletAddress330, setWalletAddress330] = useState('')
  //const [signingClient, setSigningClient] =
    //useState<SigningCosmWasmClient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = async () => {

    try {
      if (!window.getOfflineSigner || !window.keplr) {
        alert('Please install keplr extension')
      } else {
        
        setLoading(true)
        console.log('Wallet connected!');

        // enable website to access kepler
        // get osmosis address
        await window.keplr.enable(chains[Chain.osmosis].chainId)
        const offlineSigner = await window.getOfflineSigner(chains[Chain.osmosis].chainId)
        const [{ address }] = await offlineSigner.getAccounts()
        setWalletAddress(address)

        try {
          //try to connect to columbus
          await window.keplr.enable(chains[Chain.columbus].chainId)
        } catch (EnableError) {
          //if failed, try to suggest chain 
          try {
            await suggestChain(chains[Chain.columbus]);
            const offlineSignerColumbus = await window.getOfflineSigner(chains[Chain.columbus].chainId)
            const address330 = (await offlineSignerColumbus.getAccounts())[0].address;
            setWalletAddress330(address330)
          } catch (suggestError) {
            console.log('xx');
            setWalletAddress330('')
          }
        }
        

        // make client
        /*const client = await SigningCosmWasmClient.connectWithSigner(
          PUBLIC_RPC_ENDPOINT,
          offlineSigner,
        )
        setSigningClient(client)*/

        // get user address

        setLoading(false)
      }

    } catch (error) {
      console.log('Something went wrong', error);
      setError('Something went wrong');
    }
  }

  const disconnect = () => {
    /*if (signingClient) {
      signingClient.disconnect()
    }*/
    setWalletAddress('')
    //setSigningClient(null)
    setLoading(false)
  }

  return {
    walletAddress,
    walletAddress330,
    //signingClient,
    loading,
    error,
    connectWallet,
    disconnect,
  }
}
