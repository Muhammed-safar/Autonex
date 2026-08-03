import ContactForm from "../../../components/contact/ContactForm.jsx";

const ContactPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero */}

      <section
        className="relative h-[320px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785214232/banner-07.jpg_iihmve.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-black">Contact AutoNex</h1>

          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            Have questions about our products or your order? We're always ready
            to help.
          </p>
        </div>
      </section>

      {/* About + Form */}

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* About */}

          <div className="space-y-8">
            {/* Heading */}
            <div>
              <span className="inline-flex items-center gap-2 text-[#0066CC] text-sm font-bold uppercase tracking-[0.25em]">
                <span className="w-10 h-[2px] bg-[#0066CC]"></span>
                About AutoNex
              </span>

              <h2 className="mt-5 text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                Your Trusted Destination
                <br />
                <span className="text-[#0066CC]">For Premium Auto Parts</span>
              </h2>
            </div>

            {/* Highlight Box */}
            <div className="bg-white border-l-4 border-[#0066CC] rounded-xl p-5 shadow-sm">
              <p className="text-slate-700 leading-8">
                AutoNex is dedicated to providing high-quality automotive parts
                and accessories for every journey. From routine maintenance to
                performance upgrades, we help you find the right products with
                confidence.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 text-slate-600 leading-8">
              <p>
                Whether you're searching for genuine replacement parts,
                performance upgrades, or accessories, our team is committed to
                delivering quality products backed by reliable customer support.
              </p>

              <p>
                Have questions about product compatibility, shipping, or your
                order? Fill out the contact form and we'll respond as quickly as
                possible.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#0066CC] hover:shadow-md transition-all">
                <div className="text-2xl mb-3">🚗</div>

                <h4 className="font-bold text-slate-900">Genuine Parts</h4>

                <p className="text-sm text-slate-500 mt-2">
                  Premium quality parts from trusted manufacturers.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#0066CC] hover:shadow-md transition-all">
                <div className="text-2xl mb-3">🚚</div>

                <h4 className="font-bold text-slate-900">Fast Delivery</h4>

                <p className="text-sm text-slate-500 mt-2">
                  Reliable shipping to get your vehicle back on the road.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#0066CC] hover:shadow-md transition-all">
                <div className="text-2xl mb-3">🛡️</div>

                <h4 className="font-bold text-slate-900">Secure Shopping</h4>

                <p className="text-sm text-slate-500 mt-2">
                  Shop confidently with trusted payments and secure ordering.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#0066CC] hover:shadow-md transition-all">
                <div className="text-2xl mb-3">💬</div>

                <h4 className="font-bold text-slate-900">Expert Support</h4>

                <p className="text-sm text-slate-500 mt-2">
                  Friendly assistance whenever you need help choosing parts.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}

          <ContactForm />
        </div>
      </section>

      {/* Map */}

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.4728734555133!2d75.892471!3d11.1525815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6502f41ef4e8b%3A0xf4c653a7548cccd!2sKinfra%20Techno%20Industrial%20Park!5e0!3m2!1sen!2sin!4v1785739625773!5m2!1sen!2sin"
            width="600"
            height="450"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
