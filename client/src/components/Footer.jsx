export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-2 text-lg font-semibold">
          UnlistedShares.com
        </div>
        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} UnlistedShares. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
