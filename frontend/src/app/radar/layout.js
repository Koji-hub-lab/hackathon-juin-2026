/** Plein écran : annule le padding du <main> pour le hero 3D scrollable. */
export default function RadarLayout({ children }) {
  return <div className="-m-6 min-h-[calc(100vh-4rem)]">{children}</div>;
}
