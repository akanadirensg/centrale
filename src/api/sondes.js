export async function fetchStationData(endpoint) {
  try {
    const res = await fetch(endpoint)
    return await res.json()
  } catch (err) {
    console.error('Erreur fetch station', err)
    return null
  }
}

export async function fetchStationLocation(endpoint) {
  const data = await fetchStationData(endpoint)
  return data?.data?.location || null
}
