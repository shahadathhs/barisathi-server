import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errors/functions/AppError'

import { IBooking } from './booking.interface'
import Booking from './booking.model'
import { TGetBookings, TQueryOptions } from './booking.utils'

// * Create a new booking
const createBooking = async (payload: Partial<IBooking>): Promise<IBooking> => {
  const booking = (await Booking.create(payload)).populate('listing landlord tenant')
  return booking
}

// * Retrieve bookings with optional filters and pagination
const getAllBookings = async (queryOptions: TQueryOptions = {}): Promise<TGetBookings> => {
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

// * Get all bookings for a tenant
const getAllBookingsForTenant = async (
  tenantId: string,
  queryOptions: TQueryOptions = {}
): Promise<TGetBookings> => {
  const { page = 1, limit = 10, status } = queryOptions
  const filter: { tenant: string; status?: string } = { tenant: tenantId }

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

// * Get all bookings for a landlord
const getAllBookingsForLandlord = async (
  landlordId: string,
  queryOptions: TQueryOptions = {}
): Promise<TGetBookings> => {
  const { page = 1, limit = 10, status } = queryOptions
  const filter: { landlord: string; status?: string } = { landlord: landlordId }

  // * Filter by status if provided
  if (status) {
    filter.status = status
  }
  // * Calculate skip value for pagination
  const skip = (page - 1) * limit

  // * Fetch bookings with pagination
  const bookings = await Booking.find(filter).skip(skip).limit(limit)

  // * Count total matching bookings for landlord
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
  getAllBookingsForTenant,
  getAllBookingsForLandlord,
  getBookingById,
  updateBookingStatus,
  deleteBooking
}
