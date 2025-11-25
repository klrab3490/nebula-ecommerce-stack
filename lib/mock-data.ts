export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
};

export const orders: Order[] = [
  {
    id: "ORD-73829",
    date: "October 24, 2023",
    total: 129.99,
    status: "Delivered",
    items: [
      {
        id: 1,
        name: "Wireless Noise Cancelling Headphones",
        price: 129.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
  },
  {
    id: "ORD-73830",
    date: "November 12, 2023",
    total: 59.5,
    status: "Processing",
    items: [
      {
        id: 2,
        name: "Premium Cotton T-Shirt",
        price: 29.75,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dNoaXJ0fGVufDB8fDB8fHww",
      },
    ],
  },
  {
    id: "ORD-73831",
    date: "November 15, 2023",
    total: 249.0,
    status: "Shipped",
    items: [
      {
        id: 3,
        name: "Smart Watch Series 5",
        price: 249.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },
  {
    id: "ORD-73832",
    date: "November 20, 2023",
    total: 89.99,
    status: "Cancelled",
    items: [
      {
        id: 4,
        name: "Bluetooth Speaker",
        price: 89.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
  },
];
