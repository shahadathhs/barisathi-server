import { getLastYearDate } from 'app/utils/getLastYear'

import User from '../auth/auth.user.model'
import Booking from '../booking/booking.model'
import Listing from '../listing/listing.model'

type Distribution = {
  _id: string | { year: number; month: number }
  count: number
}

type UserAnalytics = {
  totalUsers: number
  activeCount: number
  inactiveCount: number
  rolesDistribution: Distribution[]
}

type BookingAnalytics = {
  statusDistribution: Distribution[]
  monthlyBookings: Distribution[]
}

type ListingAnalytics = {
  totalListings: number
  averageRent: number
  bedroomsDistribution: Distribution[]
  locationDistribution: Distribution[]
}

type TotalCountAnalytics = {
  totalUsers: number
  totalBookings: number
  totalListings: number
}

type AdminAnalytics = {
  userAnalytics: UserAnalytics
  bookingAnalytics: BookingAnalytics
  listingAnalytics: ListingAnalytics
  totalCountAnalytics: TotalCountAnalytics
}

// * Get wishlist for tenant
const getAdminAnalytics = async (): Promise<AdminAnalytics> => {
  const totalUsers = await User.countDocuments()
  const rolesDistribution = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }])
  const activeCount = await User.countDocuments({ isActive: true })
  const inactiveCount = totalUsers - activeCount

  const userAnalytics: UserAnalytics = {
    totalUsers,
    activeCount,
    inactiveCount,
    rolesDistribution
  }

  const totalBookings = await Booking.countDocuments()
  const statusDistribution = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ])

  const monthlyBookings = await Booking.aggregate([
    { $match: { createdAt: { $gte: getLastYearDate() } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ])

  const bookingAnalytics: BookingAnalytics = {
    statusDistribution,
    monthlyBookings
  }

  const totalListings = await Listing.countDocuments()

  const avgRentResult = await Listing.aggregate([
    { $group: { _id: null, averageRent: { $avg: '$rentAmount' } } }
  ])
  const averageRent = avgRentResult[0]?.averageRent || 0

  const bedroomsDistribution = await Listing.aggregate([
    { $group: { _id: '$bedrooms', count: { $sum: 1 } } }
  ])

  const locationDistribution = await Listing.aggregate([
    { $group: { _id: '$location', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])

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

  const analytics: AdminAnalytics = {
    userAnalytics,
    bookingAnalytics,
    listingAnalytics,
    totalCountAnalytics
  }

  return analytics
}

export const AnalyticsService = {
  getAdminAnalytics
}
