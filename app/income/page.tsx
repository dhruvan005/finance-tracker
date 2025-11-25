import IncomeManager from "@/components/Income/IncomeManager";

export default function IncomePage() {
  
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold">Income Management</h1>
        <p className="text-muted-foreground">Track and manage your income sources</p>
      </div>
      <IncomeManager />
    </div>
  );
}
