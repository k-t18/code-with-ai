import Image from 'next/image'

export default function Navbar() {
  return (
    <header className="bg-navbar w-full">
      <div className="px-6 py-4">
        <Image
          src="/assets/images/logo.png"
          alt="8848 Digital"
          width={120}
          height={40}
          priority
        />
      </div>
    </header>
  )
}
