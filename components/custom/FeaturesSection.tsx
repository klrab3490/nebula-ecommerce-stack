const features = [
  {
    icon: "🚚",
    title: "Free Shipping",
    description: "On order over ₹100",
  },
  {
    icon: "↩️",
    title: "Flexible & Easy Return",
    description: "Return within 14 days",
  },
  {
    icon: "💳",
    title: "Secure payment",
    description: "100% Fast",
  },
  {
    icon: "🎁",
    title: "Free Gifts",
    description: "Free Gift Wrapping with Notes",
  },
]

export default function FeaturesSection() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="text-purple-500 text-3xl bg-purple-50 p-3 rounded-lg">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
