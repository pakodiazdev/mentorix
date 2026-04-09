// MongoDB initialization script
// Creates the application database and a test database

db = db.getSiblingDB('mentorix');

db.createCollection('_init');
db.getCollection('_init').insertOne({ initialized: true, date: new Date() });

// Create test database
db = db.getSiblingDB('mentorix_test');

db.createCollection('_init');
db.getCollection('_init').insertOne({ initialized: true, date: new Date() });
