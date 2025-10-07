import HeroSlider from "@/components/custom/HeroSlider";
import { ProductCard } from "@/components/custom/ProductCard";
import FeaturedProducts from "@/components/custom/FeaturedProducts";
import ProductCategories from "@/components/custom/ProductCategories";
import CustomerTestimonials from "@/components/custom/CustomerTestimonials";

const products = [
    {
        id: "1",
        name: "Wireless Headphones",
        price: 199.99,
        image: "/premium-wireless-headphones-front.png",
        alt: "Wireless Headphones",
    },
    {
        id: "2",
        name: "Smart Fitness Watch",
        price: 299.99,
        image: "/smart-fitness-watch.png",
        alt: "Smart Fitness Watch",
    },
    {
        id: "3",
        name: "Bluetooth Speaker",
        price: 89.99,
        image: "/bluetooth-speaker.png",
        alt: "Bluetooth Speaker",
    },
    {
        id: "4",
        name: "Wireless Charging Pad",
        price: 49.99,
        image: "/wireless-charging-pad.png",
        alt: "Wireless Charging Pad",
    },
    {
        id: "5",
        name: "Gaming Mouse",
        price: 79.99,
        image: "/gaming-mouse.png",
        alt: "Gaming Mouse",
    },
    {
        id: "6",
        name: "USB-C Hub",
        price: 59.99,
        image: "/usb-c-hub.png",
        alt: "USB-C Hub",
    },
]

export default function Home() {
    return (
        <div className="font-sans flex flex-col min-h-screen">
            {/* Hero Slider */}
            <section className="relative overflow-hidden">
                <HeroSlider />
            </section>

            {/* Product Categories */}
            <section>
                <ProductCategories />
            </section>

            {/* Enhanced Our Products Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            🛒 Our Premium Collection
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                            Handpicked products designed to enhance your lifestyle with quality and innovation
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <div
                                key={product.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products with Sale Timer */}
            <section>
                <FeaturedProducts />
            </section>

            {/* Customer Testimonials */}
            <section>
                <CustomerTestimonials />
            </section>
        </div>
    );
}
