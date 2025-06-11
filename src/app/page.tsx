"use client";

import { CheckoutProvider, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "../../components/CheckoutPage";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const customerJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk2NzI3MzYsImp0aSI6ImJlMzZiMWY2LTdmN2EtNDdiNy04ZjI3LTIzYWQyYzYwYzUxNiIsImlzcyI6Imh0dHBzOi8vYXBpLm1hZ2lwYXNzLmNvbSIsImF1ZCI6Imh0dHBzOi8vbWFnaXBhc3MuY29tIiwic3ViIjoiMWFkYzBhZjItODU5Zi0xMWVmLTgwMDEtMDI0MmFjMTIwMDAyIiwicm9sZSI6ImN1c3RvbWVyIiwiZGV2aWNlVHlwZSI6IndlYiIsImlhdCI6MTc0OTY2OTEzNiwibmJmIjoxNzQ5NjY5MTM2fQ.0-it2U_4x8qFXIuCork8IRDFEP1sK26ddQMmOhiOmg0";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
export default function Home() {
  async function fetchClientSecret() {
    return fetch(
      "http://localhost:5168/pass-purchases/create-payment-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${customerJWT}`,
        },
        body: JSON.stringify({
          passId: "ca15e3e6-746a-11ef-8c2f-0242ac120002",
          customerId: "1adc0af2-859f-11ef-8001-0242ac120002",
          couponCode: "afteste10",
        }),
      }
    )
      .then((res) => res.text())
      .then(async (data) => {
        console.log("Client Secret:", data);
        return data;
      });
  }
  const amount = 100;
  return (
    <div>
      <CheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret: fetchClientSecret,
          elementsOptions: { appearance: { theme: "flat" } },
        }}
      >
        <CheckoutPage />
      </CheckoutProvider>
    </div>
  );
}
