export async function getRoutes(url: string) {
    try {
      const res = await fetch(url)
      const json = await res.json()
      return json
    }
    catch (error) {
      console.log('[LOG] ~ file: index.ts ~ line 165 ~ error', error)
    }
}