import { convertFromMicroDenom } from 'util/conversion'
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { IChainConfig } from 'chain';

declare global {
  interface Window extends KeplrWindow {}
}

export const suggestChain = async (config: IChainConfig) => {
  if (window.keplr && window.keplr.experimentalSuggestChain) {
    const currency = { 
      coinDenom: convertFromMicroDenom(config.denom), 
      coinMinimalDenom: config.denom, 
      coinDecimals: 6, 
      //coinGeckoId: "cosmos", 
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
    } catch {
      alert('Failed to suggest the chain')
    }
  } else {
    alert('Please use the recent version of keplr extension')
  }
}
