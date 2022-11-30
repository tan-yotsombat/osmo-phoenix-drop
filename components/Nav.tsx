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
    <div className="border-b w-screen px-2 md:px-16">
      <nav className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-between items-center py-4 ">
        <div className="flex items-center">
          <Link href="/">
            <a className="ml-1 md:ml-2 link link-hover font-semibold text-xl md:text-2xl align-top">
              OSMO Phoenix drop checker
            </a>
          </Link>
        </div>
        <ThemeToggle />
        <div className="flex flex-grow lg:flex-grow-0 max-w-full w-64 sm:w-max">
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
