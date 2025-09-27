import { UserList } from "@/components/dashboard/admin/UserList";
import { SellerList } from "@/components/dashboard/admin/SellerList";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-8">
        <UserList />
        <SellerList />
      </div>
    </div>
  );
}
