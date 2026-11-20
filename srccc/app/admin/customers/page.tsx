"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, Mail, Phone, Search, UserCheck } from "lucide-react";
import { useStore } from "@/components/StoreProvider";

export default function AdminCustomersPage() {
  const { customers } = useStore();
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return customers;
    return customers.filter((customer) =>
      customer.fullName.toLowerCase().includes(search)
      || customer.email.toLowerCase().includes(search)
      || customer.phone.toLowerCase().includes(search),
    );
  }, [customers, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#123C32]/60">
            Registered Accounts
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#123C32] mt-1">
            Customer Directory
          </h1>
          <p className="mt-2 text-xs text-[#202824]/60">
            Only customer accounts observed through sign-in are listed. Records are saved in this browser.
          </p>
        </div>

        <label className="relative w-full sm:w-80">
          <span className="sr-only">Search customers by name, email or phone</span>
          <Search className="w-4 h-4 text-[#123C32]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#123C32]/15 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#123C32]"
          />
        </label>
      </div>

      <p className="text-xs text-[#202824]/60" aria-live="polite">
        {filteredCustomers.length} {filteredCustomers.length === 1 ? "registered customer" : "registered customers"}
      </p>

      {filteredCustomers.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((customer, index) => (
            <motion.article
              key={customer.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-[#123C32]/10 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#123C32] text-[#D9A65A] font-serif text-xl font-bold flex items-center justify-center">
                  {customer.fullName.trim().charAt(0).toUpperCase() || "?"}
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E5EDE6] text-[#123C32] text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5" /> Registered
                </span>
              </div>

              <h2 className="font-serif text-xl font-bold text-[#123C32] mt-4">
                {customer.fullName}
              </h2>
              <div className="mt-2 space-y-2 text-xs text-[#202824]/70">
                <p className="flex items-center gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-[#123C32]" />
                  {customer.email}
                </p>
                <p className="flex items-center gap-2 break-words">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-[#123C32]" />
                  {customer.phone || "Phone not provided"}
                </p>
              </div>

              <dl className="mt-6 pt-4 border-t border-[#123C32]/10 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="flex items-center gap-1 text-[#202824]/50">
                    <CalendarDays className="w-3.5 h-3.5" /> Registered
                  </dt>
                  <dd className="mt-1 font-semibold text-[#123C32]">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1 text-[#202824]/50">
                    <Clock3 className="w-3.5 h-3.5" /> Last seen
                  </dt>
                  <dd className="mt-1 font-semibold text-[#123C32]">
                    {new Date(customer.lastSeenAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </motion.article>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-white p-6 text-sm text-[#202824]/60">
          {customers.length
            ? "No registered customers match your search."
            : "No registered customer accounts have signed in on this browser yet."}
        </p>
      )}
    </div>
  );
}
