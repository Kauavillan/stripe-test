"use client";

import React, { useEffect, useState } from "react";
import {
  CardElement,
  CheckoutProvider,
  ExpressCheckoutElement,
  PaymentElement,
  useCheckout,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export default function CheckoutPage() {
  const checkout = useCheckout();

  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<string>(""); // novo estado para o cupom
  checkout.total;

  async function sendCoupon() {
    const trimmedCoupon = coupon.trim();
    if (trimmedCoupon) {
      checkout.applyPromotionCode(trimmedCoupon);
    }
  }
  async function finishCheckout() {
    setLoading(true);
    try {
      await checkout.confirm();
    } catch (error) {
      console.error("Erro no confirm do checkout:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      {/* Campo para permitir entrada do cupom */}
      <input
        type="text"
        placeholder="Insira seu cupom"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
      />
      <button onClick={sendCoupon}>Enviar cupom</button>

      <ExpressCheckoutElement onConfirm={() => console.log("Feito")} />
      <PaymentElement />

      <div>
        <h1>Infos checkout</h1>

        <div>
          <span>Subtotal: {checkout.total.subtotal.amount}</span>
        </div>
        <div>
          <span>Discount: {checkout.total.discount.amount}</span>
        </div>
        <div>
          <span>Total: {checkout.total.total.amount}</span>
        </div>
        <button onClick={finishCheckout}>Finish</button>
      </div>
    </div>
  );
}
