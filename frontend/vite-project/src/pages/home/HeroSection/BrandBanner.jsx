import React from 'react'

const BrandBanner = () => {
  return (
    <div>
      <section className="border-b border-gray-100 bg-white py-6 ">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-around gap-6 opacity-60 shrink-0">
          <span className="font-extrabold text-xs md:text-xl tracking-wider text-gray-700">ISUZU</span>
          <span className="font-extrabold text-xs md:text-xl tracking-widest text-gray-700">PORSCHE</span>
          <span className="font-extrabold text-xs md:text-xl tracking-widest text-gray-700">DACIA</span>
          <span className="font-extrabold text-xs md:text-xl tracking-widest text-gray-700">PEUGEOT</span>
        </div>
      </section>
    </div>
  )
}

export default BrandBanner
