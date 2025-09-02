"use client";

import { Suspense } from "react";
import ConfirmClient from "./ConfirmClient";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ConfirmClient />
    </Suspense>
  );
}
