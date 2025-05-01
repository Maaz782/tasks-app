import mongoose from 'mongoose';
export class Database {
  private mongoURI: string;

  constructor() {
    this.mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskdb';
  }
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskdb');
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  };
}
