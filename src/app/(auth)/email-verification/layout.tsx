"use client";

import { Suspense } from "react";
import VerifyOtpPage from "./page";


export const dynamic = "force-dynamic"; // <-- REQUIRED

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPage />
    </Suspense>
  );
}
