/**
 * Utility functions for generating context-aware WhatsApp messages
 */

export interface WhatsAppMessageContext {
  pathname: string;
  productName?: string;
  productUrl?: string;
  products?: { id: string; name: string }[];
}

/**
 * Generate a context-aware WhatsApp message based on the current page
 */
export function generateWhatsAppMessage(context: WhatsAppMessageContext): string {
  const { pathname, productName, productUrl, products = [] } = context;

  // Product page - include product name and URL
  if (pathname.startsWith("/products/") && productName) {
    return `Hi! I'm interested in ${productName}. ${productUrl ? `\n${productUrl}` : ""}`;
  }

  // Cart page
  if (pathname === "/cart") {
    return "Hi! I have some questions about the items in my cart.";
  }

  // Checkout page
  if (pathname.startsWith("/checkout")) {
    return "Hi! I need assistance with my checkout process.";
  }

  // Products listing page
  if (pathname === "/products") {
    return "Hi! I'm browsing your products and have some questions.";
  }

  // Product details page - extract product ID from URL
  if (pathname.startsWith("/products/") && !productName) {
    const productId = pathname.split("/").pop();
    const productName = products.find((p) => p.id === productId)?.name || "this product";
    return `Hi! I'm interested in product ${productName}. Can you provide more details?`;
  }

  // Contact page
  if (pathname === "/contact") {
    return "Hi! I'd like to get in touch with you.";
  }

  // About page
  if (pathname === "/about") {
    return "Hi! I'd like to know more about your business.";
  }

  // Locate store page
  if (pathname === "/locate-store") {
    return "Hi! I'd like to know more about your store location.";
  }

  // My orders page
  if (pathname === "/my-orders") {
    return "Hi! I have a question about my order.";
  }

  // Account page
  if (pathname.startsWith("/account")) {
    return "Hi! I need help with my account.";
  }

  // Default/Home page message
  return "Hi! I'm interested in your products. Can you help me?";
}

/**
 * Generate WhatsApp URL with pre-filled message
 */
export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  // Remove all non-numeric characters from phone number
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // Return WhatsApp Web URL (works on both mobile and desktop)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
