import mongoose from 'mongoose';
import { logger } from '@/utils/logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduplay_dev';

export const connectDatabase = async (): Promise<void> => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    } as mongoose.ConnectOptions;

    await mongoose.connect(MONGODB_URI, options);

    logger.info('✅ Connected to MongoDB successfully');

    // Create indexes for performance
    await createIndexes();

    // Handle connection events
    mongoose.connection.on('error', (error) => {
      logger.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnected');
    });

  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    // User collection indexes
    await mongoose.connection.db.collection('users').createIndex(
      { email: 1 },
      { unique: true, background: true }
    );
    await mongoose.connection.db.collection('users').createIndex(
      { username: 1 },
      { unique: true, background: true }
    );
    await mongoose.connection.db.collection('users').createIndex(
      { parentCode: 1 },
      { unique: true, sparse: true, background: true }
    );
    await mongoose.connection.db.collection('users').createIndex(
      { role: 1 },
      { background: true }
    );

    // Game collection indexes
    await mongoose.connection.db.collection('games').createIndex(
      { subject: 1, category: 1 },
      { background: true }
    );
    await mongoose.connection.db.collection('games').createIndex(
      { isActive: 1, difficulty: 1 },
      { background: true }
    );
    await mongoose.connection.db.collection('games').createIndex(
      { title: 'text', description: 'text' },
      { background: true }
    );

    // Progress collection indexes
    await mongoose.connection.db.collection('progress').createIndex(
      { userId: 1, gameId: 1 },
      { background: true }
    );
    await mongoose.connection.db.collection('progress').createIndex(
      { userId: 1, createdAt: -1 },
      { background: true }
    );

    // Achievement collection indexes
    await mongoose.connection.db.collection('achievements').createIndex(
      { category: 1, isActive: 1 },
      { background: true }
    );
    await mongoose.connection.db.collection('userachievements').createIndex(
      { userId: 1, achievementId: 1 },
      { unique: true, background: true }
    );

    // Analytics collection indexes
    await mongoose.connection.db.collection('analytics').createIndex(
      { userId: 1, timestamp: -1 },
      { background: true }
    );
    await mongoose.connection.db.collection('analytics').createIndex(
      { eventType: 1, timestamp: -1 },
      { background: true }
    );

    logger.info('✅ Database indexes created successfully');
  } catch (error) {
    logger.error('❌ Failed to create database indexes:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('✅ MongoDB connection closed');
  } catch (error) {
    logger.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};