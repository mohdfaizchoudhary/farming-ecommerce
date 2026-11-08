"use client";

import { useStore } from "@/components/StoreProvider";

export default function Page() {
  const { customers, orders } = useStore();

  return (
    <div>
      <p className="eyebrow">Relationships</p>
      <h1 className="section-title mt-2">Customers</h1>
      <p className="mt-3 text-sm text-charcoal/60">
        Customer contact and delivery details are saved when they sign in or place an order.
      </p>
      <p className="mt-2 text-xs leading-5 text-charcoal/50">
        This demo stores records in this browser only. Use protected server-side storage before handling customer data in production.
      </p>
      <div className="mt-5 space-y-3">
        {customers.map((customer) => {
          const customerOrders = orders.filter((order) =>
            order.customerId === customer.id
            || order.customerEmail?.toLowerCase() === customer.email.toLowerCase(),
          );
          const latestAddress = customerOrders.find((order) => order.customerAddress)?.customerAddress;

          return (
            <article key={customer.id} className="rounded-2xl bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl text-forest">{customer.fullName}</h2>
                  <p className="mt-1 break-all text-sm text-charcoal/65">{customer.email}</p>
                </div>
                <span className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-forest">
                  {customerOrders.length} {customerOrders.length === 1 ? "order" : "orders"}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 border-t border-forest/10 pt-4 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-charcoal/50">Phone</dt><dd className="mt-1 break-words">{customer.phone || "Not provided"}</dd></div>
                <div><dt className="text-xs text-charcoal/50">Delivery address</dt><dd className="mt-1 whitespace-pre-wrap break-words">{customer.address || latestAddress || "Not provided"}</dd></div>
                <div><dt className="text-xs text-charcoal/50">Customer since</dt><dd className="mt-1">{new Date(customer.createdAt).toLocaleDateString()}</dd></div>
                <div><dt className="text-xs text-charcoal/50">Last seen</dt><dd className="mt-1">{new Date(customer.lastSeenAt).toLocaleDateString()}</dd></div>
              </dl>
              {customerOrders.length > 0 && (
                <div className="mt-4 border-t border-forest/10 pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-charcoal/55">Recent orders</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {customerOrders.slice(0, 3).map((order) => (
                      <li key={order.id} className="flex flex-wrap justify-between gap-2">
                        <span>{order.id} · {new Date(order.date).toLocaleDateString()}</span>
                        <span className="capitalize text-charcoal/60">{order.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {!customers.length && (
        <p className="mt-5 rounded-2xl bg-white p-6 text-sm text-charcoal/60">
          No customers saved in this browser yet. Customer profiles will appear here after sign-in.
        </p>
      )}
    </div>
  );
}
