export async function createShipment() {
  // Placeholder for Shiprocket integration.
  // Shiprocket requires auth token exchange and then create shipment via their API.
  // We'll return a fake tracking id for now. Implementers should replace with real API calls
  // and store returned shipment ids on the order record.
  return {
    shipmentId: `SR-${Date.now()}`,
    trackingId: null as string | null,
  }
}
