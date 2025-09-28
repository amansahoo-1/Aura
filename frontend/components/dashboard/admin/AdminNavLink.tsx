import Link from "next/link";

export const AdminNavLink = ({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="block bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition-colors"
  >
    <h3 className="font-bold text-lg text-purple-700">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </Link>
);
