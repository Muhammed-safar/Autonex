import React from "react";

const BannerCard = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1 */}
        <div className="relative h-[520px] rounded-[28px] overflow-hidden shadow-lg group cursor-pointer">
          {/* Background */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785218474/banner-10.jpg_fv2uku.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 z-10 px-8 pt-8">
            <p className="uppercase tracking-[3px] text-xs font-semibold text-slate-500">
              YOUR RIDE, OUR PARTS
            </p>

            <h2 className="mt-3 text-slate-900 font-black text-4xl leading-[1.1] max-w-[380px]">
              Save Your Vehicle.
              <br />
              Shop Smarter.
            </h2>

            <p className="mt-4 text-slate-700 text-[15px] leading-6">
              Get the part. Make the fix. Enjoy the drive.
            </p>

            <button className="mt-6 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700">
              Shop Now
            </button>
          </div>
        </div>

       <div className="relative h-[520px] rounded-[28px] overflow-hidden shadow-lg group cursor-pointer">
          {/* Background */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785218782/banner-11.jpg_onsnvn.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 z-10 px-8 pt-8">
            <p className="uppercase tracking-[3px] text-xs font-semibold text-white">
              YOUR RIDE, OUR PARTS
            </p>

            <h2 className="mt-3 text-white font-black text-4xl leading-[1.1] max-w-[380px]">
              Save Your Vehicle.
              <br />
              Shop Smarter.
            </h2>

            <p className="mt-4 text-white  text-[15px] leading-6">
              Get the part. Make the fix. Enjoy the drive.
            </p>

            <button className="mt-6 rounded-full bg-white px-8 py-3 font-semibold text- transition hover:bg-gray-200">
              Shop Now
            </button>
          </div>
        </div>

        <div className="relative h-[520px] rounded-[28px] overflow-hidden shadow-lg group cursor-pointer">
          {/* Background */}
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785218844/banner-12.jpg_vr9pha.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 z-10 px-8 pt-8">
            <p className="uppercase tracking-[3px] text-xs font-semibold text-white">
              YOUR RIDE, OUR PARTS
            </p>

            <h2 className="mt-3 text-white font-black text-4xl leading-[1.1] max-w-[380px]">
              Save Your Vehicle.
              <br />
              Shop Smarter.
            </h2>

            <p className="mt-4 text-white  text-[15px] leading-6">
              Get the part. Make the fix. Enjoy the drive.
            </p>

            <button className="mt-6 rounded-full bg-white px-8 py-3 font-semibold text- transition hover:bg-gray-200">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerCard;
