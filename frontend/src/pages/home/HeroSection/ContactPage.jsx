import ContactForm from "../../../components/contact/ContactForm.jsx";

const ContactPage = () => {
  return (
    <div className="bg-gray-50">

      {/* Hero */}

      <section
        className="relative h-[320px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/p61kdb2x/image/upload/v1785223388/banner-13.jpg_yxm61k.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center text-white px-4">

          <h1 className="text-5xl font-black">
            Contact AutoNex
          </h1>

          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            Have questions about our products or your order?
            We're always ready to help.
          </p>

        </div>
      </section>

      {/* About + Form */}

      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* About */}

          <div className="space-y-6">

            <span className="text-[#0066CC] font-semibold uppercase tracking-widest">
              About AutoNex
            </span>

            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              Your Trusted Destination
              <br />
              For Premium Auto Parts
            </h2>

            <p className="text-slate-600 leading-8">
              AutoNex provides high-quality automotive parts and
              accessories for a wide range of vehicles. Whether you're
              maintaining your daily driver or upgrading performance,
              we help you find the right parts with confidence.
            </p>

            <p className="text-slate-600 leading-8">
              If you have questions regarding compatibility, orders,
              shipping, or product availability, simply fill out the
              contact form and our team will respond as quickly as
              possible.
            </p>

            <div className="space-y-4 pt-4">

              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✔</span>
                Genuine Automotive Parts
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✔</span>
                Fast & Secure Delivery
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✔</span>
                Expert Customer Support
              </div>

              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✔</span>
                Trusted by Thousands of Customers
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
            src="https://maps.app.goo.gl/Pz4mgAxoPK528XXg9"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

        </div>

      </section>

    </div>
  );
};

export default ContactPage;