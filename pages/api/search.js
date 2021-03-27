import { connectToDatabase } from '../../util/mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const data = await db.collection("listingsAndReviews").aggregate([
    {
      $search: {
        search: {
          query: req.query.term,
          path: ["description", "amenities"]
        }
      }
    },
    {
      $project: {
        description: 1,
        amenities: 1
      }
    },
    {
      $limit: 20
    }
  ]).toArray();

  res.json(data);
}