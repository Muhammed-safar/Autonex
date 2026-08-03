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

        

          <div className="relative rounded-2xl overflow-hidden min-h-[420px] sm:min-h-[480px] flex flex-col justify-between p-6 sm:p-10 text-white shadow-sm">

          <img
            src="https://res.cloudinary.com/p61kdb2x/image/upload/v1785223388/banner-13.jpg_yxm61k.jpg"
            alt="Spring Deals Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />

          <div className="relative z-10 space-y-4 max-w-md">
           <span className="inline-flex items-center gap-2 text-[#0066CC] text-sm font-bold uppercase tracking-[0.25em]">
                <span className="w-10 h-[2px] bg-[#0066CC]"></span>
                About AutoNex
              </span>

              <h2 className="mt-5 text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                Your Trusted Destination
                <br />
                <span className="text-[#0066CC]">For Premium Auto Parts</span>
              </h2>
            

             <div className="bg-white border-l-4 border-[#0066CC] rounded-xl p-5 shadow-sm">
              <p className="text-slate-700 leading-8">
                AutoNex is dedicated to providing high-quality automotive parts
                and accessories for every journey. From routine maintenance to
                performance upgrades, we help you find the right products with
                confidence.
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
            title="AutoNex Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.4728734555133!2d75.892471!3d11.1525815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6502f41ef4e8b%3A0xf4c653a7548cccd!2sKinfra%20Techno%20Industrial%20Park!5e0!3m2!1sen!2sin!4v1785739625773!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
