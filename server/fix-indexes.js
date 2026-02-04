import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finonest');
    console.log('Connected to MongoDB');

    // Get the users collection
    const collection = mongoose.connection.collection('users');

    // Drop old unique indexes on aadhaar and pan
    try {
      await collection.dropIndex('aadhaar_1');
      console.log('✅ Dropped old aadhaar unique index');
    } catch (err) {
      console.log('ℹ️ aadhaar index not found or already dropped');
    }

    try {
      await collection.dropIndex('pan_1');
      console.log('✅ Dropped old pan unique index');
    } catch (err) {
      console.log('ℹ️ pan index not found or already dropped');
    }

    // Create new partial indexes
    await collection.createIndex(
      { aadhaar: 1 },
      { 
        unique: true, 
        partialFilterExpression: { aadhaar: { $type: 'string', $gt: '' } }
      }
    );
    console.log('✅ Created new partial unique index for aadhaar');

    await collection.createIndex(
      { pan: 1 },
      { 
        unique: true, 
        partialFilterExpression: { pan: { $type: 'string', $gt: '' } }
      }
    );
    console.log('✅ Created new partial unique index for pan');

    console.log('✅ All indexes fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes();
