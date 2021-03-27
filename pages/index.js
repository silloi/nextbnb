import Head from 'next/head'
import { connectToDatabase } from '../util/mongodb'

export default function Home({ properties }) {

  console.log(properties);

  const book = async (property) => {
    const data = await fetch(`http://localhost:3000/api/book?property_id=${property._id}&guest=Ado`)
    const res = await data.json();
    console.log(res);
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
      </Head>

      <div className="container mx-auto">
        <div className="flex">
          <div className="row w-full text-center my-4">
            <h1 className="text-4xl font-bold mb-5">NextBnB</h1>
          </div>
        </div>
        <div className="flex flex-row flex-wrap">
          {properties && properties.map(property => (
            <div className="flex-auto w-1/4 rounded overflow-hidden shadow-lg m-2" key={property._id}>
              <img className="w-full" src={property.image} />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{property.name} (Up to {property.guests} guests)</div>
                <p>{property.address.street}</p>
                <p className="text-gray-700 text-base">
                  {property.summary}
                </p>
              </div>

              <div className="text-center py-2 my-2 font-bold">
                <span className="text-green-500">${property.price}</span>/night
              </div>

              <div className="text-center py-2 my-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-5 rounded"
                  onClick={() => book(property)}
                >Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase()

  const data = await db.collection("listingsAndReviews").find({}).limit(50).toArray();

  const properties = JSON.parse(JSON.stringify(data));

  const filtered = properties.map(property => {
    const price = JSON.parse(JSON.stringify(property.price))
    return { // props
      _id: property._id,
      name: property.name,
      image: property.images.picture_url,
      address: property.address,
      summary: property.summary,
      guests: property.accommodates,
      price: price.$numberDecimal,
    }
  })

  return {
    props: { properties: filtered },
  }
}
