export function GenericPage({ title }: { title: string }) {
  return (
    <div className="p-6 h-full flex items-center justify-center text-win-text-sec">
      <div className="text-center">
        <div className="text-2xl font-semibold mb-2">{title}</div>
        <div className="text-sm">This module is under construction for Forge Mfg V2.69.</div>
      </div>
    </div>
  );
}
