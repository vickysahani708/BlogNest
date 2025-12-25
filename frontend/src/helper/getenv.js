export const getenv = (envname) => {
   const env = import.meta.env
   return env[envname]
}
