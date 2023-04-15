export default function useDev()
{
  return { isDev : import.meta.env.DEV }
}