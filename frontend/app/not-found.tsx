import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-68px)] text-center px-4">
      <h1 className="text-8xl md:text-9xl font-bold text-purple-600">404</h1>
      <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-gray-800">
        Page Not Found
      </h2>
      <p className="mt-2 text-md md:text-lg text-gray-600">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        Go Back Home
      </Link>
    </main>
  );
}
