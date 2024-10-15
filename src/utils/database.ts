import mongoose from "mongoose";

export const checkCollectionExists = async (
  collectionName: string
): Promise<boolean> => {
  if (!mongoose.connection || !mongoose.connection.db) {
    console.error("Mongoose connection or db is not defined");
    return false; // o lanzar un error
  }

  const collections = await mongoose.connection.db.listCollections().toArray();
  return collections.some((collection) => collection.name === collectionName);
};
