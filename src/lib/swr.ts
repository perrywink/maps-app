interface ResponseError extends Error {
  status?: number;
  info?: string
}
const fetcher = async (url: string | URL | Request) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as ResponseError
    // Attach extra info to the error object. Casting is due to TS being not happy with this process.
    error.info = await res.json()
    error.status = res.status
    throw error
  }
  return await res.json();
};

export default fetcher