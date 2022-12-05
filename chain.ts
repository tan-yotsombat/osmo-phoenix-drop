export interface IChainConfig {
  chainId: string;
  chainName: string;
  coinType: number;
  prefix: string;
  rpcEndpoint: string;
  lcdEndpoint: string;
  denom: string;
}

export enum Chain {
  osmosis, columbus, phoenix
}

export const chainConfigs: Record<Chain, IChainConfig> = {
  [Chain.osmosis]: {
    chainId: 'osmosis-1',
    chainName: 'Osmosis',
    coinType: 118,
    prefix: 'osmo',
    rpcEndpoint: 'https://rpc.osmosis.zone',
    lcdEndpoint: 'https://lcd.osmosis.zone',
    denom: 'uosmo'
  },
  
  [Chain.columbus]: {
    chainId: 'columbus-5',
    chainName: 'Terra Classic',
    coinType: 330,
    prefix: 'terra',
    rpcEndpoint: 'https://rpc-columbus.keplr.app',
    lcdEndpoint: 'https://lcd-columbus.keplr.app',
    denom: 'ulunc'
  },  
  [Chain.phoenix]: {
    chainId: 'phoenix-1',
    chainName: 'Terra Phoenix',
    coinType: 330,
    prefix: 'terra',
    rpcEndpoint: 'https://terra-rpc.lavenderfive.com',
    lcdEndpoint: 'https://phoenix-lcd.terra.dev',
    denom: 'uluna'
  },
}
