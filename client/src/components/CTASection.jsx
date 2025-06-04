export default function CTASection({ onReserveClick }) {
  return (
    <section className="bg-blue-600 text-white py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to invest in the future?
        </h2>
        <p className="text-lg">
          Join our platform today and unlock access to India's fastest-growing unlisted companies.
        </p>
        <div>
          <button
            onClick={onReserveClick}
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Reserve Access Now
          </button>
        </div>
      </div>
    </section>
  );
}
