import Link from "next/link";
import { KycManager } from "@/components/dashboard/user/KycManager";
import { MySubscription } from "@/components/dashboard/user/MySubscription";

// A simple icon component for cards
const CardIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-purple-100 text-purple-600 rounded-lg p-3 self-start">
    {children}
  </div>
);

export default function UserDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-blue-800">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* --- Rental History Card --- */}
        <Link
          href="/dashboard/user/rentals"
          className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardIcon>
            <div>
              <h2 className="text-xl font-bold text-cyan-800">My Rentals</h2>
              <p className="text-gray-500 text-sm">
                View your active and past rentals
              </p>
            </div>
          </div>
        </Link>

        {/* --- Manage Addresses Card --- */}
        <Link
          href="/dashboard/user/addresses"
          className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </CardIcon>
            <div>
              <h2 className="text-xl font-bold text-cyan-800">
                Manage Addresses
              </h2>
              <p className="text-gray-500 text-sm">
                Update your shipping information
              </p>
            </div>
          </div>
        </Link>

        {/* --- Edit Profile Card --- */}
        <Link
          href="/dashboard/user/profile"
          className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <CardIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </CardIcon>
            <div>
              <h2 className="text-xl font-bold text-cyan-800">Edit Profile</h2>
              <p className="text-gray-500 text-sm">
                Update your name and contact details
              </p>
            </div>
          </div>
        </Link>

        {/* --- Subscription & KYC Components --- */}
        <div className="md:col-span-2 lg:col-span-1">
          <MySubscription />
        </div>
        <div className="md:col-span-2">
          <KycManager />
        </div>
      </div>
    </div>
  );
}
