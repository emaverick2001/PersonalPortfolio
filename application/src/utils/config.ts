const config = {
  env: {
    apiEndpoint: import.meta.env.PUBLIC_API_ENDPOINT!,
    // imagekit: {
    //   publicKey: import.meta.env.PUBLIC_IMAGEKIT_PUBLIC_KEY,
    //   urlEndpoint: import.meta.env.PUBLIC_IMAGEKIT_URL_ENDPOINT,
    //   privateKey: import.meta.env.IMAGEKIT_PRIVATE_KEY,
    // },
    databaseUrl: import.meta.env.DATABASE_URL,
  },
}

export default config
