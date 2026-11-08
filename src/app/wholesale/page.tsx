"use client";

import { useState } from "react";

export default function Wholesale() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container-shell max-w-3xl py-10 sm:py-12">
      <p className="eyebrow">For farms and bulk buyers</p>
      <h1 className="section-title mt-3">Poultry sourcing enquiries</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/60">
        Share the poultry products and quantities you are looking to source. This demo form does not send information to a server.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        className="mt-7 grid min-w-0 gap-4 rounded-2xl border border-[#dce6df] bg-white p-4 sm:grid-cols-2 sm:p-6"
      >
        <label className="grid gap-2 text-sm font-medium text-forest">
          Business name
          <input required className="field" placeholder="Business name" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-forest">
          Contact person
          <input required className="field" placeholder="Contact person" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-forest">
          Email
          <input required type="email" className="field" placeholder="name@example.com" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-forest">
          Phone
          <input required type="tel" className="field" placeholder="Phone number" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-forest sm:col-span-2">
          Poultry products and quantities
          <textarea required className="field min-h-28 rounded-2xl" placeholder="Tell us what you are looking for" />
        </label>
        <button className="btn-primary sm:col-span-2">Submit demo enquiry</button>
        {submitted && (
          <p role="status" className="text-sm leading-6 text-forest sm:col-span-2">
            Submitted locally only. No email or database record was created.
          </p>
        )}
      </form>
    </div>
  );
}
