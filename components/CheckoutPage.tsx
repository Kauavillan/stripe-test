"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";

export default function CheckoutPage({ amount }: { amount: number }) {
  const customerJWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYWRmY2E1OC01NTFiLTQ5NjAtYmY4Ny02Y2RjZWFiY2EyMzUiLCJpc3MiOiJodHRwOi8vbWFnaXBhc3MuY29tIiwic3ViIjoiMzM0YTM1MmItOTRhNi0xMWVmLWI4ZTgtMDI0MmFjMTIwMDAyIiwicm9sZSI6ImN1c3RvbWVyIiwiZGV2aWNlVHlwZSI6IndlYiIsImV4cCI6MTc0ODk2ODkxMiwiaWF0IjoxNzQ4OTY1MzEyLCJuYmYiOjE3NDg5NjUzMTJ9.kSAgznP_J6p0dOtQ-1S2Bpyb0v3cNInxwYjk1uyqhFE";
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch("http://localhost:5168/pass-purchases/intent-purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${customerJWT}`,
      },
      body: JSON.stringify({
        passId: "ca15e3e6-746a-11ef-8c2f-0242ac120002",
        customerId: "1adc0af2-859f-11ef-8001-0242ac120002",
      }),
    })
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
        setClientSecret(data);
      });
  }, [amount]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? "Unknown error");
      setLoading(false);
    } else {
      // Confirm the payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret as string,
        confirmParams: {
          return_url: "http://localhost:3000/success",
        },
      });

      if (error) {
        setErrorMessage(error.message ?? "Unknown error");
      }

      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {clientSecret && <PaymentElement />}
      <button>Pay</button>
    </form>
  );
}
