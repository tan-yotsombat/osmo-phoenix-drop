import { useSigningClient } from 'contexts/cosmwasm'
import Link from 'next/link'
import ThemeToggle from 'components/ThemeToggle'
import { useEffect } from 'react'
import { getOsmoAddress } from 'util/conversion'

function Nav() {
  const { wallets, connectWallet, disconnect } = useSigningClient()
  const handleConnect = () => {
    if (wallets.length === 0) {
      connectWallet()
    } else {
      disconnect()
    }
  }

  useEffect(() => {
    window.addEventListener("keplr_keystorechange", connectWallet);
    return () => {
        window.removeEventListener("keplr_keystorechange", connectWallet);
    };
  }, [connectWallet]);

  return (
    <div className="border-b w-screen px-2 sm:px-16">
      <nav className="flex flex-wrap text-center sm:text-left sm:flex flex-row w-full justify-between items-center py-4 ">
        <div className="flex items-center">
          <Link href="/">
            <a className="ml-1 sm:ml-2 link link-hover font-semibold text-xl sm:text-2xl align-top">
              OSMO Phoenix drop checker
            </a>
          </Link>
        </div>
        <ThemeToggle />
        <div className="flex flex-shrink max-w-[70%] sm:w-max">
          <button
            className="block btn btn-outline btn-primary w-full max-w-full truncate"
            onClick={handleConnect}
          >
            {getOsmoAddress(wallets) || 'Connect Wallet'}
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Nav
