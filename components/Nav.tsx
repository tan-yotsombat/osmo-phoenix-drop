import { useSigningClient } from 'contexts/cosmwasm'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from 'components/ThemeToggle'
import { useEffect } from 'react'
import { Chain } from 'chain'
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

  const PUBLIC_SITE_ICON_URL = '/vercel.svg'

  return (
    <div className="border-b w-screen px-2 md:px-16">
      <nav className="flex flex-wrap text-center md:text-left md:flex flex-row w-full justify-between items-center py-4 ">
        <div className="flex items-center">
          <Link href="/">
            <a>
              {PUBLIC_SITE_ICON_URL.length > 0 ? (
                <Image
                  src={PUBLIC_SITE_ICON_URL}
                  height={32}
                  width={32}
                  alt="Logo"
                />
              ) : (
                <span className="text-2xl">⚛️ </span>
              )}
            </a>
          </Link>
          <Link href="/">
            <a className="ml-1 md:ml-2 link link-hover font-semibold text-xl md:text-2xl align-top">
              OSMO Phoenix drop checker
            </a>
          </Link>
        </div>
        <ThemeToggle />
        <div className="flex flex-grow lg:flex-grow-0 max-w-full">
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
