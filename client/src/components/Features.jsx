import { motion } from "framer-motion";
import { MdTrendingUp, MdGroup, MdLeaderboard, MdVisibility } from "react-icons/md";

const features = [
  {
    title: "Live Share Prices",
    description: "Get real-time updates on unlisted company valuations.",
    icon: <MdTrendingUp className="text-blue-600 text-4xl" />,
  },
  {
    title: "Affiliate Tracking",
    description: "Track commissions, referrals, and performance insights.",
    icon: <MdGroup className="text-blue-600 text-4xl" />,
  },
  {
    title: "Marketing Leaderboard",
    description: "See top performers ranked by impact and conversions.",
    icon: <MdLeaderboard className="text-blue-600 text-4xl" />,
  },
  {
    title: "Watchlist & Alerts",
    description: "Monitor shares you care about and receive timely updates.",
    icon: <MdVisibility className="text-blue-600 text-4xl" />,
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
