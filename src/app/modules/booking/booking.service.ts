import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errors/functions/AppError'

import { IBooking } from './booking.interface'
import Booking from './booking.model'

// * Create a new booking
const createBooking = async (payload: Partial<IBooking>): Promise<IBooking> => {
  const booking = (await Booking.create(payload)).populate('listing landlord tenant')
  return booking
}

// * Retrieve bookings with optional filters and pagination
const getAllBookings = async (
  queryOptions: { page?: number; limit?: number; status?: string } = {}
): Promise<{ bookings: IBooking[]; metadata: { total: number; page: number; limit: number } }> => {
  const { page = 1, limit = 10, status } = queryOptions
  const filter: { status?: string } = {}

  // * Filter by status if provided
  if (status) {
    filter.status = status
  }

  // * Calculate skip value for pagination
  const skip = (page - 1) * limit

  // * Fetch bookings with pagination
  const bookings = await Booking.find(filter).skip(skip).limit(limit)
  // * Count total matching bookings
  const total = await Booking.countDocuments(filter)

  return {
    bookings,
    metadata: {
      total,
      page,
      limit
    }
  }
}

// * Get booking details by ID
const getBookingById = async (id: string): Promise<IBooking> => {
  const booking = await Booking.findById(id)
  if (!booking) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Booking not found')
  }
  return booking
}

// * Update booking status
const updateBookingStatus = async (
  id: string,
  payload: { status: 'pending' | 'confirmed' | 'cancelled' }
): Promise<IBooking> => {
  const updatedBooking = await Booking.findByIdAndUpdate(id, payload, { new: true })
  if (!updatedBooking) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Booking not found')
  }
  return updatedBooking
}

// * Delete booking
const deleteBooking = async (id: string): Promise<IBooking> => {
  const deletedBooking = await Booking.findByIdAndDelete(id)
  if (!deletedBooking) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Booking not found')
  }
  return deletedBooking
}

export const BookingService = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
}
