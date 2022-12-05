import { useSigningClient } from 'contexts/cosmwasm'
import Link from 'next/link'
import Image from 'next/image'
import ThemeToggle from 'components/ThemeToggle'
import { useEffect, useState } from 'react'
import { getOsmoAddress } from 'util/conversion'

const navMenus = [
  ['Home', '/'],
  ['About me', '/about'],
]

function Nav() {
  const { wallets, connectWallet, disconnect } = useSigningClient()
  const [navOpen, setNavOpen] = useState(true)
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
    <nav className="container px-2 sm:px-4 py-2.5 rounded">
      <div className="flex flex-wrap items-center justify-between mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <Image className="hover:cursor-pointer" src="/logo.png" alt="logo" width={50} height={50}></Image>
          </Link>
          <Link href="/">
            <a className="mx-0 sm:mx-2 link link-hover font-semibold text-lg sm:text-2xl">OSMO Phoenix drop checker</a>
          </Link>
        </div>
        <button className="inline-flex items-center p-2 ml-3 text-sm rounded-lg sm:hidden hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-base-content dark:hover:bg-base-content dark:focus:ring-base-content"
          onClick={() => setNavOpen(!navOpen)}>
          <span className="sr-only"></span>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
        </button>
        <div className={"sm:block sm:w-auto " + (navOpen ? "w-full" : "hidden")}>
          <ul className="flex flex-col items-center p-4 mt-4 border rounded-lg sm:flex-row sm:space-x-8 sm:mt-0 sm:text-sm sm:font-medium sm:border-0 bg-base-100 dark:bg-base-100">
            {navMenus.map(([text, url], idx) => {
              return (<li key={idx}><Link href={url}><a className="block link link-hover py-2 pl-3 pr-4 rounded sm:p-2">{text}</a></Link></li>);
            })}

            <li><ThemeToggle /></li>
            <li>
              <button
                className="block btn btn-outline btn-primary truncate max-w-xs sm:max-w-full"
                onClick={handleConnect}
              >
                {getOsmoAddress(wallets) || 'Connect Wallet'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav
