"use client";

import { useEffect, useMemo, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { getWarehouses } from "@/services/warehouseService";
import { getAlerts } from "@/services/alertService";
import { getPredictions } from "@/services/predictService";
import { getProducts } from "@/services/productService";
import HeroSection from "@/components/landing/HeroSection";
import KpiSection from "@/components/landing/KpiSection";
import NetworkSection from "@/components/landing/NetworkSection";
import AISection from "@/components/landing/AISection";
import RealtimeSection from "@/components/landing/RealtimeSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import LandingFooter from "@/components/landing/LandingFooter";
import SectionDivider from "@/components/landing/SectionDivider";

export default function CommandCenter() {
  const [warehouses, setWarehouses] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [products, setProducts] = useState([]);
  const [liveAlert, setLiveAlert] = useState(null);

  const { connected } = useSocket((alert) => {
    setLiveAlert(alert);
  });

  useEffect(() => {
    getWarehouses().then(setWarehouses);
    getAlerts().then(setAlerts);
    getPredictions().then(setPredictions);
    getProducts().then(setProducts);
  }, []);

  const globalFill = useMemo(() => {
    if (!warehouses.length) return 0;
    const sum = warehouses.reduce(
      (s, w) => s + Math.round((w.stock / w.capacity) * 100),
      0
    );
    return Math.round(sum / warehouses.length);
  }, [warehouses]);

  const dangerCount = alerts.filter((a) => a.level === "danger").length;

  return (
    <div className="w-full bg-[#030712] text-white">
      <HeroSection warehouses={warehouses} products={products} alerts={alerts} />

      <SectionDivider />
      <KpiSection
        warehouseCount={warehouses.length}
        productCount={products.length}
        dangerCount={dangerCount}
        globalFill={globalFill}
      />

      <SectionDivider />
      <NetworkSection warehouses={warehouses} alerts={alerts} />

      <SectionDivider />
      <AISection predictions={predictions} />

      <SectionDivider />
      <RealtimeSection connected={connected} liveAlert={liveAlert} />

      <SectionDivider />
      <FeaturesSection />

      <LandingFooter />
    </div>
  );
}
