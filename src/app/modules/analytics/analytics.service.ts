import { getLastYearDate } from 'app/utils/getLastYear'

import User from '../auth/auth.user.model'
import Booking from '../booking/booking.model'
import Listing from '../listing/listing.model'

import {
  AdminAnalytics,
  BookingAnalytics,
  Distribution,
  ListingAnalytics,
  TotalCountAnalytics,
  UserAnalytics
} from './analytics.interface'

// * Master Admin Analytics Service
const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  // * User metrics in parallel
  const [totalUsers, activeCount, rolesDistribution] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.aggregate<Distribution>([{ $group: { _id: '$role', count: { $sum: 1 } } }])
  ])
  const inactiveCount = totalUsers - activeCount

  const userAnalytics: UserAnalytics = {
    totalUsers,
    activeCount,
    inactiveCount,
    rolesDistribution
  }

  // * Booking metrics in parallel
  const [totalBookings, statusDistribution, rawMonthly] = await Promise.all([
    Booking.countDocuments(),
    Booking.aggregate<Distribution>([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Booking.aggregate<Distribution>([
      { $match: { createdAt: { $gte: getLastYearDate() } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])
  ])

  // * Normalize monthly bookings to YYYY-MM format
  const monthlyBookings = rawMonthly.map(item => {
    const { year, month } = item._id as unknown as { year: number; month: number }
    const monthStr = month.toString().padStart(2, '0')
    return { month: `${year}-${monthStr}`, count: item.count }
  })

  const bookingAnalytics: BookingAnalytics = {
    statusDistribution,
    monthlyBookings
  }

  // * Listing metrics in parallel
  const [totalListings, avgRentResult, bedroomsDistribution, locationDistribution] =
    await Promise.all([
      Listing.countDocuments(),
      Listing.aggregate<{ averageRent: number }>([
        { $group: { _id: null, averageRent: { $avg: '$rentAmount' } } }
      ]),
      Listing.aggregate<Distribution>([{ $group: { _id: '$bedrooms', count: { $sum: 1 } } }]),
      Listing.aggregate<Distribution>([
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ])
  const averageRent = avgRentResult[0]?.averageRent || 0

  const listingAnalytics: ListingAnalytics = {
    totalListings,
    averageRent,
    bedroomsDistribution,
    locationDistribution
  }

  const totalCountAnalytics: TotalCountAnalytics = {
    totalUsers,
    totalBookings,
    totalListings
  }

  return {
    userAnalytics,
    bookingAnalytics,
    listingAnalytics,
    totalCountAnalytics
  }
}

export const AnalyticsService = {
  getAdminAnalytics
}
