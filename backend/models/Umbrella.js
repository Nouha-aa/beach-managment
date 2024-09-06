import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  deposit: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['riservato', 'confermato', 'cancellato'],
    default: 'riservato',
  },
  additionalServices: {
    sunbeds: { type: Number, default: 0 },
  },
  additionalServicesPrice: {
    sunbeds: { type: Number, default: 0 },
  },
  notes: { type: String },
}, {
  timestamps: true,
  _id: true
});

const umbrellaSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    tipology: {
      type: String,
      required: true,
    },
    row: {
      type: String,
      required: true,
    },
    image:{
      type: String,
    },
    isAccessible: {
      type: Boolean,
      default: false,  // Indica se l'ombrellone è accessibile per persone con disabilità
    },
    status: {
      type: String,
      enum: ['libero', 'occupato'],
      default: 'libero',  // Indica lo stato del ombrellone, mi sarà utile graficamente
    },
    price: {
      type: Number,
      required: true,
    },
    bookings: [bookingSchema],
  },
  {
    timestamps: true,
    collection: "umbrellas",
  },
);

umbrellaSchema.virtual('currentStatus').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Imposto l'ora a mezzanotte

  const hasBookingToday = this.bookings.some(booking => {
    const startDate = new Date(booking.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(booking.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    return today >= startDate && today <= endDate;
  });

  return hasBookingToday ? 'occupato' : 'libero';
});

umbrellaSchema.set('toJSON', { virtuals: true });
umbrellaSchema.set('toObject', { virtuals: true });

export default mongoose.model("Umbrella", umbrellaSchema);
