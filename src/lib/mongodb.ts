import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<{ conn: Connection }> | null;
  } | undefined;
}

let cached: {
  conn: Connection | null;
  promise: Promise<{ conn: Connection }> | null;
} = global.mongoose ?? { conn: null, promise: null };

async function dbConnect(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => ({
      conn: mongoose.connection,
    }));
  }

  const result = await cached.promise;
  cached.conn = result.conn;
  global.mongoose = cached;

  return cached.conn;
}

export default dbConnect;
