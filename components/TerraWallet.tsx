import { useState, useEffect } from 'react'
import Loader from './Loader'
import axios from "axios";
import { Chain, chainConfigs } from 'chain';
import { convertMicroDenomToDenom } from 'util/conversion';

const api = chainConfigs[Chain.phoenix].lcdEndpoint;

interface ITerraBalances {
  balance: number,
  vestingStart?: number,
  vestingPeriods?: any[],
}

function TerraWallet({
  header,
  terraAddress,
}: {
  header: string,
  terraAddress: string,
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
  }, [terraAddress]);

  let balanceDisplay;
  let vestingDisplay;
  if (!balances) {
    balanceDisplay = <div className="flex justify-center">
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
            vesting.push([
              count + ')', 
              start.toISOString().split('T')[0] + 'to' + end.toISOString().split('T')[0], 
              amount.toString()
            ]);

            sum += amount;
            count++;
            lastLength = Number(vestingPeriod.length);
          }
        });
      vestingDisplay = (<>
        <p>Total Vesting Airdrop: {sum} LUNA </p>
        <div className="mt-2 overflow-x-auto relative shadow-md sm:rounded-lg w-96 sm:w-full">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-base-200 dark:bg-base-200">
              <tr>
                <th className="py-3 px-6">#</th>
                <th className="py-3 px-6">Vesting Period</th>
                <th className="py-3 px-6">Amount (LUNA)</th>
              </tr>
            </thead>
            <tbody>
              {
                vesting.map(rowData => {
                  return <><tr className="bg-base-100 border-b dark:bg-base-100">
                    {(rowData as string[]).map(colData => <><td className="py-2 px-6  whitespace-nowrap">{colData}</td></>)}
                    
                  </tr></>
                })
              }
            </tbody>
          </table>
        </div>
      </>);
    } else {
      vestingDisplay = <><p>Sorry, this address is not eligble for airdrop.</p></>;
    }
  }

  return (<>
    <h1 className="text-lg font-bold text-left sm:text-center">{header}</h1>
    <pre className="text-left break-all whitespace-pre-wrap text-sm sm:text-lg sm:text-center">{terraAddress}</pre>
    <div className="mt-2 text-left">
      {balanceDisplay}
    </div>
    <div className="mt-2 text-left">
      {vestingDisplay}
    </div>
  </>);
}

export default TerraWallet
