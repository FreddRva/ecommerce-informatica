import { Order } from '../models/order.model';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'CYBER-2025-001',
    userName: 'Carlos Gómez',
    userEmail: 'cliente@cybertechpro.com',
    status: 'shipped',
    subtotal: 1899.99,
    discount: 0,
    shippingCost: 0,
    total: 1899.99,
    shippingAddress: {
      fullName: 'Carlos Gómez', phone: '+57 320 123 4567', email: 'cliente@cybertechpro.com',
      addressLine: 'Calle 45 #12-34', city: 'Bogotá', state: 'Cundinamarca', postalCode: '110111'
    },
    shippingMethod: 'express',
    paymentMethod: 'stripe',
    paymentStatus: 'paid',
    stripePaymentId: 'pi_3P5L92X88129',
    trackingNumber: 'TRK-9842104-CO',
    items: [{
      productId: 'prod-2', productName: 'NVIDIA GeForce RTX 4090 OC 24GB', price: 1899.99,
      quantity: 1, total: 1899.99, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80'
    }],
    createdAt: '2025-02-10T14:20:00Z'
  }
];
