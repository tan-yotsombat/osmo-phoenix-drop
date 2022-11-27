import { fromBech32, toBech32 } from '@cosmjs/encoding';

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase()
}

export function convertToTerraAddress(address: string) {
  if (!address) return 'Failed to get wallet address from Terra Classic (columbus-5)';
  const {data} = fromBech32(address); 
  return toBech32('terra', data);
}