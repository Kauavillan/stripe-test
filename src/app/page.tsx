"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "../../components/CheckoutPage";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
function convertToCents(amount: number) {
  return Math.round(amount * 100);
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
export default function Home() {
  const amount = 100;
  return (
    <div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToCents(amount),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </div>
  );
}
