"use client";

import { Suspense } from "react";
import ResetConfirmClient from "./ResetConfirmClient";

export default function ResetConfirmPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ResetConfirmClient />
    </Suspense>
  );
}
