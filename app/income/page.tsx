import IncomeManager from "@/components/Income/IncomeManager";

export default function IncomePage() {
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Income Management</h1>
      </div>

      <IncomeManager />
    </div>
  );
}
