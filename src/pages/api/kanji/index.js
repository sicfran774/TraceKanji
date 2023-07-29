import { getKanji } from '@/lib/mongodb/kanji';

const handler = async (request, result) => {
  if(request.method === 'GET'){
    try {
      const kanji = await getKanji()
      
      return result.status(200).json({ kanji })
    } catch (e) {
      return result.status(500).json({ error: error.message })
    }
  }

  result.setHeader('Allow', ['GET'])
  result.status(405).end(`Method ${request.method} is not allowed`)
}

export default handler