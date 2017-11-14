import Promise from 'bluebird'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import APIError from '../lib/apierror'

/**
 * Post Schema
 */
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
PostSchema.method({})

/**
 * Statics
 */
PostSchema.statics = {
  /**
   * Get post
   * @param {ObjectId} id - The objectId of post.
   * @returns {Promise<Post, APIError>} - returns the post
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(post => {
        if (post) {
          return post
        }
        const err = new APIError('No such post exists!', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      })
  },

  /**
   * List posts in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of posts to be skipped.
   * @param {number} limit - Limit number of posts to be returned.
   * @returns {Promise<Post[]>} - returns a list of posts
   */
  list({skip = 0, limit = 50} = {}) {
    return this.find()
      .sort({createdAt: -1})
      .skip(+skip)
      .limit(+limit)
      .exec()
  },
}

/**
 * @typedef Post
 */
export default mongoose.model('Post', PostSchema)
