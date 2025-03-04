import { httpStatusCode } from '../../enum/statusCode'
import AppError from '../../errorHandling/errors/AppError'

import { IListing } from './listing.interface'
import Listing from './listing.model'

// * Create a new listing
const createListing = async (payload: Partial<IListing>): Promise<IListing> => {
  const listing = await Listing.create(payload)

  const populatedListing = await listing.populate('landlord')
  await populatedListing.save()

  return populatedListing
}

// * Retrieve listings with optional filters (location, bedrooms, etc.)
const getAllListings = async (filters: any = {}): Promise<IListing[]> => {
  const listings = await Listing.find(filters)
  return listings
}

// * Get single listing details by ID
const getListingById = async (id: string): Promise<IListing> => {
  const listing = await Listing.findById(id)
  if (!listing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }
  return listing
}

// * Update listing (only landlord who created it should update)
const updateListing = async (
  id: string,
  payload: Partial<IListing>,
  userId: string
): Promise<IListing> => {
  // * Check if the listing exists
  const existingListing = await Listing.findById(id)
  if (!existingListing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }

  // * Check if the landlord is the owner of the listing
  if (existingListing.landlord.toString() !== userId) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'You are not authorized to update this listing')
  }

  // * Update the listing
  const updatedListing = await Listing.findByIdAndUpdate(id, payload, { new: true })
  if (!updatedListing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }
  return updatedListing
}

// * Delete listing (only landlord who created it should delete)
const deleteListing = async (id: string, userId: string): Promise<IListing> => {
  // * Check if the listing exists
  const existingListing = await Listing.findById(id)
  if (!existingListing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }
  // * Check if the landlord is the owner of the listing
  if (existingListing.landlord.toString() !== userId) {
    throw new AppError(httpStatusCode.FORBIDDEN, 'You are not authorized to delete this listing')
  }

  // * Delete the listing
  const deletedListing = await Listing.findByIdAndDelete(id)
  if (!deletedListing) {
    throw new AppError(httpStatusCode.NOT_FOUND, 'Listing not found')
  }
  return deletedListing
}

export const ListingService = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing
}
