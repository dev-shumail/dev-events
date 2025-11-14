import mongoose, { Mongoose } from "mongoose";

/**
 * Global interface to extend the Node.js global type with our cached connection.
 * This prevents TypeScript errors when accessing the cached connection.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

/**
 * Cached connection object to store the Mongoose connection and promise.
 * In development, Next.js may create multiple instances of the module,
 * so we cache the connection in the global scope to prevent multiple connections.
 */
const cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } =
  global.mongoose || {
    conn: null,
    promise: null,
  };

// Store the cached object in global scope for development hot-reloading
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * MongoDB connection options for optimal performance and reliability.
 */
const mongooseOptions: mongoose.ConnectOptions = {
  bufferCommands: false, // Disable mongoose buffering
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Implements connection caching to prevent multiple connections during development.
 *
 * @returns {Promise<Mongoose>} A promise that resolves to the Mongoose connection instance
 * @throws {Error} If the MongoDB URI is not provided or connection fails
 */
async function connectDB(): Promise<Mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return existing promise if connection is in progress
  if (cached.promise) {
    return cached.promise;
  }

  // Validate MongoDB URI from environment variables
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local or .env"
    );
  }

  // Create new connection promise
  cached.promise = mongoose
    .connect(MONGODB_URI, mongooseOptions)
    .then((mongooseInstance: Mongoose) => {
      // Store the connection instance
      cached.conn = mongooseInstance;
      return mongooseInstance;
    })
    .catch((error: Error) => {
      // Clear the promise on error to allow retry
      cached.promise = null;
      throw error;
    });

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Clear cached promise on error
    cached.promise = null;
    throw error;
  }
}

/**
 * Closes the MongoDB connection gracefully.
 * Useful for cleanup in serverless environments or during shutdown.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is closed
 */
async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export { connectDB, disconnectDB };
export default connectDB;
