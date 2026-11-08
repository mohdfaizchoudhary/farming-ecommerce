export default function Contact() {
  return (
    <div className="container-shell py-10 sm:py-12">
      <p className="eyebrow">Poultry marketplace enquiries</p>
      <h1 className="section-title mt-3">Buy, source or sell poultry</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-charcoal/60">
        Ask us about listing poultry, hatching eggs, layer birds or chicks, or tell us what you are looking to source. Replace the placeholder contact details with approved business information before launch.
      </p>

      <div className="mt-8 grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        <form className="min-w-0 rounded-2xl border border-[#dce6df] bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-forest">
              Full name
              <input className="field mt-2" placeholder="Your name" required />
            </label>
            <label className="block text-sm font-medium text-forest">
              Email address
              <input className="field mt-2" type="email" placeholder="name@example.com" required />
            </label>
          </div>

          <label className="mt-4 block text-sm font-medium text-forest">
            Enquiry type
            <select className="field mt-2">
              <option>Buying poultry</option>
              <option>Selling or listing poultry</option>
              <option>Hatching eggs</option>
              <option>Layer birds</option>
              <option>Chicks</option>
              <option>Other marketplace enquiry</option>
            </select>
          </label>

          <label className="mt-4 block text-sm font-medium text-forest">
            Message
            <textarea className="field mt-2 min-h-28" placeholder="Tell us how we can help." required />
          </label>

          <button type="submit" className="btn-primary mt-5">Send enquiry</button>
        </form>

        <aside className="rounded-2xl border border-[#dce6df] bg-sage p-5 sm:p-6">
          <h2 className="font-serif text-2xl text-forest">Business contact</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-charcoal/70">
            <li><b>Email:</b> Update with the approved company support address.</li>
            <li><b>Phone:</b> Update with the approved business phone number.</li>
            <li><b>Location:</b> Update with the registered office or operating addresses.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
