export default function HeroSection({ onReserveClick }) {
  return (
    <section className="bg-gray-50 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Text Block */}
        <div className="text-center md:text-left max-w-xl space-y-6">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Invest in India's Most Promising <span className="text-blue-600">Unlisted Companies</span>
          </h1>
          <p className="text-lg text-gray-600">
            Buy pre-IPO shares, track affiliate performance, and stay ahead with real-time market updates.
          </p>
          <div>
            <button
              onClick={onReserveClick}
              className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition inline-block"
            >
              Reserve Access
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="mt-12 md:mt-0 md:ml-12">
          <img
            src="https://dummyimage.com/400x300/ddd/555.png&text=Unlisted+Market"
            alt="Unlisted Shares Graphic"
            className="w-full max-w-md rounded-xl shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
