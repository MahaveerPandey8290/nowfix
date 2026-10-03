export const categories = [
  { id: 'electrician', name: 'Electrician', sub: 'Wiring, switches, fan installation', icon: 'Zap', color: '#F59E0B', bg: '#FEF3C7', category: 'Repair' },
  { id: 'plumber', name: 'Plumber', sub: 'Tap, bathroom, leakage', icon: 'Droplets', color: '#3B82F6', bg: '#DBEAFE', category: 'Repair' },
  { id: 'appliance', name: 'Appliance Repair', sub: 'AC, fridge, washing machine', icon: 'Refrigerator', color: '#06B6D4', bg: '#ECFEFF', category: 'Repair' },
  { id: 'cleaning', name: 'Cleaning', sub: 'Home, kitchen, deep cleaning', icon: 'Sparkles', color: '#10B981', bg: '#D1FAE5', category: 'Cleaning' },
  { id: 'carpenter', name: 'Carpenter', sub: 'Furniture, wood work', icon: 'Hammer', color: '#F97316', bg: '#FFEDD5', category: 'Repair' },
  { id: 'paint', name: 'Paint & Waterproofing', sub: 'Painting, wall repair', icon: 'Paintbrush', color: '#8B5CF6', bg: '#EDE9FE', category: 'Installation' },
  { id: 'pest', name: 'Pest Control', sub: 'Termite, cockroach, general pest', icon: 'Bug', color: '#EF4444', bg: '#FEE2E2', category: 'Cleaning' },
] as const;

export const searchResults = [
  { id: 'ac-repair', title: 'AC Repair', sub: 'Cooling, gas refill, general repair', rating: '4.8', reviews: '1.2k', price: 299 },
  { id: 'ac-install', title: 'AC Installation', sub: 'Split AC installation', rating: '4.9', reviews: '840', price: 499 },
  { id: 'ac-clean', title: 'AC Cleaning', sub: 'Deep cleaning service', rating: '4.7', reviews: '620', price: 249 },
  { id: 'ac-uninstall', title: 'AC Uninstallation', sub: 'Safe removal', rating: '4.6', reviews: '310', price: 199 },
  { id: 'ac-amc', title: 'AC Annual Maintenance', sub: 'Complete AMC service', rating: '4.9', reviews: '450', price: 999 },
];

export const savedAddresses = [
  { id: 'addr-1', type: 'Home', address: '123, Gandhi Nagar, Bikaner, Rajasthan 334001', isDefault: true },
  { id: 'addr-2', type: 'Office', address: '456, Station Road, Bikaner, Rajasthan 334001', isDefault: false },
  { id: 'addr-3', type: 'Other', address: '78, JNV Colony, Bikaner, Rajasthan 334001', isDefault: false },
];

export const initialBookings = [
  {
    id: '#NF12345',
    service: 'Electrician',
    sub: 'Wiring, switches, fan installation',
    status: 'Upcoming' as const,
    date: '17 Sep 2024, 11:00 AM - 1:00 PM',
    address: 'Home, 123 Gandhi Nagar, Bikaner',
    providerName: 'Rohit Sharma',
    providerRating: '4.8',
    providerReviews: '120 reviews',
    price: 299,
    description: 'Fan not working properly and need to install 2 new switches.',
  },
  {
    id: '#NF12346',
    service: 'AC Repair',
    sub: 'Cooling issue, not working',
    status: 'Upcoming' as const,
    date: '18 Sep 2024, 2:00 PM',
    address: 'Office, 456 Station Road, Bikaner',
    providerName: 'Amit Kumar',
    providerRating: '4.6',
    providerReviews: '98 reviews',
    price: 399,
    description: 'Split AC not cooling properly.',
  },
  {
    id: '#NF12340',
    service: 'Deep Home Cleaning',
    sub: 'Complete 2BHK deep clean',
    status: 'Completed' as const,
    date: '10 Sep 2024, 10:00 AM',
    address: 'Home, 123 Gandhi Nagar, Bikaner',
    providerName: 'Suresh Patel',
    providerRating: '4.9',
    providerReviews: '210 reviews',
    price: 699,
    description: 'Full house deep cleaning before festival.',
  },
  {
    id: '#NF12341',
    service: 'Plumber',
    sub: 'Pipe leakage repair in kitchen',
    status: 'Completed' as const,
    date: '05 Sep 2024, 3:30 PM',
    address: 'Home, 123 Gandhi Nagar, Bikaner',
    providerName: 'Vikas Meena',
    providerRating: '4.7',
    providerReviews: '150 reviews',
    price: 249,
    description: 'Under sink pipe leakage fix.',
  },
  {
    id: '#NF12342',
    service: 'Appliance Repair',
    sub: 'Washing machine drum issue',
    status: 'Completed' as const,
    date: '28 Aug 2024, 11:00 AM',
    address: 'Home, 123 Gandhi Nagar, Bikaner',
    providerName: 'Ramesh Verma',
    providerRating: '4.8',
    providerReviews: '88 reviews',
    price: 349,
    description: 'Front load drum vibrating heavily.',
  },
  {
    id: '#NF12338',
    service: 'Carpenter',
    sub: 'Door alignment and latch replacement',
    status: 'Cancelled' as const,
    date: '20 Aug 2024, 4:00 PM',
    address: 'Home, 123 Gandhi Nagar, Bikaner',
    providerName: 'Manoj Jangid',
    providerRating: '4.5',
    providerReviews: '64 reviews',
    price: 199,
    description: 'Main door lock replacement.',
    refundAmount: 199,
    refundStatus: 'Refund Processed',
  },
];

export const faqCategories = [
  { id: 'bookings', title: 'Bookings', sub: 'View FAQs', icon: 'CalendarDays' },
  { id: 'payments', title: 'Payments', sub: 'View FAQs', icon: 'CreditCard' },
  { id: 'refunds', title: 'Cancellation & Refunds', sub: 'View FAQs', icon: 'RotateCcw' },
  { id: 'services', title: 'Services & Providers', sub: 'View FAQs', icon: 'Wrench' },
];

export const popularFaqs = [
  { q: 'How to cancel a booking?', a: 'You can cancel any booking up to 2 hours before the scheduled time free of charge directly from the My Bookings screen.' },
  { q: 'When will I get my refund?', a: 'Refunds for online payments are processed instantly to your original payment method within 2-4 business hours.' },
  { q: 'How to reschedule a booking?', a: 'Open Booking Details from My Bookings, tap Reschedule, and select a convenient new date and time slot.' },
  { q: 'How are service charges calculated?', a: 'Service charges are transparently calculated based on the standard service pricing plus 18% GST. No hidden fees are charged.' },
];

export const popularCities = [
  'Jaipur', 'Jodhpur', 'Udaipur', 'Kota',
  'Delhi', 'Mumbai', 'Bengaluru', 'Ahmedabad',
];

export const recentLocations = [
  'Bikaner, Rajasthan',
  'Jaipur, Rajasthan',
  'Jodhpur, Rajasthan',
  'Delhi, NCR',
  'Mumbai, Maharashtra',
];
