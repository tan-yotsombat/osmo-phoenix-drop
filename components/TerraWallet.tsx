import { useState, useEffect } from 'react'
import Loader from './Loader'
import axios from "axios";
import { Chain, chainConfigs } from 'chain';
import { convertMicroDenomToDenom } from 'util/conversion';
import { suggestChain } from 'hooks/cosmwasm';

const api = chainConfigs[Chain.phoenix118].lcdEndpoint;

interface ITerraBalances {
  balance: number,
  vestingStart?: number,
  vestingPeriods?: any[],
}

function TerraWallet({
  header,
  terraAddress,
  addNetworkButton = false,
}: {
  header: string,
  terraAddress: string,
  addNetworkButton?: boolean,
}) {
  const [balances, setBalances] = useState<ITerraBalances>();
  
  useEffect(() => {
    async function fetchData() {
      const balancePromise = axios.get(api + '/cosmos/bank/v1beta1/spendable_balances/' + terraAddress)
        .then(res => {
          return res.data.balances[0].amount as number;
        })
        .catch(err => console.log('Get Terra balance error.', err));
      const vestingPromise = axios.get(api + '/cosmos/auth/v1beta1/accounts/' + terraAddress)
        .then(res => {
          return [res.data.account.start_time, res.data.account.vesting_periods];
        })
        .catch(err => console.log('Get Terra vesting error.', err));

      Promise.all([balancePromise, vestingPromise]).then(([balance, vesting]) => {
        setBalances({
          balance: balance || 0,
          vestingStart: vesting ? vesting[0] : undefined,
          vestingPeriods: vesting ? vesting[1] : undefined,
        });
      });
    }

    if (!terraAddress.startsWith("Ledger")) {
      fetchData();
    } else {
      setBalances({ 
        balance: 0,
      })
    }
  }, []);

  let balanceDisplay;
  let vestingDisplay;
  if (!balances) {
    balanceDisplay =  <div className="flex justify-center">
      <Loader />
    </div>
  } else {
    balanceDisplay = <><p>Balance: {convertMicroDenomToDenom(balances.balance)} LUNA</p></>;

    if (balances.vestingPeriods && balances.vestingPeriods.length > 0) {
      
      let lastLength = 1;
      let count = 1;
      let sum = 0;
      const vesting: any[] = [];
      balances.vestingPeriods
        .sort((a, b) => { return Number(a.length) - Number(b.length) })
        .forEach(vestingPeriod => {
          if (vestingPeriod.amount.length > 0) {
            const start = new Date(1000 * (Number(balances.vestingStart) + lastLength));
            const end = new Date(1000 * (Number(balances.vestingStart) + Number(vestingPeriod.length)));
            const amount = convertMicroDenomToDenom(vestingPeriod.amount[0].amount);
            vesting.push([count, start, end, amount]);

            sum += amount;
            count++;
            lastLength = Number(vestingPeriod.length);
          }
        });
      vestingDisplay = (<>
        <p>Total Vesting Airdrop: {sum} LUNA </p>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="mt-2 table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead>
          <tr>
            <th>#</th>
            <th>From</th>
            <th>To</th>
            <th>Amount (LUNA)</th>
          </tr>
        </thead>
        <tbody>
        {
          vesting.map(([count, start, end, amount]) => { return <><tr>
            <td>{count}</td>
            <td>{start.toISOString().split('T')[0]}</td>
            <td>{end.toISOString().split('T')[0]}</td>
            <td>{amount}</td>
          </tr></> })
        }
        </tbody>
        </table>
        </div>
      </>);
    } else {
      vestingDisplay = <><p>Sorry, this address is not eligble for airdrop.</p></>;
    }
  }

  const asyncSuggestChain = async () => {
    suggestChain(chainConfigs[Chain.phoenix118])
  }

  return (<>
    <h1 className="text-lg font-bold">{header}</h1>
    <p className="break-all whitespace-pre-wrap">{terraAddress}</p>
    <div className="mt-2">
      {balanceDisplay}
      {vestingDisplay}
    </div>
    { addNetworkButton &&
      <button className="p-2 mt-4 text-center border border-secondary hover:border-primary rounded-xl hover:text-primary focus:text-primary-focus"
        onClick={ asyncSuggestChain }>
        <p className="text-lg">
          Add chain to Keplr
        </p>
      </button> 
    }
  </>);
}

export default TerraWallet
