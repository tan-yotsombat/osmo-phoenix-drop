import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { IWalletInfo } from 'hooks/cosmwasm';

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase()
}

export function getOsmoAddress(wallets: IWalletInfo[]) {
  if (!wallets || wallets.length === 0) return '';
  const wallet = wallets.find(w => w.coinType === 118);
  return wallet ? toBech32('osmo', wallet.address) : '';
}

export function getTerraAddress(wallets: IWalletInfo[], coinType: number) {
  if (!wallets || wallets.length === 0) return '';
  const wallet = wallets.find(w => w.coinType === coinType);
  if (wallet?.isNanoLedger && coinType == 330) return 'Ledger not supported by Keplr';
  return wallet ? toBech32('terra', wallet.address) : '';
}