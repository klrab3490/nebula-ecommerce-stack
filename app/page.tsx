import HeroSlider from "@/components/custom/HeroSlider";
import { ProductCard } from "@/components/custom/ProductCard";

const products = [
    {
        id: "1",
        name: "Premium Wireless Headphones",
        price: 199.99,
        image: "/premium-wireless-headphones-front.png",
        alt: "Premium Wireless Headphones",
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
        <div className="font-sans flex flex-col items-center justify-items-center min-h-screen ">
            <HeroSlider />
            <div className="max-w-7xl mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
