import Image from "next/image";

const categories = [
  {
    name: "Hair Oils",
    image: "/hair-oil-bottle-natural-background.png",
    bgColor: "bg-green-200",
  },
  {
    name: "Shampoo",
    image: "/shampoo-bottles-natural-setting.png",
    bgColor: "bg-amber-100",
  },
  {
    name: "Indigo Powder",
    image: "/indigo-powder-jar-orange-background.png",
    bgColor: "bg-orange-400",
  },
  {
    name: "Eyebrow Oil",
    image: "/eyebrow-oil-small-bottle-pink-background.png",
    bgColor: "bg-pink-200",
  },
  {
    name: "Henna",
    image: "/henna-powder-jar-teal-background.png",
    bgColor: "bg-teal-400",
  },
]

export default function ProductCategories() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${category.bgColor} rounded-2xl p-6 text-center cursor-pointer hover:scale-105 transition-transform duration-300`}
            >
              <div className="mb-4">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-32 object-contain"
                  width={200}
                  height={200}
                />
              </div>
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
