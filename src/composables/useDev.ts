export default function useDev()
{
    return {
        isDev : import.meta.env.DEV,
        serverRunning : async () =>
        {
          try
          {
              const resp = await fetch( "http://localhost:8080/liveness" );
              const result = await resp.json();
              return result.result === "success";
          }
          catch( e )
          {
              return false;
          }
        }
    }
}